import { PacketBuffer } from "../core/PacketBuffer.js";
import { Packet, PacketConstructor } from "./packets/Packet.js";

import { getPacketFields } from "./packets/PacketProperty.js";

import { FixedLengthProtocolType } from "../core/types/base/FixedLengthProtocolType.js";
import { VariableLengthProtocolType } from "../core/types/base/VariableLengthProtocolType.js";

export class PacketSerializer {
	public static pack(packet: Packet): Buffer {
		const buffer = new PacketBuffer();
		const fields = getPacketFields(this.getPacketType(packet));

		// Write the class defined protocol properties
		for (const field of fields) {
			const protocolType = new field.metadata.type(buffer);
			// @ts-expect-error # We know this field exists because of reflection!
			const value = packet[field.key];

			if (value == null && !field.metadata.isOptional) {
				const typeName = this.getPacketType(packet).name;

				throw new Error(
					`Cannot write null-ish value to packet! (Tried to write field: "${field.key}" on packet "${typeName}")`
				);
			}

			// This any here is needed, we know for sure that the key exists
			// because of reflection. Typescript cant know that though.
			// Therefore we need the any to allow the index
			protocolType.write(value, null);
		}

		// Prepend the packet-id
		buffer.varInt.write(packet.packetId, 0);

		// Prepend the final packet length
		buffer.varInt.write(buffer.toBytes().byteLength, 0);

		return buffer.toBytes();
	}

	public static unpack<TPacket extends Packet>(
		bytes: Uint8Array,
		type: new () => TPacket
	): { packet: TPacket; bytesUsed: number } {
		const inBuffer = new PacketBuffer(Buffer.from(bytes));
		const packetLength = inBuffer.varInt.read(0);

		const packetId = inBuffer.varInt.read(packetLength.bytesUsed);
		// Specifies the offset of the "first content byte". Bytes before that are only metadata.
		const contentOffset = packetLength.bytesUsed + packetId.bytesUsed;

		const packet = new type();
		const fields = getPacketFields(type);

		let relativeContentOffset = 0;
		for (const field of fields) {
			const protocolType = new field.metadata.type(inBuffer);
			const offset = contentOffset + relativeContentOffset;

			let value: unknown, bytesUsed: number;

			if (protocolType instanceof VariableLengthProtocolType) {
				const result = protocolType.read(offset);

				value = result.value;
				bytesUsed = result.bytesUsed;
			} else if (protocolType instanceof FixedLengthProtocolType) {
				value = protocolType.read(offset);
				bytesUsed = protocolType.byteLength;
			} else {
				throw new Error(
					"Cannot determine length of unknown ProtocolType!"
				);
			}

			// @ts-expect-error # We know this field exists because of reflection!
			packet[field.key] = value;

			relativeContentOffset += bytesUsed;
		}

		return {
			packet,
			bytesUsed: contentOffset + relativeContentOffset,
		};
	}

	/**
	 * Gets the constructor of a given packet.
	 * @param packet The packet to get the type of
	 * @returns {PacketConstructor} The constructor
	 */
	public static getPacketType(packet: Packet): PacketConstructor {
		return packet.constructor as PacketConstructor;
	}
}
