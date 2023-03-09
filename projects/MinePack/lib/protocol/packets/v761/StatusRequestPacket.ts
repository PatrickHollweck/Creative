import { Packet } from "../Packet";
import { SendOnlyPacket } from "../VersionedPacket";
import { ProtocolVersion } from "../../../ProtocolVersion";

@SendOnlyPacket(ProtocolVersion.v761)
export class StatusRequestPacket extends Packet {
	public readonly packetId = 0x00;
}
