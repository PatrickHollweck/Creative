import { Packet } from "../../../protocol/packets/Packet.js";

import type { PacketBuffer } from "../../PacketBuffer.js";
import type { PacketPropertyMetadata } from "../../../protocol/packets/PacketProperty.js";

export abstract class BaseProtocolType {
	protected buffer: PacketBuffer;
	protected contextObject: object | null = null;

	// Ensure this matches the "ProtocolTypeConstructor" type!
	constructor(buffer: PacketBuffer) {
		this.buffer = buffer;
	}

	public provideMetadata(): Partial<PacketPropertyMetadata> {
		return {};
	}

	public setContextObject(packet: object) {
		this.contextObject = packet;
	}

	public getContextObject(): object | null {
		return this.contextObject;
	}
}
