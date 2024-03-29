import { PrimitiveFixedLengthProtocolType } from "../base/PrimitiveFixedLengthProtocolType.js";

export class Long extends PrimitiveFixedLengthProtocolType<bigint> {
	public readonly byteLength = 8;

	protected getReadFunc(buffer: Buffer): (offset: number) => bigint {
		return buffer.readBigInt64BE.bind(buffer);
	}

	protected getWriteFunc(buffer: Buffer): (value: bigint) => void {
		return (value: bigint) => {
			buffer.writeBigInt64BE.bind(buffer)(BigInt(value));
		};
	}
}
