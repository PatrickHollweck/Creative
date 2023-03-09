import "reflect-metadata";

import {
	PacketMetadata,
	VersionedPacketRegistry,
} from "./VersionedPacketRegistry.js";

import { ProtocolVersion } from "../../ProtocolVersion.js";
import { PacketConstructor } from "./Packet.js";

export function VersionedPacket(
	version: ProtocolVersion,
	metadata: Partial<PacketMetadata>
): ClassDecorator {
	return (classConstructor) => {
		VersionedPacketRegistry.registerPacket(
			version,
			// TODO: Nasty cast...
			classConstructor as unknown as PacketConstructor,
			{ sendable: false, receivable: false, ...metadata }
		);
	};
}

export function SendablePacket(version: ProtocolVersion) {
	return VersionedPacket(version, { sendable: true });
}

export function ReceivablePacket(version: ProtocolVersion) {
	return VersionedPacket(version, { receivable: true });
}
