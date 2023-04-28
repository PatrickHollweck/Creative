import { HandshakePacket } from "../lib/protocol/packets/v761/index.js";
import { PacketSerializer } from "../lib/protocol/PacketSerializer.js";

describe("PacketSerializer", () => {
	const handshakePacket = new HandshakePacket();
	handshakePacket.nextState = 1;
	handshakePacket.serverPort = 25565;
	handshakePacket.serverAddress = "minecraft.patrickhollweck.de";
	handshakePacket.protocolVersion = 758;

	test("Packing / Unpacking", () => {
		const bytes = PacketSerializer.pack(handshakePacket);
		const unpacked = PacketSerializer.unpack(bytes, HandshakePacket).packet;

		// Field 1
		expect(unpacked.protocolVersion).toEqual(
			handshakePacket.protocolVersion
		);

		// Field 2
		expect(unpacked.serverAddress).toEqual(handshakePacket.serverAddress);

		// Field 3
		expect(unpacked.serverPort).toEqual(handshakePacket.serverPort);

		// Field 4
		expect(unpacked.nextState).toEqual(handshakePacket.nextState);
	});
});
