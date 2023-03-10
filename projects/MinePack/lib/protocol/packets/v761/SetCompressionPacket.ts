import { Packet } from "../Packet.js";
import { PacketProperty } from "../PacketProperty.js";

import {
	ProtocolState,
	ProtocolVersion,
	ReceivablePacket,
} from "../VersionedPacket.js";

import * as types from "../../../core/types/index.js";
import { ProtocolContext } from "../../ProtocolContext.js";

@ReceivablePacket(ProtocolVersion.v761, ProtocolState.Login)
export class SetCompressionPacket extends Packet {
	public readonly packetId = 0x03;

	@PacketProperty(1, types.VarInt)
	public threshold!: number;

	public updateProtocolContext(context: ProtocolContext): void {
		super.updateProtocolContext(context);

		context.compression.setEnabled(true);
		context.compression.setThreshold(this.threshold);
	}
}
