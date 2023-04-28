import { MetaProtocolType } from "./MetaProtocolType.js";
import { VariableLengthProtocolType } from "./VariableLengthProtocolType.js";

export abstract class SizePrefixedVariableLengthProtocolType<
	T
> extends MetaProtocolType<T, T[], VariableLengthProtocolType<T>> {
	protected abstract getShadowedType(): VariableLengthProtocolType<T>;

	public read(offset: number): { value: T[]; bytesUsed: number } {
		// Read the "count" prefix, so that we know how many items of "shadowedType" we need to expect
		const typeCount = this.buffer.varInt.read(offset);

		const contents = [];
		const shadowedType = this.getShadowedType();
		const firstItemOffset = offset + typeCount.bytesUsed;

		// Read the contents
		let totalBytesUsed = 0;
		for (let i = 0; i < typeCount.value; i++) {
			const result = shadowedType.read(firstItemOffset + totalBytesUsed);

			contents.push(result.value);
			totalBytesUsed += result.bytesUsed;
		}

		return {
			value: contents,
			bytesUsed: totalBytesUsed + typeCount.bytesUsed,
		};
	}

	public write(values: T[], offset: number | null = null): void {
		const shadowedType = this.getShadowedType();

		// Prefix content with the count of items following it.
		const prefixLength = this.buffer.varInt.write(values.length, offset);

		// Write the contents
		for (const [index, value] of values.entries()) {
			shadowedType.write(
				value,
				offset ? offset + index + prefixLength : null
			);
		}
	}
}
