import { MetaProtocolType } from "./MetaProtocolType.js";
import { FixedLengthProtocolType } from "./FixedLengthProtocolType.js";
import { SizePrefixedProtocolType } from "./SizePrefixedProtocolType.js";

export abstract class CombiningSizePrefixedProtocolType<
	TComponent,
	TCombined extends Iterable<TComponent>
> extends MetaProtocolType<TComponent, TCombined> {
	protected abstract getShadowedType(): FixedLengthProtocolType<TComponent>;

	protected abstract combineChunks(chunks: TComponent[]): TCombined;

	public read(offset: number): { value: TCombined; bytesUsed: number } {
		const { value, bytesUsed } = this.getImplementation().read(offset);

		return {
			value: this.combineChunks(value),
			bytesUsed,
		};
	}

	public write(iterable: TCombined, offset: number | null = null): void {
		const values = Array.from(iterable);

		return this.getImplementation().write(values, offset);
	}

	private getImplementation() {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;

		const implementation = class extends SizePrefixedProtocolType<TComponent> {
			public get minimumByteLength(): number {
				return this.getShadowedType().byteLength;
			}

			public get maximumByteLength(): number {
				return this.getShadowedType().byteLength;
			}

			protected getShadowedType(): FixedLengthProtocolType<TComponent> {
				return self.getShadowedType();
			}
		};

		return new implementation(this.buffer);
	}
}
