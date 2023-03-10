import c from "chalk";

import { MinecraftClient } from "../lib/MinecraftClient.js";
import { PacketSerializer } from "../lib/protocol/PacketSerializer.js";

function displayHeader(text: string, color: (text: string) => string) {
	console.log(color(text.padEnd(70)));
}

export function attachDisplayHandlers(client: MinecraftClient) {
	client.context.events.on("change", (key, oldValue, newValue) => {
		displayHeader("PROTOCOL CONTEXT CHANGED", c.bgGray.black.bold);
		console.log(c.gray(`## ${key}: ${oldValue} => ${newValue}`));
	});

	client.reader.events.on("packet", (packet, type) => {
		displayHeader(
			`RECEIVED PACKET (${type.name})`,
			c.bgGreenBright.black.bold
		);

		const serialized = JSON.stringify(
			packet,
			(key, value) => {
				return typeof value === "bigint" ? value.toString() : value;
			},
			4
		);

		console.log(c.green(serialized));
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
	});

	client.socket.on("ready", () => {
		displayHeader("SOCKET READY", c.bgYellow.black);
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
		console.log(c.yellow("Reason:", JSON.stringify(reason) || "-"));

		client.disconnect();
	});

	client.socket.on("close", () =>
		displayHeader("SOCKET CLOSED (TERMINATED)", c.bgYellow.black)
	);
}
