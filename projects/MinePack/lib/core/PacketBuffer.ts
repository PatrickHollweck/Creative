const SEGMENT_BITS = 0x7f;
const CONTINUE_BIT = 0x80;

export class PacketBuffer {
	private chunks: Buffer[];

	constructor() {
		this.chunks = [];
	}

	public toBuffer() {
		return Buffer.concat(this.chunks);
	}

	public write = {
		boolean: (value: boolean) => {
			const buffer = Buffer.alloc(1);
			buffer.writeInt8(value === true ? 0x01 : 0x00);
			return this.pushBuffer(buffer);
		},
		sbyte: (value: number) => {
			const buffer = Buffer.alloc(1);
			buffer.writeInt8(value);
			return this.pushBuffer(buffer);
		},
		ubyte: (value: number) => {
			const buffer = Buffer.alloc(1);
			buffer.writeUInt8(value);
			return this.pushBuffer(buffer);
		},
		sbytes: (values: number[]) => {
			for (const value of values) {
				this.write.sbyte(value);
			}
		},
		ubytes: (values: number[]) => {
			for (const value of values) {
				this.write.ubyte(value);
			}
		},
		short: (value: number) => {
			const buffer = Buffer.alloc(2);
			buffer.writeInt16BE(value);
			return this.pushBuffer(buffer);
		},
		ushort: (value: number) => {
			const buffer = Buffer.alloc(2);
			buffer.writeUInt16BE(value);
			return this.pushBuffer(buffer);
		},
		int: (value: number) => {
			const buffer = Buffer.alloc(4);
			buffer.writeInt32BE(value);
			return this.pushBuffer(buffer);
		},
		long: (value: number | bigint) => {
			const buffer = Buffer.alloc(8);

			buffer.writeBigInt64BE(
				typeof value === "bigint" ? value : BigInt(value)
			);

			return this.pushBuffer(buffer);
		},
		float: (value: number) => {
			const buffer = Buffer.alloc(4);
			buffer.writeFloatBE(value);
			return this.pushBuffer(buffer);
		},
		double: (value: number) => {
			const buffer = Buffer.alloc(8);
			buffer.writeDoubleBE(value);
			return this.pushBuffer(buffer);
		},
		string: (value: string) => {
			this.write.varInt(value.length);

			const buffer = Buffer.alloc(value.length);
			buffer.write(value, "utf8");
			return this.pushBuffer(buffer);
		},
		varInt: (value: number) => {
			while (true) {
				if ((value & ~SEGMENT_BITS) == 0) {
					this.write.ubyte(value);

					return this;
				}

				this.write.ubyte((value & SEGMENT_BITS) | CONTINUE_BIT);

				value >>>= 7;
			}
		},
	};

	public read = {
		boolean: (offset: number) => {
			return this.read.sbyte(offset) === 0x00 ? false : true;
		},
		sbyte: (offset: number) => {
			return this.toBuffer().readInt8(offset);
		},
		ubyte: (offset: number) => {
			return this.toBuffer().readUInt8(offset);
		},
		sbytes: (offset: number, count: number) => {
			const bytes = [];

			for (let i = offset; i < count; i++) {
				bytes.push(this.read.sbyte(offset));
			}

			return bytes;
		},
		ubytes: (offset: number, count: number) => {
			const bytes = [];

			for (let i = offset; i < count; i++) {
				bytes.push(this.read.ubyte(offset));
			}

			return bytes;
		},
		short: (offset: number) => {
			return this.toBuffer().readInt16BE(offset);
		},
		ushort: (offset: number) => {
			return this.toBuffer().readUInt16BE(offset);
		},
		int: (offset: number) => {
			return this.toBuffer().readInt32BE(offset);
		},
		long: (offset: number) => {
			return this.toBuffer().readBigInt64BE(offset);
		},
		float: (offset: number) => {
			return this.toBuffer().readFloatBE(offset);
		},
		double: (offset: number) => {
			return this.toBuffer().readDoubleBE(offset);
		},
		string: (offset: number) => {
			const stringLength = this.read.varInt(offset);
			const stringBytes = [];

			for (
				let charIndex = offset + stringLength.bytesRead;
				charIndex <
				offset + stringLength.bytesRead + stringLength.value;
				charIndex++
			) {
				stringBytes.push(this.read.ubyte(charIndex));
			}

			return Buffer.from(stringBytes).toString("utf8");
		},
		varInt: (offset: number) => {
			let value = 0;
			let position = 0;
			let bytesRead = 0;
			let currentByte;

			while (true) {
				currentByte = this.read.ubyte(offset + bytesRead);
				bytesRead++;

				value |= (currentByte & SEGMENT_BITS) << position;

				if ((currentByte & CONTINUE_BIT) == 0) {
					break;
				}

				position += 7;

				if (position >= 32) {
					throw new Error("VarInt is too big");
				}
			}

			return { value, bytesRead };
		},
	};

	private pushBuffer(...buffer: Buffer[]): this {
		this.chunks.push(...buffer);

		return this;
	}
}
