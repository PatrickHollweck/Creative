import * as net from "node:net";

import { ProtocolVersion } from "./ProtocolVersion";

import { StreamPacketWriter } from "./protocol/StreamPacketWriter";
import { StreamPacketReader } from "./protocol/StreamPacketReader";

export class MinecraftClient {
	public readonly reader: StreamPacketReader;
	public readonly writer: StreamPacketWriter;

	public readonly socket: net.Socket;

	constructor(minecraftVersion: ProtocolVersion) {
		this.writer = new StreamPacketWriter();
		this.reader = new StreamPacketReader(minecraftVersion);

		this.socket = new net.Socket();
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
