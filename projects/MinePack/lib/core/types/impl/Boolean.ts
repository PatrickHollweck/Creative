import { FixedLengthProtocolType } from "../base/FixedLengthProtocolType.js";

export class Boolean extends FixedLengthProtocolType<boolean> {
	public readonly byteLength = 1;

	public read(offset: number): boolean {
		return this.buffer.byte.read(offset) === 0x00 ? false : true;
	}

	public write(value: boolean, offset: number | null = null): void {
		const buffer = Buffer.alloc(this.byteLength);
		buffer.writeInt8(value ? 0x01 : 0x00);
		return this.buffer.commitChunk(buffer, offset);
	}
}
