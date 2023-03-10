import { Packet } from "../Packet.js";
import { PacketProperty } from "../PacketProperty.js";
import { ProtocolContext } from "../../ProtocolContext.js";

import {
	ProtocolState,
	ProtocolVersion,
	SendablePacket,
} from "../VersionedPacket.js";

import * as types from "../../../core/types/index.js";

@SendablePacket(ProtocolVersion.v761, ProtocolState.Handshake)
export class HandshakePacket extends Packet {
	public readonly packetId = 0x00;

	@PacketProperty(1, types.VarInt)
	public protocolVersion!: number;

	@PacketProperty(2, types.VarString)
	public serverAddress!: string;

	@PacketProperty(3, types.UnsignedShort)
	public serverPort!: number;

	@PacketProperty(4, types.VarInt)
	public nextState!: number;

	public updateProtocolContext(context: ProtocolContext) {
		super.updateProtocolContext(context);

		context.state.update(
			this.nextState === 1 ? ProtocolState.Status : ProtocolState.Login
		);
	}
}
