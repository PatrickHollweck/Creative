import { PacketBuffer } from "../core/PacketBuffer.js";
import { Packet, PacketConstructor } from "./packets/Packet.js";

import { FixedLengthProtocolType } from "../core/types/base/FixedLengthProtocolType.js";
import { VariableLengthProtocolType } from "../core/types/base/VariableLengthProtocolType.js";

import {
	getPacketFields,
	KeyedPacketPropertyMetadata,
} from "./packets/PacketProperty.js";

export class PacketSerializer {
	public static pack(packet: Packet): Buffer {
		const buffer = new PacketBuffer();
		const fields = getPacketFields(this.getPacketType(packet));

		this.packToBuffer(packet, null, fields, buffer);

		// Prepend the packet-id
		buffer.varInt.write(packet.packetId, 0);

		// Prepend the final packet length
		buffer.varInt.write(buffer.toBytes().byteLength, 0);

		return buffer.toBytes();
	}

	public static packToBuffer(
		target: object,
		offset: number | null,
		fields: KeyedPacketPropertyMetadata[],
		buffer: PacketBuffer
	): void {
		// Write the class defined protocol properties
		for (const field of fields) {
			const protocolType = new field.metadata.type(buffer);
			// @ts-expect-error # We know this field exists because of reflection!
			const value = target[field.key];

			if (value == null && !field.metadata.isOptional) {
				throw new Error(
					`Cannot write null-ish value to packet! (Tried to write field: "${field.key}")`
				);
			}

			// This any here is needed, we know for sure that the key exists
			// because of reflection. Typescript cant know that though.
			// Therefore we need the any to allow the index
			protocolType.write(value, offset);
		}
	}

	public static unpack<TPacket extends Packet>(
		bytes: Buffer,
		type: new () => TPacket
	): { packet: TPacket; bytesUsed: number } {
		const inBuffer = new PacketBuffer(bytes);

		// Read the header. This is only valid in the context of uncompressed packets.
		const packetLength = inBuffer.varInt.read(0);
		const packetId = inBuffer.varInt.read(packetLength.bytesUsed);

		// Specifies the offset of the "first content byte". Bytes before that are only metadata.
		const contentOffset = packetLength.bytesUsed + packetId.bytesUsed;

		// Gets the unpacked packet
		const result = this.unpackContent(bytes.subarray(contentOffset), type);

		return {
			packet: result.packet,
			bytesUsed: contentOffset + result.bytesUsed,
		};
	}

	public static unpackContent<TPacket extends Packet>(
		bytes: Buffer,
		type: new () => TPacket
	) {
		const packet = new type();
		const fields = getPacketFields(type);
		const inBuffer = new PacketBuffer(bytes);

		const { target, bytesUsed } = this.unpackContentToObject(
			packet,
			fields,
			inBuffer
		);

		return {
			packet: target,
			bytesUsed,
		};
	}

	public static unpackContentToObject<T extends object>(
		target: T,
		fields: KeyedPacketPropertyMetadata[],
		inBuffer: PacketBuffer,
		inOffset: number = 0
	) {
		let offset = inOffset;

		for (const field of fields) {
			const protocolType = new field.metadata.type(inBuffer);

			protocolType.setContextObject(target);

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
			target[field.key] = value;

			offset += bytesUsed;
		}

		return {
			target,
			bytesUsed: offset,
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
