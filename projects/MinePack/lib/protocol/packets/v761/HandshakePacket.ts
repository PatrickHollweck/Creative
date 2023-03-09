import { Packet } from "../Packet";
import { SendOnlyPacket } from "../VersionedPacket";
import { ProtocolVersion } from "../../../ProtocolVersion";
import { ProtocolProperty } from "../ProtocolProperty";

import { VarInt, VarString, UnsignedShort } from "../../../core/types";

@SendOnlyPacket(ProtocolVersion.v761)
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
