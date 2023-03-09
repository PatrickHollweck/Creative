import { Packet } from "../Packet.js";
import { ProtocolVersion } from "../../../ProtocolVersion.js";
import { ProtocolProperty } from "../ProtocolProperty.js";
import { ReceivablePacket } from "../VersionedPacket.js";

import { Long } from "../../../core/types/index.js";

@ReceivablePacket(ProtocolVersion.v761)
export class PingResponsePacket extends Packet {
	public readonly packetId = 0x01;

	@ProtocolProperty(1, Long)
	public payload!: number;
}
