import { VarInt } from "../core/types";
import { PacketBuffer } from "../core/PacketBuffer";
import { Packet, PacketConstructor } from "./packets/Packet";

import { getProtocolProperties } from "./packets/ProtocolProperty";

import { FixedLengthProtocolType } from "../core/types/base/FixedLengthProtocolType";
import { VariableLengthProtocolType } from "../core/types/base/VariableLengthProtocolType";

export class PacketSerializer {
	public static pack(packet: Packet): Buffer {
		const buffer = new PacketBuffer();

		const fields = this.getProtocolFields(
			packet.constructor as PacketConstructor
		);

		// Write the class defined protocol properties
		for (const field of fields) {
			const protocolType = new field.metadata.type(buffer);

			protocolType.write(packet[field.key], null);
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
	): TPacket {
		const inBuffer = new PacketBuffer(Buffer.from(bytes));
		const packetLength = inBuffer.varInt.read(0);

		// Quick sanity check :)
		if (inBuffer.length - packetLength.bytesRead !== packetLength.value) {
			throw new Error(
				"The received packet length does not match the length set by the packets content"
			);
		}

		const packetId = inBuffer.varInt.read(packetLength.bytesRead);
		// Specifies the offset of the "first content byte". Bytes before that are only metadata.
		const contentOffset = packetLength.bytesRead + packetId.bytesRead;

		const packet = new type();
		const fields = this.getProtocolFields(type);

		let relativeContentOffset = 0;
		for (const field of fields) {
			const protocolType = new field.metadata.type(inBuffer);
			const offset = contentOffset + relativeContentOffset;

			let value: unknown, bytesRead: number;

			if (protocolType instanceof VariableLengthProtocolType) {
				const result = protocolType.read(offset);

				value = result.value;
				bytesRead = result.bytesRead;
			} else if (protocolType instanceof FixedLengthProtocolType) {
				value = protocolType.read(offset);
				bytesRead = protocolType.byteLength;
			} else {
				throw new Error(
					"Cannot determine length of unknown ProtocolType!"
				);
			}

			// @ts-expect-error # Typescript i know better here :)
			packet[field.key] = value;

			relativeContentOffset += bytesRead;
		}

		return packet;
	}

	/**
	 * Calculates the byte length of a packet.
	 * Since some packets are variable in length it returns an lower and upper bound
	 * @param packet The packet to calculate the length of
	 * @returns [number, number]
	 */
	public static calculatePacketContentLength(packet: PacketConstructor) {
		const fields = this.getProtocolFields(packet);
		const dummyBuffer = new PacketBuffer();

		return fields
			.map((field) => {
				const type = new field.metadata.type(dummyBuffer);

				if (type instanceof FixedLengthProtocolType) {
					return [type.byteLength, type.byteLength];
				}

				if (type instanceof VariableLengthProtocolType) {
					return [type.minimumByteLength, type.maximumByteLength];
				}

				throw new Error("Unknown protocol type!");
			})
			.reduce(
				(total, current) => [
					total[0] + current[0],
					total[1] + current[1],
				],
				// The packet-id (a VarInt) is also technically part of the content
				[
					new VarInt(dummyBuffer).minimumByteLength,
					new VarInt(dummyBuffer).maximumByteLength,
				]
			);
	}

	private static getProtocolFields(type: PacketConstructor) {
		const result = [];

		for (const property of getProtocolProperties(type)) {
			result.push({
				key: property.key,
				metadata: property.metadata,
			});
		}

		return result.sort((a, b) => a.metadata.position - b.metadata.position);
	}
}
