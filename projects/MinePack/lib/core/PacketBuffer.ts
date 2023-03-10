import * as types from "./types/index.js";

export class PacketBuffer {
	private chunks: Buffer[];

	constructor(...chunks: Buffer[]) {
		if (chunks.length == 0) {
			this.chunks = [Buffer.alloc(0)];
		} else {
			this.chunks = chunks;
		}
	}

	public static readonly empty = new PacketBuffer();

	// Primitives
	public readonly string = new types.VarString(this);
	public readonly boolean = new types.Boolean(this);

	// Unsigned Integer types
	public readonly ubyte = new types.UnsignedByte(this);
	public readonly ushort = new types.UnsignedShort(this);

	// Signed Integer types
	public readonly int = new types.Int(this);
	public readonly long = new types.Long(this);
	public readonly byte = new types.SignedByte(this);
	public readonly short = new types.SignedShort(this);

	// Floating Point types
	public readonly float = new types.Float(this);
	public readonly double = new types.Double(this);

	// Variable Length types
	public readonly varInt = new types.VarInt(this);

	/**
	 * Gets the length (read: amount of bytes) in the combined buffer
	 * @returns {number} The amount of bytes
	 */
	public get length(): number {
		return this.toBytes().length;
	}

	/**
	 * Adds a given buffer to the "parent" PacketBuffer
	 * @param buffer The buffer to add
	 * @param offset Offset of where to insert the given buffers content, if null will insert at the end
	 */
	public commitChunk(buffer: Buffer, offset: number | null): void {
		if (offset === null) {
			this.chunks.push(buffer);
			return;
		}

		const combined = this.toBytes();

		// If the offset is greater of equal to the length of the combined buffer
		// then there is nothing to special to do, just append the given buffer.
		if (offset >= combined.length) {
			return this.commitChunk(buffer, null);
		}

		// If the offset is smaller than the length of the combine buffer
		// then we need to split the combined buffer at the offset and
		// insert a new chunk in between
		if (offset < combined.length) {
			this.chunks = [
				combined.subarray(0, offset),
				buffer,
				combined.subarray(offset),
			];
		}
	}

	/**
	 * Turns the PacketBuffer into a node buffer
	 * @returns {Buffer}
	 */
	public toBytes(): Buffer {
		if (this.chunks.length > 1) {
			const combined = Buffer.concat(this.chunks);

			this.chunks = [combined];

			return combined;
		}

		return this.chunks[0];
	}
}
