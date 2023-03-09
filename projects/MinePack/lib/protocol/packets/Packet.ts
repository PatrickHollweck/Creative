export abstract class Packet {
	// Index signature is needed for sub-classes to add
	// properties for the concrete packet.
	[key: string]: unknown;

	public abstract get packetId(): number;

	public static __protocolProperties__: object[];

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor() {
		// Force empty!
	}
}

export type PacketConstructor = new () => Packet;
