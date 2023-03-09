import { PrimitiveFixedLengthProtocolType } from "../base/PrimitiveFixedLengthProtocolType.js";

export class SignedShort extends PrimitiveFixedLengthProtocolType<number> {
	public readonly byteLength = 2;

	protected getReadFunc(buffer: Buffer): (offset: number) => number {
		return buffer.readInt16BE.bind(buffer);
	}

	protected getWriteFunc(buffer: Buffer): (value: number) => void {
		return buffer.writeInt16BE.bind(buffer);
	}
}
