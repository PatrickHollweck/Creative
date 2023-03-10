import { BitSet } from "../../BitSet.js";
import { PrimitiveFixedLengthProtocolType } from "../base/PrimitiveFixedLengthProtocolType.js";

export class UUID extends PrimitiveFixedLengthProtocolType<bigint> {
	public readonly byteLength = 16;

	protected getReadFunc(buffer: Buffer): (offset: number) => bigint {
		return (offset: number) => {
			const subBuffer = buffer.subarray(offset, offset + this.byteLength);
			const bits = BitSet.fromBuffer(subBuffer);

			return bits.toBigInt();
		};
	}

	protected getWriteFunc(buffer: Buffer): (value: bigint) => void {
		return (value: bigint) => {
			const bits = BitSet.fromBigInt(value);
			const bitLength = this.byteLength * 8;

			bits.padEnd(bitLength);

			if (bits.length !== bitLength) {
				throw new Error(
					`Wrong UUID size! Must be exactly 128bits. (Tried to serialize: "${value}")`
				);
			}

			const [a, b] = bits.chunk(64);

			// A UUID can be written as two 64bit numbers
			buffer.writeBigInt64BE.bind(buffer)(a.toBigInt());
			buffer.writeBigInt64BE.bind(buffer)(b.toBigInt());
		};
	}
}
