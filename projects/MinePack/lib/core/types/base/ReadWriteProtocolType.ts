import { BaseProtocolType } from "./BaseProtocolType.js";
import { IReadableProtocolType } from "./IReadableProtocolType.js";
import { IWritableProtocolType } from "./IWritableProtocolType.js";

export abstract class ReadWriteProtocolType<
		TWriteInput,
		TReadResult,
		TWriteResult = void
	>
	extends BaseProtocolType
	implements
		IWritableProtocolType<TWriteInput>,
		IReadableProtocolType<TReadResult>
{
	public abstract read(offset: number): TReadResult;

	public abstract write(
		value: TWriteInput,
		offset: number | null
	): TWriteResult;
}
