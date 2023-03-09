import { Packet } from "../Packet.js";
import { SendablePacket } from "../VersionedPacket.js";
import { ProtocolVersion } from "../../../ProtocolVersion.js";

@SendablePacket(ProtocolVersion.v761)
export class StatusRequestPacket extends Packet {
	public readonly packetId = 0x00;
}
