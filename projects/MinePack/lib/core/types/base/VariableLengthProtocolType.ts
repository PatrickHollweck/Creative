import { ReadWriteProtocolType } from "./ReadWriteProtocolType.js";

export abstract class VariableLengthProtocolType<
	T,
	TWriteResult = void
> extends ReadWriteProtocolType<
	T,
	{ value: T; bytesUsed: number },
	TWriteResult
> {}
