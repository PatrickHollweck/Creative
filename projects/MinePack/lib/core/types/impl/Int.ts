import { PrimitiveFixedLengthProtocolType } from "../base/PrimitiveFixedLengthProtocolType.js";

export class Int extends PrimitiveFixedLengthProtocolType<number> {
	public readonly byteLength = 4;

	protected getReadFunc(buffer: Buffer): (offset: number) => number {
		return buffer.readInt32BE.bind(buffer);
	}

	protected getWriteFunc(buffer: Buffer): (value: number) => void {
		return buffer.writeInt32BE.bind(buffer);
	}
}
