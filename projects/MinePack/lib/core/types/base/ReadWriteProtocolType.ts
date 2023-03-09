import { BaseProtocolType } from "./BaseProtocolType";
import { IReadableProtocolType } from "./IReadableProtocolType";
import { IWritableProtocolType } from "./IWritableProtocolType";

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
