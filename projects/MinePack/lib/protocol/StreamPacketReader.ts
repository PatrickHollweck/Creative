import zlib from "node:zlib";
import EventEmitter from "node:events";

import { TypedEmitter } from "../types/TypeEmitter.js";

import { PacketBuffer } from "../core/PacketBuffer.js";
import { ProtocolContext } from "./ProtocolContext.js";
import { PacketSerializer } from "./PacketSerializer.js";
import { NotEnoughBytesError } from "../core/LimitedLEB128.js";
import { VersionedPacketRegistry } from "./packets/VersionedPacketRegistry.js";
import { Packet, PacketConstructor } from "./packets/Packet.js";

enum ParseState {
	RECEIVE_CONTENT = "RECEIVE_CONTENT",
	RECEIVE_COMPRESSED_HEADER = "RECEIVE_COMPRESSED_HEADER",
	RECEIVE_UNCOMPRESSED_HEADER = "RECEIVE_UNCOMPRESSED_HEADER",
}

type Events = {
	packet: (packet: Packet, type: PacketConstructor, buffer: Buffer) => void;
};

export class StreamPacketReader {
	private state: ParseState;
	private context: ProtocolContext;

	private chunks: Buffer[];
	private parsedCursor: number;

	private currentPacketLength: number | null = null;
	private currentPacketIsCompressed: boolean = false;

	public events: TypedEmitter<Events>;

	constructor(context: ProtocolContext) {
		this.context = context;

		this.chunks = [];
		this.parsedCursor = 0;

		this.state = this.getDefaultParserState();
		this.events = new EventEmitter() as TypedEmitter<Events>;
	}

	public processBytes(chunk: Buffer): void {
		// Keep track of the the chunks we got so far.
		this.chunks.push(chunk);

		// All the bytes we have received so far combined.
		const unparsedBytes = this.getUnparsedBytes();

		switch (this.state) {
			// ## Format of compressed packets ##
			// Uncompressed | Packet Length | VarInt | Compressed length of (Packet ID + Data)
			// Uncompressed | Data Length   | VarInt | Length of uncompressed (Packet ID + Data) or 0
			// Compressed   | Packet-ID     | VarInt | zlib compressed packet ID
			// Compressed   | Content       | Buffer | zlib compressed packet content
			case ParseState.RECEIVE_COMPRESSED_HEADER: {
				const reader = new PacketBuffer(unparsedBytes);

				let packetLength;

				try {
					packetLength = reader.varInt.read(0);
				} catch (error) {
					if (error instanceof NotEnoughBytesError) {
						return;
					}

					throw error;
				}

				let dataLength;

				try {
					dataLength = reader.varInt.read(packetLength.bytesUsed);
				} catch (error) {
					if (error instanceof NotEnoughBytesError) {
						return;
					}

					throw error;
				}

				this.parsedCursor =
					packetLength.bytesUsed + dataLength.bytesUsed;

				// In some cases the packet is uncompressed even when compression is enabled
				// This mainly happens when the packet's length has not reached the threshold
				// In this case the compressed-packet header is still used by the data-length is zero
				this.currentPacketIsCompressed = dataLength.value === 0;

				this.currentPacketLength = this.currentPacketIsCompressed
					? packetLength.value
					: dataLength.value;

				// The next state is to receive the actual packet content
				this.state = ParseState.RECEIVE_CONTENT;

				// We may receive a whole packet at once so we need to start the
				// whole process again in the next parse state.
				if (this.getUnparsedBytes().length > 0) {
					this.processBytes(Buffer.alloc(0));
				}

				break;
			}
			// ## Format of uncompressed packets ##
			// Uncompressed | Packet Length | VarInt | Compressed length of (Packet ID + Data)
			// Uncompressed   | Packet-ID     | VarInt | Unique identifier of the packet
			// Uncompressed   | Content       | Buffer | Content, depends on the connection state and packet ID
			case ParseState.RECEIVE_UNCOMPRESSED_HEADER: {
				const reader = new PacketBuffer(unparsedBytes);

				let packetLength;

				try {
					// Try to read the packet length as a varInt.
					// If a special "continue" bit is set but no more bytes are available
					// then we know that the number is not completely received. In this case
					// this function throws a NotEnoughBytesError which we can catch.
					packetLength = reader.varInt.read(0);
				} catch (error) {
					// This error is thrown when there are no enough bytes to interpret
					// the varInt. We just need to return and wait for more bytes to trickle in.
					if (error instanceof NotEnoughBytesError) {
						return;
					}

					throw error;
				}

				// A VarInt may be up to five bytes long but is most likely shorter
				// therefore we need to keep the "rest" of the received bytes in the
				// buffer for the next parse step since these bytes may already be
				// part of the packetID and/or content
				this.parsedCursor = packetLength.bytesUsed;

				// The read value of the VarInt is the total length of the rest
				// of the packet. It does not include length field itself!
				this.currentPacketLength = packetLength.value;

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
				if (unparsedBytes.length < this.currentPacketLength) {
					return;
				}

				let contentBytes;

				if (this.currentPacketIsCompressed) {
					const unparsedContentBytes =
						this.getUnparsedBytes().subarray(
							0,
							this.currentPacketLength
						);

					// If the packet is compressed we first need to decompress the content
					contentBytes = zlib.unzipSync(unparsedContentBytes);
				} else {
					contentBytes = unparsedBytes;
				}

				const reader = new PacketBuffer(contentBytes);

				// Read the packet-id from the packet metadata.
				// This is needed to determine the type and order of the rest of the packets fields.
				const packetId = reader.varInt.read(0).value;
				const packetType = this.findMatchingPacket(packetId);

				// The parsing of the header removed the length we need to write it to the packet again
				// since the PacketSerializer expects a packet with a uncompressed header
				// TODO: Maybe it would be better to give the PacketSerializer a "length" argument and give it only the "content" bytes
				reader.varInt.write(this.currentPacketLength, 0);

				// When we get here we have received a full packet.
				// Finally, time to interpret it's content!
				const { packet, bytesUsed } = PacketSerializer.unpack(
					reader.toBytes(),
					packetType
				);

				// Emit the packet to the end-user
				this.events.emit("packet", packet, packetType, contentBytes);

				// Update the protocol context based on the received packet
				packet.updateProtocolContext(this.context);

				// Remove the parsed packet from the buffer
				this.parsedCursor += this.currentPacketLength;
				this.chunks = [this.getUnparsedBytes()];

				// Reset state variables.
				this.currentPacketLength = null;
				this.currentPacketIsCompressed = false;

				// Reset to the original state. Ready for the next packet!
				this.state = this.getDefaultParserState();

				// It is possible that we receive multiple packets in one go
				// therefore, if we still have "unused" bytes after parsing the current
				// packet then we have another packet already in the pipeline.
				if (bytesUsed < contentBytes.length) {
					this.processBytes(contentBytes.subarray(bytesUsed));
				}

				break;
			}
		}
	}

	private getUnparsedBytes(): Buffer {
		return Buffer.concat(this.chunks).subarray(this.parsedCursor);
	}

	private getDefaultParserState() {
		return this.context.compression.enabled
			? ParseState.RECEIVE_COMPRESSED_HEADER
			: ParseState.RECEIVE_UNCOMPRESSED_HEADER;
	}

	private findMatchingPacket(packetId: number): PacketConstructor {
		// Get the packet class from the registry based on the minecraft
		// version and the id read from the packet
		const registeredPackets = VersionedPacketRegistry.getPackets(
			this.context.version,
			packetId
		);

		// If the packet is not in the registry, we have an invalid packet.
		if (registeredPackets == null) {
			throw new Error(
				`Invalid packet-id "${packetId}" for minecraft protocol version "${this.context.version}"!`
			);
		}

		const matchingPackets = registeredPackets
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
