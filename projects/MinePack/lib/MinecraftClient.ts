import * as net from "node:net";

import { ProtocolVersion } from "./ProtocolVersion.js";
import { ProtocolContext } from "./protocol/ProtocolContext.js";

import { StreamPacketWriter } from "./protocol/StreamPacketWriter.js";
import { StreamPacketReader } from "./protocol/StreamPacketReader.js";

export class MinecraftClient {
	public readonly socket: net.Socket;
	public readonly reader: StreamPacketReader;
	public readonly writer: StreamPacketWriter;

	public readonly context: ProtocolContext;

	constructor(minecraftVersion: ProtocolVersion) {
		this.context = new ProtocolContext(minecraftVersion);

		this.socket = new net.Socket();
		this.writer = new StreamPacketWriter(this.context);
		this.reader = new StreamPacketReader(this.context);
	}

	connect(address: string, port = 25565): Promise<void> {
		return new Promise((resolve) => {
			this.socket.connect(port, address, () => {
				this.writer.setOutputStream(this.socket);

				this.socket.on("data", (chunk) => {
					this.reader.processBytes(chunk);
				});

				resolve();
			});
		});
	}

	disconnect() {
		this.socket.destroy();
	}
}
