import { Packet } from "../Packet.js";

import {
	SendablePacket,
	ProtocolState,
	ProtocolVersion,
} from "../VersionedPacket.js";

@SendablePacket(ProtocolVersion.v761, ProtocolState.Status)
export class StatusRequestPacket extends Packet {
	public readonly packetId = 0x00;
}
