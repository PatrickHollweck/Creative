import { FixedLengthProtocolType } from "../base/FixedLengthProtocolType";
import { CombiningSizePrefixedProtocolType } from "../base/CombiningSizePrefixedProtocolType";

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
	public minimumByteLength = 1;
	// UTF-8 String with VarInt in front. n*4+3 (LIM n: 32767)
	// See https://wiki.vg/Protocol#Data_types
	public maximumByteLength = 131071;

	protected combineChunks(chunks: string[]): string {
		return chunks.join("");
	}

	protected getShadowedType(): FixedLengthProtocolType<string> {
		return new CharacterProtocolType(this.buffer);
	}
}
