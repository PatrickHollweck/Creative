import { MetaProtocolType } from "./MetaProtocolType.js";
import { FixedLengthProtocolType } from "./FixedLengthProtocolType.js";

export abstract class SizePrefixedProtocolType<T> extends MetaProtocolType<
	T,
	T[]
> {
	protected abstract getShadowedType(): FixedLengthProtocolType<T>;

	public read(offset: number): { value: T[]; bytesRead: number } {
		// Read the "count" prefix, so that we know how many items of "shadowedType" we need to expect
		const typeCount = this.buffer.varInt.read(offset);

		const contents = [];
		const shadowedType = this.getShadowedType();

		const firstItemOffset = offset + typeCount.bytesRead;
		const contentByteLength = typeCount.value * shadowedType.byteLength;

		// Read the contents
		for (
			// The first "content"-item is located after the given offset plus the bytes we read by reading the count
			let contentIndex = firstItemOffset;
			// Read items until we reached the last content item
			contentIndex < firstItemOffset + contentByteLength;
			// The content index always points to the beginning of a item.
			// This means it must be increased by the byteLength of the item!
			contentIndex += shadowedType.byteLength
		) {
			contents.push(shadowedType.read(contentIndex));
		}

		return {
			value: contents,
			bytesRead: contentByteLength + typeCount.bytesRead,
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
