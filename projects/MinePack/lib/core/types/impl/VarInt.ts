import { LimitedLEB128 } from "../../LimitedLEB128.js";
import { VariableLengthProtocolType } from "../base/VariableLengthProtocolType.js";

/**
 * This is a implementation of VarInt and VarLong!
 */
export class VarInt extends VariableLengthProtocolType<number, number> {
	public read(offset: number) {
		return LimitedLEB128.toNumber((relativeOffset) => {
			const absoluteOffset = offset + relativeOffset;

			if (
				this.buffer.length <
				absoluteOffset + this.buffer.ubyte.byteLength
			) {
				return null;
			}

			return this.buffer.ubyte.read(absoluteOffset);
		});
	}

	public write(value: number, offset: number | null = null): number {
		const bytes = LimitedLEB128.toBytes(value);

		for (const byte of bytes) {
			this.buffer.ubyte.write(byte, offset);
		}

		return bytes.length;
	}

	public calculateByteLength(value: number): number {
		return LimitedLEB128.toBytes(value).length;
	}
}
