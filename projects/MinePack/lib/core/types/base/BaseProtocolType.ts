import type { PacketBuffer } from "../../PacketBuffer.js";
import type { PacketPropertyMetadata } from "../../../protocol/packets/PacketProperty.js";

export abstract class BaseProtocolType {
	protected buffer: PacketBuffer;

	// Ensure this matches the "ProtocolTypeConstructor" type!
	constructor(buffer: PacketBuffer) {
		this.buffer = buffer;
	}

	public provideMetadata(): Partial<PacketPropertyMetadata> {
		return {};
	}
}
