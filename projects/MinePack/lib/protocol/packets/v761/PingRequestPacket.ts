import { Packet } from "../Packet.js";
import { SendablePacket } from "../VersionedPacket.js";
import { ProtocolVersion } from "../../../ProtocolVersion.js";
import { ProtocolProperty } from "../ProtocolProperty.js";

import { Long } from "../../../core/types/index.js";

@SendablePacket(ProtocolVersion.v761)
export class PingRequestPacket extends Packet {
	public readonly packetId = 0x01;

	@ProtocolProperty(1, Long)
	public payload!: number;
}
