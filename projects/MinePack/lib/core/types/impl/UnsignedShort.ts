import { PrimitiveFixedLengthProtocolType } from "../base/PrimitiveFixedLengthProtocolType.js";

export class UnsignedShort extends PrimitiveFixedLengthProtocolType<number> {
	public readonly byteLength = 2;

	protected getReadFunc(buffer: Buffer): (offset: number) => number {
		return buffer.readUInt16BE.bind(buffer);
	}

	protected getWriteFunc(buffer: Buffer): (value: number) => void {
		return buffer.writeUInt16BE.bind(buffer);
	}
}
