import { PacketBuffer } from "../../PacketBuffer";
import { FixedLengthProtocolType } from "./FixedLengthProtocolType";
import { VariableLengthProtocolType } from "./VariableLengthProtocolType";

export type UnsizedReadWriteProtocolType<T> =
	| FixedLengthProtocolType<T>
	| VariableLengthProtocolType<T>;

export type ProtocolTypeConstructor = new (
	buffer: PacketBuffer
) => UnsizedReadWriteProtocolType<unknown>;
