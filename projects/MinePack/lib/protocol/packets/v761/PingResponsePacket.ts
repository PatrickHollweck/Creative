import { Packet } from "../Packet.js";
import { PacketProperty } from "../PacketProperty.js";

import {
	ProtocolState,
	ProtocolVersion,
	ReceivablePacket,
} from "../VersionedPacket.js";

import * as types from "../../../core/types/index.js";

@ReceivablePacket(ProtocolVersion.v761, ProtocolState.Status)
export class PingResponsePacket extends Packet {
	public readonly packetId = 0x01;

	@PacketProperty(1, types.Long)
	public payload!: number;
}
