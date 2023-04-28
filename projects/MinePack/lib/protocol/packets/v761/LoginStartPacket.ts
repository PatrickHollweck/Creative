import { Packet } from "../Packet.js";
import { PacketProperty } from "../PacketProperty.js";

import {
	ProtocolVersion,
	ProtocolState,
	SendablePacket,
} from "../VersionedPacket.js";

import * as types from "../../../core/types/index.js";

@SendablePacket(ProtocolVersion.v761, ProtocolState.Login)
export class LoginStartPacket extends Packet {
	public readonly packetId = 0x00;

	@PacketProperty(1, types.VarString)
	public name!: string;

	@PacketProperty(2, types.Boolean)
	public hasPlayerUUID!: boolean;

	@PacketProperty(
		3,
		types.makeOptional<LoginStartPacket>(types.UUID, (p) => p.hasPlayerUUID)
	)
	public playerUUID?: string;
}
