import { PacketBuffer } from "../lib/core/PacketBuffer";

describe("PacketBuffer", () => {
	it("should read/write VarInt", () => {
		const cases = [
			// Positive Numbers
			{ decimal: 0, buffer: [0x00] }, // So we settled that debate...
			{ decimal: 1, buffer: [0x01] },
			{ decimal: 2, buffer: [0x02] },
			{ decimal: 127, buffer: [0x7f] },
			{ decimal: 128, buffer: [0x80, 0x01] },
			{ decimal: 255, buffer: [0xff, 0x01] },
			{ decimal: 25565, buffer: [0xdd, 0xc7, 0x01] },
			{ decimal: 2097151, buffer: [0xff, 0xff, 0x7f] },
			{ decimal: 2147483647, buffer: [0xff, 0xff, 0xff, 0xff, 0x07] },
			// Negative Numbers
			{ decimal: -1, buffer: [0xff, 0xff, 0xff, 0xff, 0x0f] },
			{ decimal: -2147483648, buffer: [0x80, 0x80, 0x80, 0x80, 0x08] },
		];

		for (const testCase of cases) {
			const buffer = new PacketBuffer().write.varInt(testCase.decimal);

			expect(Array.from(buffer.toBuffer())).toEqual(testCase.buffer);

			const readNumber = buffer.read.varInt(0);

			expect(readNumber).toEqual({
				value: testCase.decimal,
				bytesRead: testCase.buffer.length,
			});
		}
	});

	it("should read/write string", () => {
		const cases = [
			"",
			"\n",
			"	",
			"H",
			"Hello",
			"Hello World",
			"Hello World!",
			"0123456789",
		];

		for (const testCase of cases) {
			const buffer = new PacketBuffer().write.string(testCase);
			const read = buffer.read.string(0);

			expect(read).toEqual(testCase);
		}
	});
});
