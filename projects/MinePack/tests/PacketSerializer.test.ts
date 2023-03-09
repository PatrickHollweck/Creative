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

		const reversed = PacketSerializer.unpack(
			Uint8Array.from(bytes),
			HandshakePacket
		);

		// Field 1
		expect(reversed.protocolVersion).toEqual(
			handshakePacket.protocolVersion
		);

		// Field 2
		expect(reversed.serverAddress).toEqual(handshakePacket.serverAddress);

		// Field 3
		expect(reversed.serverPort).toEqual(handshakePacket.serverPort);

		// Field 4
		expect(reversed.nextState).toEqual(handshakePacket.nextState);
	});
});
