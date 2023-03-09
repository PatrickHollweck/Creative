import { Packet } from "../Packet.js";
import { ProtocolProperty } from "../ProtocolProperty.js";
import { ProtocolVersion } from "../../../ProtocolVersion.js";
import { ReceivablePacket } from "../VersionedPacket.js";

import { VarString } from "../../../core/types/index.js";

@ReceivablePacket(ProtocolVersion.v761)
export class StatusResponsePacket extends Packet {
	public readonly packetId = 0x00;

	@ProtocolProperty(1, VarString)
	public response!: string;
}
