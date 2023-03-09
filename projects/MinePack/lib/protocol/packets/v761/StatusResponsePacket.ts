import { Packet } from "../Packet";
import { ProtocolProperty } from "../ProtocolProperty";
import { ProtocolVersion } from "../../../ProtocolVersion";
import { ReceiveOnlyPacket } from "../VersionedPacket";

import { VarString } from "../../../core/types";

@ReceiveOnlyPacket(ProtocolVersion.v761)
export class StatusResponsePacket extends Packet {
	public readonly packetId = 0x00;

	@ProtocolProperty(1, VarString)
	public response!: string;
}
