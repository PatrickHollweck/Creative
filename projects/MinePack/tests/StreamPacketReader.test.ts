import { isPacket } from "../lib/protocol/packets/util.js";
import { HandshakePacket } from "../lib/protocol/packets/v761.js";
import { ProtocolVersion } from "../lib/ProtocolVersion.js";
import { PacketSerializer } from "../lib/protocol/PacketSerializer.js";
import { StreamPacketReader } from "../lib/protocol/StreamPacketReader.js";

describe("StreamPacketReader", () => {
	it("should work", (done) => {
		const decoder = new StreamPacketReader(ProtocolVersion.v761);

		decoder.events.on("packet", (packet) => {
			expect(packet.packetId).toEqual(handshakePacket.packetId);

			if (isPacket(packet, HandshakePacket)) {
				expect(packet).toStrictEqual(handshakePacket);
			} else {
				fail("Packet is not of the correct type!");
			}

			done();
		});

		const handshakePacket = new HandshakePacket();

		handshakePacket.nextState = 1;
		handshakePacket.serverPort = 25565;
		handshakePacket.serverAddress = "minecraft.patrickhollweck.de";
		handshakePacket.protocolVersion = 758;

		const bytes = PacketSerializer.pack(handshakePacket);

		for (const byte of bytes) {
			decoder.processBytes(Buffer.from([byte]));
		}
	});
});
