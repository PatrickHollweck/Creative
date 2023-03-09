import "reflect-metadata";

import {
	PacketMetadata,
	VersionedPacketRegistry,
} from "./VersionedPacketRegistry";

import { ProtocolVersion } from "../../ProtocolVersion";
import { PacketConstructor } from "./Packet";

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

export function SendOnlyPacket(version: ProtocolVersion) {
	return VersionedPacket(version, { sendable: true });
}

export function ReceiveOnlyPacket(version: ProtocolVersion) {
	return VersionedPacket(version, { receivable: true });
}
