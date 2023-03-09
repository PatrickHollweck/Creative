import { PacketBuffer } from "../core/PacketBuffer";
import { ProtocolVersion } from "../ProtocolVersion";
import { PacketSerializer } from "./PacketSerializer";
import { Packet, PacketConstructor } from "./packets/Packet";

import {
	VersionedPacketRegistry,
	PacketRegistryEntry,
} from "./packets/VersionedPacketRegistry";

import EventEmitter from "events";
import TypedEmitter from "typed-emitter";

enum ParseState {
	RECEIVE_CONTENT = "RECEIVE_CONTENT",
	RECEIVE_META_LENGTH = "RECEIVE_META_LENGTH",
}

type Events = {
	packet: (packet: Packet) => void;
};

export class StreamPacketReader {
	private state: ParseState;
	private minecraftVersion: ProtocolVersion;

	private packetChunks: Buffer[];
	private futureChunks: Buffer[];
	private currentPacketLength: number | null = null;

	public events: TypedEmitter<Events>;

	constructor(version: ProtocolVersion) {
		this.minecraftVersion = version;

		this.state = ParseState.RECEIVE_META_LENGTH;
		this.events = new EventEmitter() as TypedEmitter<Events>;

		this.packetChunks = [];
		this.futureChunks = [];
	}

	public processBytes(chunk: Buffer): void {
		// Keep track of the the chunks we got so far.
		this.packetChunks.push(chunk);
		this.futureChunks.push(chunk);

		// All the bytes we have received so far combined.
		const currentBytes = this.getFutureBytes();
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
				this.futureChunks = [currentBytes.subarray(result.bytesRead)];

				// The read value of the VarInt is the total length of the rest
				// of the packet. It does not include length field itself!
				this.currentPacketLength = result.value;

				// The next state is to receive the actual packet content
				this.state = ParseState.RECEIVE_CONTENT;

				// We may receive a whole packet at once so we need to start the
				// whole process again in the next parse state.
				if (this.getFutureBytes().length > 0) {
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
					this.minecraftVersion,
					packetId
				);

				// If the packet is not in the registry, we have an invalid packet.
				if (registeredPackets == null) {
					throw new Error(
						`Invalid packet-id "${packetId}" for minecraft version "${this.minecraftVersion}"!`
					);
				}

				// When we get here we have received a full packet.
				// Finally, time to interpret it's content!
				const packet = PacketSerializer.unpack(
					Buffer.concat(this.packetChunks),
					this.findMostVexingPacket(registeredPackets)
				);

				// Emit the packet to the end-user
				this.events.emit("packet", packet);

				// Reset state variables.
				this.futureChunks = [];
				this.packetChunks = [];
				this.currentPacketLength = null;

				// Reset to the original state. Ready for the next packet!
				this.state = ParseState.RECEIVE_META_LENGTH;

				break;
			}
		}
	}

	private getFutureBytes() {
		return Buffer.concat(this.futureChunks);
	}

	private findMostVexingPacket(
		source: PacketRegistryEntry
	): PacketConstructor {
		if (source.length === 1 && source[0].metadata.receivable) {
			return source[0].type;
		}

		// Minecraft sometimes uses the same packet-id for some packets
		// mostly when one these packets can only be sent and one can only
		// be received. Since both are registered, we need to find the one
		// that is receivable.
		const receivablePackets = source.filter(
			(packet) => packet.metadata.receivable
		);

		if (receivablePackets.length === 1) {
			return receivablePackets[0].type;
		}

		// In some cases the filtration by sendable/receivable is not enough!
		// The minecraft protocol still leaves some cases where the
		// packet-id is ambiguous (sigh...). This may be "fine" in the context
		// of a "regular" client since the game can differentiate the packets based
		// on the current protocol and game state. But this library is supposed to be
		// a standalone, therefore we do not have such information.
		// Therefore we use the expected packet length to try and differentiate the
		// packets. This may fail when we get a bogus packet though!!!
		// ------------------
		// We know which fields a packet is supposed to have, using this information we can calculate
		// the expected content length. In most cases the length of the packet we are currently expecting
		// is going to match only one of the available packets. Therefore we see which expected length
		// of the current candidates matches the length of the currently expected packet the closest.
		const candidatesWithMatchingByteLength = receivablePackets.filter(
			(packet) => {
				// Typescript wants this check here because it is stupid sometimes :)
				if (this.currentPacketLength == null) {
					throw new Error(
						"Cannot determine which packet is supposed to be received!"
					);
				}

				const byteLength =
					PacketSerializer.calculatePacketContentLength(packet.type);

				return (
					this.currentPacketLength > byteLength[0] &&
					this.currentPacketLength < byteLength[1]
				);
			}
		);

		if (candidatesWithMatchingByteLength.length === 1) {
			return candidatesWithMatchingByteLength[0].type;
		}

		// TODO: Maybe implement a "context/state/intent" system (as metadata) into the library
		//       which may then be used to differentiate packets. (Handshake phase/Game phase)

		// By this point we did all we could to differentiate the candidates.
		// We can do no more than throw in this case.
		throw new Error(
			"Cannot determine which packet is supposed to be received!"
		);
	}
}
