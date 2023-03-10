import { BitSet } from "../lib/core/BitSet.js";

describe("BitSet", () => {
	test("Int conversion", () => {
		const input = [
			[0, [0]],
			[123, [1, 1, 1, 1, 0, 1, 1]],
		] as const;

		input.forEach(([number, expectedBits]) => {
			const bits = BitSet.fromInteger(number);

			expect(bits.toArray()).toEqual(expectedBits);
			expect(bits.toInteger()).toEqual(number);
		});
	});

	test("fromBuffer()", () => {
		const buffer = Buffer.from([123, 234]);
		const bits = BitSet.fromBuffer(buffer);

		expect(bits.toArray()).toEqual([
			1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0,
		]);

		expect(bits.toInteger()).toEqual(31722);
	});

	test("padStart()", () => {
		const bits = BitSet.fromInteger(123);

		bits.padStart(16);

		expect(bits.length).toBe(16);
		expect(bits.toArray()).toEqual([
			0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1,
		]);
	});

	test("padEnd()", () => {
		const bits = BitSet.fromInteger(123);

		bits.padEnd(16);

		expect(bits.length).toBe(16);
		expect(bits.toArray()).toEqual([
			1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		]);
	});

	test("chunk()", () => {
		const bits = BitSet.fromInteger(123);
		const chunks = bits.chunk(2);

		expect(chunks).toEqual([
			new BitSet([1, 1]),
			new BitSet([1, 1]),
			new BitSet([0, 1]),
			new BitSet([1]),
		]);
	});
});
