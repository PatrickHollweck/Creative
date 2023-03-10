// See: https://wiki.vg/Protocol#VarInt_and_VarLong

export class NotEnoughBytesError extends Error {}

export class LimitedLEB128 {
	private static SEGMENT_BITS = 0x7f;
	private static CONTINUE_BIT = 0x80;

	public static toBytes(value: number): number[] {
		const bytes = [];

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
		while (true) {
			if ((value & ~this.SEGMENT_BITS) == 0) {
				bytes.push(value);

				return bytes;
			}

			bytes.push((value & this.SEGMENT_BITS) | this.CONTINUE_BIT);

			value >>>= 7;
		}
	}

	public static toNumber(nextByte: (offset: number) => number | null): {
		value: number;
		bytesUsed: number;
	} {
		let value = 0;
		let position = 0;
		let bytesUsed = 0;
		let currentByte;

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition
		while (true) {
			currentByte = nextByte(bytesUsed);

			if (currentByte == null) {
				throw new NotEnoughBytesError();
			}

			bytesUsed++;

			value |= (currentByte & this.SEGMENT_BITS) << position;

			if ((currentByte & this.CONTINUE_BIT) == 0) {
				break;
			}

			position += 7;

			if (position >= 32) {
				throw new Error("VarInt is too big");
			}
		}

		return { value, bytesUsed };
	}
}
