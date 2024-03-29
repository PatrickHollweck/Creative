import { Packet } from "../Packet.js";
import { PacketProperty } from "../PacketProperty.js";

import {
	ProtocolState,
	ProtocolVersion,
	ReceivablePacket,
} from "../VersionedPacket.js";

import * as types from "../../../core/types/index.js";

@ReceivablePacket(ProtocolVersion.v761, ProtocolState.Status)
export class StatusResponsePacket extends Packet {
	public readonly packetId = 0x00;

	@PacketProperty(1, types.VarString)
	public response!: string;
}
