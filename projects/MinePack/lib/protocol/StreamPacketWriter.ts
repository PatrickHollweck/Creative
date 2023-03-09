import EventEmitter from "events";
import TypedEmitter from "typed-emitter";

import { Packet } from "./packets/Packet";
import { PacketSerializer } from "./PacketSerializer";

import { Writable } from "node:stream";

type Events = {
	sendComplete: (packet: Packet, bytes: Buffer) => void;
};

export class StreamPacketWriter {
	private output: Writable | null = null;

	public events: TypedEmitter<Events>;

	constructor() {
		this.events = new EventEmitter() as TypedEmitter<Events>;
	}

	public sendPacket(packet: Packet): Promise<void> {
		const bytes = PacketSerializer.pack(packet);

		return new Promise((resolve) => {
			if (this.output == null) {
				throw new Error("Output stream not set!");
			}

			this.output.write(bytes, "binary", (error) => {
				// TODO: Respect this error flag here.
				console.log("SOCKET WRITE DONE # Error:", error);

				this.events.emit("sendComplete", packet, bytes);

				resolve();
			});
		});
	}

	public setOutputStream(output: Writable) {
		this.output = output;
	}
}