import { ProtocolTypeConstructor } from "../base/ProtocolType.js";

import { FixedLengthProtocolType } from "../base/FixedLengthProtocolType.js";
import { VariableLengthProtocolType } from "../base/VariableLengthProtocolType.js";
import { PacketPropertyMetadata } from "../../../protocol/packets/PacketProperty.js";

export function makeOptional(
	type: ProtocolTypeConstructor
): ProtocolTypeConstructor {
	return class Optional extends VariableLengthProtocolType<unknown, unknown> {
		public get minimumByteLength(): number {
			return 0;
		}

		public get maximumByteLength(): number {
			const instance = this.makeSuperInstance();

			if (instance instanceof FixedLengthProtocolType) {
				return instance.byteLength;
			}

			if (instance instanceof VariableLengthProtocolType) {
				return instance.maximumByteLength;
			}

			throw new Error("Unknown sized protocol type");
		}

		public read(offset: number): { value: unknown; bytesUsed: number } {
			const instance = this.makeSuperInstance();

			// TODO: How do we figure out if the data is present when reading??? Maybe some kind of callback?

			if (instance instanceof FixedLengthProtocolType) {
				return {
					value: instance.read(offset),
					bytesUsed: instance.byteLength,
				};
			}

			if (instance instanceof VariableLengthProtocolType) {
				return instance.read(offset);
			}

			throw new Error("Unknown sized protocol type");
		}

		public write(value: unknown, offset: number | null): void {
			// This value is optional. So if a null-ish value was
			// provided, that means we do not write it to the packet.
			if (value == null) {
				return;
			}

			return this.makeSuperInstance().write(value, offset);
		}

		public provideMetadata(): Partial<PacketPropertyMetadata> {
			return {
				...super.provideMetadata(),
				isOptional: true,
			};
		}

		private makeSuperInstance() {
			return new type(this.buffer);
		}
	};
}
