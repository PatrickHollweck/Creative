import { PacketBuffer } from "../../PacketBuffer.js";
import { FixedLengthProtocolType } from "./FixedLengthProtocolType.js";
import { VariableLengthProtocolType } from "./VariableLengthProtocolType.js";

export type UnsizedReadWriteProtocolType<T> =
	| FixedLengthProtocolType<T>
	| VariableLengthProtocolType<T>;

export type ProtocolTypeConstructor = new (
	buffer: PacketBuffer
) => UnsizedReadWriteProtocolType<unknown>;
