import EventEmitter from "node:events";
import { Writable } from "node:stream";
import { TypedEmitter } from "../types/TypeEmitter.js";

import { Packet } from "./packets/Packet.js";
import { ProtocolContext } from "./ProtocolContext.js";
import { PacketSerializer } from "./PacketSerializer.js";

type Events = {
	sendError: (error: Error, packet: Packet) => void;
	sendComplete: (packet: Packet, bytes: Buffer) => void;
};

export class StreamPacketWriter {
	private output: Writable | null = null;
	private context: ProtocolContext;

	public events: TypedEmitter<Events>;

	constructor(context: ProtocolContext) {
		this.events = new EventEmitter() as TypedEmitter<Events>;
		this.context = context;
	}

	public sendPacket(packet: Packet): Promise<void> {
		const bytes = PacketSerializer.pack(packet);

		return new Promise((resolve) => {
			if (this.output == null) {
				throw new Error("Output stream not set!");
			}

			this.output.write(bytes, "binary", (error) => {
				if (error == null) {
					this.events.emit("sendComplete", packet, bytes);
					packet.updateProtocolContext(this.context);
				} else {
					this.events.emit("sendError", error, packet);
				}

				resolve();
			});
		});
	}

	public setOutputStream(output: Writable) {
		this.output = output;
	}
}
