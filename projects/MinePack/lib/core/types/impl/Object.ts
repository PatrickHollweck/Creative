import { getPacketFields } from "../../../protocol/packets/PacketProperty.js";
import { PacketSerializer } from "../../../protocol/PacketSerializer.js";

import {
	ProtocolTypeConstructor,
	VariableLengthProtocolType,
} from "../base/index.js";

export function makeObject(
	type: new (...args: any[]) => object
): ProtocolTypeConstructor<VariableLengthProtocolType<object>> {
	const fields = getPacketFields(type);

	return class ObjectType extends VariableLengthProtocolType<object> {
		public read(offset: number): { value: object; bytesUsed: number } {
			const result = PacketSerializer.unpackContentToObject(
				{},
				fields,
				this.buffer,
				offset
			);

			return {
				value: result.target,
				bytesUsed: result.bytesUsed,
			};
		}

		public write(value: object, offset: number | null): void {
			return PacketSerializer.packToBuffer(
				value,
				offset,
				fields,
				this.buffer
			);
		}
	};
}
