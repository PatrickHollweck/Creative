import { ProtocolState } from "../ProtocolState.js";
import { ProtocolVersion } from "../../ProtocolVersion.js";

import { PacketConstructor } from "./Packet.js";

export interface PacketMetadata {
	// The protocol-state in which the packet is valid
	state: ProtocolState;
	// If the packet can be sent by the client
	sendable: boolean;
	// If the packet can be received by the client
	receivable: boolean;
}

export type PacketRegistryEntry = {
	type: PacketConstructor;
	metadata: PacketMetadata;
}[];

export type PacketRegistry = Map<number, PacketRegistryEntry>;

export class VersionedPacketRegistry {
	private static versions: Map<ProtocolVersion, PacketRegistry> = new Map<
		ProtocolVersion,
		PacketRegistry
	>();

	public static registerPacket(
		version: ProtocolVersion,
		packet: PacketConstructor,
		metadata: PacketMetadata
	) {
		if (!this.versions.has(version)) {
			this.versions.set(version, new Map());
		}

		const packetId = new packet().packetId;
		const versionRegistry = this.versions.get(version);

		versionRegistry?.set(packetId, [
			{ metadata, type: packet },
			...(versionRegistry.get(packetId) ?? []),
		]);
	}

	public static getPackets(
		version: ProtocolVersion,
		packetID: number
	): PacketRegistryEntry | null {
		return this.versions.get(version)?.get(packetID) ?? null;
	}
}
