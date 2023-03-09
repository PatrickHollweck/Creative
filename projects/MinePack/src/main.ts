import c from "chalk";

import { MinecraftClient } from "../lib/MinecraftClient.js";
import { ProtocolVersion } from "../lib/ProtocolVersion.js";
import { PacketSerializer } from "../lib/protocol/PacketSerializer.js";

import { waitForPacket } from "../lib/protocol/packets/util.js";

import * as packets from "../lib/protocol/packets/v761/index.js";

function displayHeader(text: string, color: (text: string) => string) {
	console.log(color(text.padEnd(70)));
}

const client = new MinecraftClient(ProtocolVersion.v761);

const host = "minecraft.patrickhollweck.de";
const port = 25565;

client.reader.events.on("packet", (packet, type) => {
	displayHeader(`RECEIVED PACKET (${type.name})`, c.bgGreenBright.black.bold);
	console.log(c.green(JSON.stringify(packet, null, 4)));
});

client.writer.events.on("sendComplete", (packet, buffer) => {
	const type = PacketSerializer.getPacketType(packet);

	displayHeader(`PACKET SENT (${type.name})`, c.bgBlueBright.black.bold);
	console.log(c.blue("## AS HEX:", buffer.toString("hex")));
	console.log(c.blue(JSON.stringify(packet, null, 4)));
});

client.writer.events.on("sendError", (error) => {
	displayHeader("PACKET SEND ERROR", c.bgRed.black.bold);
	console.log(c.red(JSON.stringify(error, null, 4)));
});

client.socket.on("connect", () => {
	displayHeader("SOCKET CONNECTED", c.bgYellow.black);
	console.log(c.yellow(`## ${host}:${port}`));
});

client.socket.on("data", (chunk: Buffer) => {
	displayHeader("SOCKET DATA RECEIVED", c.bgGray.black.bold);
	console.log(c.gray("## AS HEX:", chunk.toString("hex")));
	console.log(c.gray("## AS UTF:", chunk.toString("utf-8")));
});

client.socket.on("error", (error) => {
	displayHeader("SOCKET ERROR", c.bgRed.black.bold);
	console.error(c.red(JSON.stringify(error, null, 4)));
});

client.socket.on("end", (reason: unknown) => {
	displayHeader("SOCKET END", c.bgYellow.black);
	console.log(c.yellow(JSON.stringify(reason)));
});

client.socket.on("close", () =>
	displayHeader("SOCKET CLOSED (TERMINATED)", c.bgYellow.black)
);

await client.connect(host, port);

const handshakePacket = new packets.HandshakePacket();
handshakePacket.nextState = 1;
handshakePacket.serverPort = port;
handshakePacket.serverAddress = host;
handshakePacket.protocolVersion = 761;

await client.writer.sendPacket(handshakePacket);
await client.writer.sendPacket(new packets.StatusRequestPacket());

await waitForPacket(client.reader, packets.StatusResponsePacket);

setInterval(() => {
	const packet = new packets.PingRequestPacket();
	packet.payload = Date.now().valueOf();

	void client.writer.sendPacket(packet);
}, 2000);
