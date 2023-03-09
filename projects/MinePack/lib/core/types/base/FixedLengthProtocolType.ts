import { ReadWriteProtocolType } from './ReadWriteProtocolType';

export abstract class FixedLengthProtocolType<T> extends ReadWriteProtocolType<
	T,
	T
> {
	public abstract get byteLength(): number;
}
