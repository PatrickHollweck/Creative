import { StreamPacketReader } from "../StreamPacketReader.js";
import { PacketConstructor, Packet } from "./Packet.js";

export function isPacket<TPacketConstructor extends PacketConstructor>(
	input: Packet,
	expected: TPacketConstructor
): input is InstanceType<TPacketConstructor> {
	return input.packetId === new expected().packetId;
}

export function waitForPacket<TPacket extends PacketConstructor>(
	reader: StreamPacketReader,
	type: TPacket
): Promise<InstanceType<TPacket>> {
	return new Promise((resolve) => {
		const listener = (packet: Packet) => {
			if (isPacket(packet, type)) {
				reader.events.off("packet", listener);
				resolve(packet);
			}
		};

		reader.events.on("packet", listener);
	});
}
