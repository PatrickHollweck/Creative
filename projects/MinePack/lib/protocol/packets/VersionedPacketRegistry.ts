import { ProtocolVersion } from "../../ProtocolVersion";
import { PacketConstructor } from "./Packet";

export interface PacketMetadata {
	sendable: boolean;
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
		metadata: PacketMetadata = { sendable: false, receivable: false }
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

	public static getPacket(
		version: ProtocolVersion,
		packetID: number
	): PacketRegistryEntry | null {
		return this.versions.get(version)?.get(packetID) ?? null;
	}
}
