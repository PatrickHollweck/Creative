import { PacketPropertyMetadata } from "../../../protocol/packets/PacketProperty.js";

import {
	ProtocolTypeConstructor,
	FixedLengthProtocolType,
	VariableLengthProtocolType,
} from "../base/index.js";

export function makeOptional<TPacket extends object>(
	type: ProtocolTypeConstructor,
	readPredicate: (packet: TPacket) => boolean
): ProtocolTypeConstructor {
	return class Optional extends VariableLengthProtocolType<unknown, unknown> {
		public read(offset: number): { value: unknown; bytesUsed: number } {
			const instance = this.makeSuperInstance();

			if (!readPredicate(instance.getContextObject() as unknown as any)) {
				return {
					value: null,
					bytesUsed: 0,
				};
			}

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
