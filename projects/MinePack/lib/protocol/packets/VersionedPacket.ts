import "reflect-metadata";

import {
	PacketMetadata,
	VersionedPacketRegistry,
} from "./VersionedPacketRegistry.js";

import { ProtocolState } from "../ProtocolState.js";
import { ProtocolVersion } from "../../ProtocolVersion.js";
import { PacketConstructor } from "./Packet.js";

// Convenience exports
export { ProtocolState, ProtocolVersion };

/**
 * Decorates a Packet with its required metadata
 *
 * Packets decorated with this function are automatically registered
 * in the packet registry when loaded!
 *
 * @param version The protocol-version
 * @param state The protocol-state in which the packet is valid
 * @param metadata Optional metadata
 * @returns The packet
 */
export function VersionedPacket(
	version: ProtocolVersion,
	state: ProtocolState,
	metadata: Partial<PacketMetadata>
): ClassDecorator {
	return (classConstructor) => {
		VersionedPacketRegistry.registerPacket(
			version,
			// TODO: Nasty cast...
			classConstructor as unknown as PacketConstructor,
			{ sendable: false, receivable: false, ...metadata, state }
		);
	};
}

export function SendablePacket(
	version: ProtocolVersion,
	state: ProtocolState,
	metadata?: Partial<PacketMetadata>
) {
	return VersionedPacket(version, state, { sendable: true, ...metadata });
}

export function ReceivablePacket(
	version: ProtocolVersion,
	state: ProtocolState,
	metadata?: Partial<PacketMetadata>
) {
	return VersionedPacket(version, state, { receivable: true, ...metadata });
}
