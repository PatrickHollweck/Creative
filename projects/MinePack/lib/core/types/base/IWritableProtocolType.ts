export interface IWritableProtocolType<TInput> {
	write(value: TInput, offset: number | null): void;
}
