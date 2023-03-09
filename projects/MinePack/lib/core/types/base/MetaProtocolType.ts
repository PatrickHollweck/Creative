import { FixedLengthProtocolType } from "./FixedLengthProtocolType.js";
import { VariableLengthProtocolType } from "./VariableLengthProtocolType.js";

export abstract class MetaProtocolType<
	// Type of content of the shadowed protocol type
	TShadowContent,
	// Type of the read/write protocol functions
	TProtocolContent
> extends VariableLengthProtocolType<TProtocolContent> {
	protected abstract getShadowedType(): FixedLengthProtocolType<TShadowContent>;
}
