import { Packet } from "../Packet.js";
import { SendablePacket } from "../VersionedPacket.js";
import { ProtocolVersion } from "../../../ProtocolVersion.js";
import { ProtocolProperty } from "../ProtocolProperty.js";

import { VarInt, VarString, UnsignedShort } from "../../../core/types/index.js";

@SendablePacket(ProtocolVersion.v761)
export class HandshakePacket extends Packet {
	public readonly packetId = 0x00;

	@ProtocolProperty(1, VarInt)
	public protocolVersion!: number;

	@ProtocolProperty(2, VarString)
	public serverAddress!: string;

	@ProtocolProperty(3, UnsignedShort)
	public serverPort!: number;

	@ProtocolProperty(4, VarInt)
	public nextState!: number;
}
