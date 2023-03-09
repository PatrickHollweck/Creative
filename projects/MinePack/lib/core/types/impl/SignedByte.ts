import { PrimitiveFixedLengthProtocolType } from "../base/PrimitiveFixedLengthProtocolType.js";

export class SignedByte extends PrimitiveFixedLengthProtocolType<number> {
	public readonly byteLength = 1;

	protected getReadFunc(buffer: Buffer): (offset: number) => number {
		return buffer.readInt8.bind(buffer);
	}

	protected getWriteFunc(buffer: Buffer): (value: number) => void {
		return buffer.writeInt8.bind(buffer);
	}
}
