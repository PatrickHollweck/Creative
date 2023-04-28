import {
	ProtocolTypeConstructor,
	VariableLengthProtocolType,
	SizePrefixedVariableLengthProtocolType,
} from "../base/index.js";

export function makeArray<T>(
	type: ProtocolTypeConstructor<VariableLengthProtocolType<T>>
): ProtocolTypeConstructor {
	return class Array extends SizePrefixedVariableLengthProtocolType<T> {
		protected getShadowedType(): VariableLengthProtocolType<T> {
			return new type(this.buffer);
		}
	};
}
