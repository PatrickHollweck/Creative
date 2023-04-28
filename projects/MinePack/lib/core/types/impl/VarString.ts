import { FixedLengthProtocolType } from "../base/FixedLengthProtocolType.js";
import { CombiningSizePrefixedProtocolType } from "../base/CombiningSizePrefixedProtocolType.js";

const PROTOCOL_STRING_ENCODING = "utf-8";

class CharacterProtocolType extends FixedLengthProtocolType<string> {
	public readonly byteLength = 1;

	public read(offset: number): string {
		return Buffer.from([this.buffer.ubyte.read(offset)]).toString(
			PROTOCOL_STRING_ENCODING
		);
	}

	public write(value: string, offset: number | null = null): void {
		const buffer = Buffer.alloc(1);
		buffer.write(value, PROTOCOL_STRING_ENCODING);
		this.buffer.commitChunk(buffer, offset);
	}
}

export class VarString extends CombiningSizePrefixedProtocolType<
	string,
	string
> {
	protected combineChunks(chunks: string[]): string {
		return chunks.join("");
	}

	protected getShadowedType(): FixedLengthProtocolType<string> {
		return new CharacterProtocolType(this.buffer);
	}
}
