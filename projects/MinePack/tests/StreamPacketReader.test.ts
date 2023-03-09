import { isPacket } from "../lib/protocol/packets/util.js";
import { ProtocolVersion } from "../lib/ProtocolVersion.js";
import { PacketSerializer } from "../lib/protocol/PacketSerializer.js";
import { StreamPacketReader } from "../lib/protocol/StreamPacketReader.js";

import * as packets from "../lib/protocol/packets/v761/index.js";

describe("StreamPacketReader", () => {
	it("should work", (done) => {
		const decoder = new StreamPacketReader(ProtocolVersion.v761);

		decoder.events.on("packet", (packet) => {
			expect(packet.packetId).toEqual(packet.packetId);

			if (isPacket(packet, packets.HandshakePacket)) {
				expect(packet).toStrictEqual(packet);
			} else {
				fail("Packet is not of the correct type!");
			}

			done();
		});

		const packet = new packets.StatusResponsePacket();
		packet.response = "Hello World";

		const bytes = PacketSerializer.pack(packet);

		for (const byte of bytes) {
			decoder.processBytes(Buffer.from([byte]));
		}
	});
});
