import { ReadWriteProtocolType } from "./ReadWriteProtocolType.js";

export abstract class VariableLengthProtocolType<
	T,
	TWriteResult = void
> extends ReadWriteProtocolType<
	T,
	{ value: T; bytesRead: number },
	TWriteResult
> {
	/**
	 * Minimum amount of bytes this type is using
	 */
	public abstract get minimumByteLength(): number;

	/**
	 * How many bytes this type can use at max.
	 */
	public abstract get maximumByteLength(): number;
}
