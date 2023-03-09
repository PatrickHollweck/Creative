import { Packet } from "../Packet.js";
import { SendablePacket } from "../VersionedPacket.js";
import { ProtocolVersion } from "../../../ProtocolVersion.js";
import { ProtocolProperty } from "../ProtocolProperty.js";

import * as types from "../../../core/types/index.js";

@SendablePacket(ProtocolVersion.v761)
export class PingRequestPacket extends Packet {
	public readonly packetId = 0x00;

	@ProtocolProperty(1, types.VarString)
	public name!: string;

	@ProtocolProperty(2, types.Boolean)
	public hasPlayUUID!: boolean;

	@ProtocolProperty(3, types.UUID)
	public playerUUID!: string;
}
