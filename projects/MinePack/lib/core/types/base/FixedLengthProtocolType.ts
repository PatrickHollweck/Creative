import { ReadWriteProtocolType } from "./ReadWriteProtocolType.js";

export abstract class FixedLengthProtocolType<T> extends ReadWriteProtocolType<
	T,
	T
> {
	public abstract get byteLength(): number;
}
