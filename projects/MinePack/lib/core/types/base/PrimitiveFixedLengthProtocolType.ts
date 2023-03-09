import { FixedLengthProtocolType } from "./FixedLengthProtocolType";

export abstract class PrimitiveFixedLengthProtocolType<
	T
> extends FixedLengthProtocolType<T> {
	protected abstract getReadFunc(buffer: Buffer): (offset: number) => T;
	protected abstract getWriteFunc(buffer: Buffer): (value: T) => void;

	public read(offset: number): T {
		const buffer = this.buffer.combineChunks();
		const reader = this.getReadFunc(buffer);

		return reader(offset);
	}

	public write(value: T, offset: number | null = null): void {
		const buffer = Buffer.alloc(this.byteLength);
		const writer = this.getWriteFunc(buffer);

		writer(value);

		return this.buffer.commitChunk(buffer, offset);
	}
}