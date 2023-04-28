import { Packet } from "../Packet.js";
import { PacketProperty } from "../PacketProperty.js";

import {
	ProtocolState,
	ProtocolVersion,
	ReceivablePacket,
} from "../VersionedPacket.js";

import * as types from "../../../core/types/index.js";
import { ProtocolContext } from "../../ProtocolContext.js";

class PropertyField {
	@PacketProperty(1, types.VarString)
	public name!: string;

	@PacketProperty(2, types.VarString)
	public value!: string;

	@PacketProperty(3, types.Boolean)
	public isSigned!: boolean;

	@PacketProperty(
		4,
		types.makeOptional<PropertyField>(types.VarString, (p) => p.isSigned)
	)
	public signature?: boolean;
}

const Property = types.makeObject(PropertyField);

@ReceivablePacket(ProtocolVersion.v761, ProtocolState.Login)
export class LoginSuccessPacket extends Packet {
	public readonly packetId = 0x02;

	@PacketProperty(1, types.UUID)
	public uuid!: string;

	@PacketProperty(2, types.VarString)
	public username!: string;

	@PacketProperty(3, types.makeArray(Property))
	public properties!: PropertyField[];

	public updateProtocolContext(context: ProtocolContext): void {
		super.updateProtocolContext(context);

		context.state.update(ProtocolState.Play);
	}
}
