import { PrimitiveFixedLengthProtocolType } from "../base/PrimitiveFixedLengthProtocolType.js";

export class Float extends PrimitiveFixedLengthProtocolType<number> {
	public readonly byteLength = 4;

	protected getReadFunc(buffer: Buffer): (offset: number) => number {
		return buffer.readFloatBE.bind(buffer);
	}

	protected getWriteFunc(buffer: Buffer): (value: number) => void {
		return buffer.writeFloatBE.bind(buffer);
	}
}
