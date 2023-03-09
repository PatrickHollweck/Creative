import { HandshakePacket } from "../lib/protocol/packets/v761.js";
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

	test("Unpacking from buffer", () => {
		const input = Buffer.from([
			37, 0, 0, 0, 2, 246, 28, 109, 105, 110, 101, 99, 114, 97, 102, 116,
			46, 112, 97, 116, 114, 105, 99, 107, 104, 111, 108, 108, 119, 101,
			99, 107, 46, 100, 101, 99, 221, 1,
		]);

		const result = PacketSerializer.unpack(input, HandshakePacket);

		expect(result).toStrictEqual(handshakePacket);
	});
});
