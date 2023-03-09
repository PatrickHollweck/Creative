import { PrimitiveFixedLengthProtocolType } from "../base/PrimitiveFixedLengthProtocolType";

export class UnsignedByte extends PrimitiveFixedLengthProtocolType<number> {
	public readonly byteLength = 1;

	protected getReadFunc(buffer: Buffer): (offset: number) => number {
		return buffer.readUInt8.bind(buffer);
	}

	protected getWriteFunc(buffer: Buffer): (value: number) => void {
		return buffer.writeUInt8.bind(buffer);
	}
}
