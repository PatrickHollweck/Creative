import { MinecraftClient } from "../lib/MinecraftClient";
import { ProtocolVersion } from "../lib/ProtocolVersion";

import { waitForPacket } from "../lib/protocol/packets/util";

import * as packets from "../lib/protocol/packets/v761";

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
	const client = new MinecraftClient(ProtocolVersion.v761);

	client.reader.events.on("packet", (packet) =>
		console.log("RECEIVED PACKET", JSON.stringify(packet, null, 4))
	);

	client.writer.events.on("sendComplete", (packet, buffer) => {
		console.log("PACKET SENT (OBJ)", packet);
		console.log("PACKET SENT (BIN)", buffer.toString("hex"));
	});

	client.socket.on("data", (chunk: Buffer) => {
		console.log("RECEIVED (BUFFER)", chunk.toString("hex"));
		console.log("RECEIVED (STRING)", chunk.toString("utf-8"));
	});

	client.socket.on("connect", () => console.log("SOCKET CONNECTED"));
	client.socket.on("error", (error) => console.error("ERROR", error));
	client.socket.on("close", () => console.log("SOCKET CLOSED"));
	client.socket.on("end", () => console.log("SOCKET END"));

	await client.connect("minecraft.patrickhollweck.de");

	const handshakePacket = new packets.HandshakePacket();
	handshakePacket.nextState = 1;
	handshakePacket.serverPort = 25565;
	handshakePacket.serverAddress = "minecraft.patrickhollweck.de";
	handshakePacket.protocolVersion = 761;

	console.log("SOCKET BYTES WRITTEN", client.socket.bytesWritten);
	await client.writer.sendPacket(handshakePacket);
	console.log("SOCKET BYTES WRITTEN", client.socket.bytesWritten);

	const statusRequestPacket = new packets.StatusRequestPacket();
	await client.writer.sendPacket(statusRequestPacket);

	const statusResponse = await waitForPacket(
		client.reader,
		packets.StatusResponsePacket
	);

	console.log("GOT RESPONSE", statusResponse.response);
})();
