import { Packet } from "../Packet.js";
import { ProtocolVersion } from "../../../ProtocolVersion.js";
import { ProtocolProperty } from "../ProtocolProperty.js";
import { ReceivablePacket } from "../VersionedPacket.js";

import * as types from "../../../core/types/index.js";

@ReceivablePacket(ProtocolVersion.v761)
export class PingResponsePacket extends Packet {
	public readonly packetId = 0x01;

	@ProtocolProperty(1, types.Long)
	public payload!: number;
}
