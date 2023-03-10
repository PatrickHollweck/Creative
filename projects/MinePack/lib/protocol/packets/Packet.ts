import { ProtocolContext } from "../ProtocolContext.js";

export abstract class Packet {
	public abstract get packetId(): number;

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor() {
		// Force empty!
	}

	public updateProtocolContext(context: ProtocolContext) {}
}

export type PacketConstructor = new () => Packet;
