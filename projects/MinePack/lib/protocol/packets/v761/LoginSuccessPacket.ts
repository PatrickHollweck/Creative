import { Packet } from "../Packet.js";
import { PacketProperty } from "../PacketProperty.js";

import {
	ProtocolState,
	ProtocolVersion,
	ReceivablePacket,
} from "../VersionedPacket.js";

import * as types from "../../../core/types/index.js";

@ReceivablePacket(ProtocolVersion.v761, ProtocolState.Login)
export class LoginSuccessPacket extends Packet {
	public readonly packetId = 0x01;

	@PacketProperty(1, types.UUID)
	public uuid!: string;

	@PacketProperty(2, types.VarString)
	public username!: string;

	@PacketProperty(3, types.VarInt)
	public propertyCount!: number;
}
