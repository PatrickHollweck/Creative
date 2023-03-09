export interface IReadableProtocolType<TOutput> {
	read(offset: number): TOutput;
}
