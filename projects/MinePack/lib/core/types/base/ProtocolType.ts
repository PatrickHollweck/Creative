import { PacketBuffer } from "../../PacketBuffer.js";
import { FixedLengthProtocolType } from "./FixedLengthProtocolType.js";
import { VariableLengthProtocolType } from "./VariableLengthProtocolType.js";

export type UnsizedReadWriteProtocolType<T> =
	| FixedLengthProtocolType<T>
	| VariableLengthProtocolType<T>;

export type ProtocolTypeConstructor<T = UnsizedReadWriteProtocolType<unknown>> =
	new (buffer: PacketBuffer) => T;
