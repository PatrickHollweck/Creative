import EventEmitter from "node:events";
import { TypedEmitter } from "../types/TypeEmitter.js";

import { PacketBuffer } from "../core/PacketBuffer.js";
import { ProtocolContext } from "./ProtocolContext.js";
import { PacketSerializer } from "./PacketSerializer.js";
import { Packet, PacketConstructor } from "./packets/Packet.js";

import {
	PacketRegistryEntry,
	VersionedPacketRegistry,
} from "./packets/VersionedPacketRegistry.js";

enum ParseState {
	RECEIVE_CONTENT = "RECEIVE_CONTENT",
	RECEIVE_META_LENGTH = "RECEIVE_META_LENGTH",
}

type Events = {
	packet: (packet: Packet, type: PacketConstructor, buffer: Buffer) => void;
};

export class StreamPacketReader {
	private state: ParseState;
	private context: ProtocolContext;

	private packetChunks: Buffer[];
	private unparsedChunks: Buffer[];
	private currentPacketLength: number | null = null;

	public events: TypedEmitter<Events>;

	constructor(context: ProtocolContext) {
		this.context = context;

		this.state = ParseState.RECEIVE_META_LENGTH;
		this.events = new EventEmitter() as TypedEmitter<Events>;

		this.packetChunks = [];
		this.unparsedChunks = [];
	}

	public processBytes(chunk: Buffer): void {
		// Keep track of the the chunks we got so far.
		this.packetChunks.push(chunk);
		this.unparsedChunks.push(chunk);

		// All the bytes we have received so far combined.
		const currentBytes = this.getUnparsedBytes();
		// Reader utility for looking at minecraft's data types.
		const reader = new PacketBuffer(currentBytes);

		switch (this.state) {
			case ParseState.RECEIVE_META_LENGTH: {
				// The packet length is a VarInt, which may be up to 5 bytes in length.
				// We do not know how long it is before we actually received it
				// therefore we need to ensure we have at least 5 bytes to interpret.
				if (currentBytes.length < 5) {
					return;
				}

				// By this point we have enough bytes to safely interpret the
				// received bytes. The first field is the length of the packet
				const result = reader.varInt.read(0);

				// A VarInt may be up to five bytes long but is most likely shorter
				// therefore we need to keep the "rest" of the received bytes in the
				// buffer for the next parse step since these bytes may already be
				// part of the packetID and/or content
				this.unparsedChunks = [currentBytes.subarray(result.bytesUsed)];

				// The read value of the VarInt is the total length of the rest
				// of the packet. It does not include length field itself!
				this.currentPacketLength = result.value;

				// The next state is to receive the actual packet content
				this.state = ParseState.RECEIVE_CONTENT;

				// We may receive a whole packet at once so we need to start the
				// whole process again in the next parse state.
				if (this.getUnparsedBytes().length > 0) {
					this.processBytes(Buffer.alloc(0));
				}

				break;
			}
			case ParseState.RECEIVE_CONTENT: {
				// Sanity check.
				if (this.currentPacketLength == null) {
					throw new Error("Invalid parser state!");
				}

				// At this point we know how long the packet we are going to receive
				// is. So before we can interpret any of the content, we need to ensure
				// we have all of it.
				if (currentBytes.length < this.currentPacketLength) {
					return;
				}

				// Read the packet-id from the packet metadata.
				// This is needed to determine the type and order of the rest of the packets fields.
				const packetId = reader.varInt.read(0).value;

				// Get the packet class from the registry based on the minecraft
				// version and the id read from the packet
				const registeredPackets = VersionedPacketRegistry.getPacket(
					this.context.version,
					packetId
				);

				// If the packet is not in the registry, we have an invalid packet.
				if (registeredPackets == null) {
					throw new Error(
						`Invalid packet-id "${packetId}" for minecraft protocol version "${this.context.version}"!`
					);
				}

				const packetBytes = Buffer.concat(this.packetChunks);
				const packetType = this.findMostVexingPacket(registeredPackets);

				// When we get here we have received a full packet.
				// Finally, time to interpret it's content!
				const { packet, bytesUsed } = PacketSerializer.unpack(
					packetBytes,
					packetType
				);

				// Emit the packet to the end-user
				this.events.emit("packet", packet, packetType, packetBytes);

				// Reset state variables.
				this.packetChunks = [];
				this.unparsedChunks = [];
				this.currentPacketLength = null;

				// Reset to the original state. Ready for the next packet!
				this.state = ParseState.RECEIVE_META_LENGTH;

				// It is possible that we receive multiple packets in one go
				// therefore, if we still have "unused" bytes after parsing the current
				// packet then we have another packet already in the pipeline.
				if (bytesUsed < packetBytes.length) {
					this.processBytes(packetBytes.subarray(bytesUsed));
				}

				break;
			}
		}
	}

	private getUnparsedBytes() {
		return Buffer.concat(this.unparsedChunks);
	}

	private findMostVexingPacket(
		source: PacketRegistryEntry
	): PacketConstructor {
		const matchingPackets = source
			// Minecraft sometimes uses the same packet-id for some packets
			// mostly when one these packets can only be sent and one can only
			// be received. Since both are registered, we need to find the one
			// that is receivable.
			.filter((packet) => packet.metadata.receivable)
			// The protocol can be in several different "states"
			// Based on the current state some packets may be valid/invalid
			// We need to filter the candidates based on them.
			.filter(
				(packet) => packet.metadata.state === this.context.state.current
			);

		if (matchingPackets.length === 1) {
			return matchingPackets[0].type;
		}

		// If there is not exactly one matching packet then there is some kind of error
		// either we were sent an invalid packet, or this package does not support it
		// Either way, we can do nothing except throw.
		throw new Error(
			"Cannot determine which packet is supposed to be received!"
		);
	}
}
