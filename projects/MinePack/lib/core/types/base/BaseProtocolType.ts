import type { PacketBuffer } from "../../PacketBuffer.js";

export abstract class BaseProtocolType {
	protected buffer: PacketBuffer;

	// Ensure this matches the "ProtocolTypeConstructor" type!
	constructor(buffer: PacketBuffer) {
		this.buffer = buffer;
	}
}
