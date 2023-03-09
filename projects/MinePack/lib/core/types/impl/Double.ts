import { PrimitiveFixedLengthProtocolType } from "../base/PrimitiveFixedLengthProtocolType";

export class Double extends PrimitiveFixedLengthProtocolType<number> {
	public readonly byteLength = 8;

	protected getReadFunc(buffer: Buffer): (offset: number) => number {
		return buffer.readDoubleBE.bind(buffer);
	}

	protected getWriteFunc(buffer: Buffer): (value: number) => void {
		return buffer.writeDoubleBE.bind(buffer);
	}
}
