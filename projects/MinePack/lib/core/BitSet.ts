export class BitSet {
	private bits: number[];

	constructor(bits: number[]) {
		this.bits = bits;
	}

	/**
	 * Gets the amount of bits in the bit-set
	 */
	public get length(): number {
		return this.bits.length;
	}

	/**
	 * Creates a bitset from the given number
	 * @param input The number to convert
	 * @returns {BitSet}
	 */
	static fromInteger(input: number) {
		const bits = (Math.floor(input) >>> 0)
			.toString(2)
			.split("")
			.map((number) => Number(number));

		return new BitSet(bits);
	}

	/**
	 * Creates a bitset from the given bigint
	 * @param input The number to convert
	 * @returns {BitSet}
	 */
	static fromBigInt(input: bigint) {
		const bits = input
			.toString(2)
			.split("")
			.map((number) => Number(number));

		return new BitSet(bits);
	}

	/**
	 * Creates a new Bitset from a node buffer
	 * @param buffer The buffer to create the bit-set from
	 * @returns The bitset
	 */
	static fromBuffer(buffer: Buffer) {
		const bits = [];

		for (const byte of buffer) {
			bits.push(...BitSet.fromInteger(byte).toArray());
		}

		return new BitSet(bits);
	}

	/**
	 * Converts the bits to an integer
	 * @returns The number
	 */
	toInteger(): number {
		return parseInt(this.bits.join(""), 2);
	}

	/**
	 * Converts the bits to an bigint
	 * @returns The big-int
	 */
	toBigInt(): bigint {
		return BigInt("0b" + this.bits.join(""));
	}

	/**
	 * Converts the bits into an array of zero's and one's
	 * @returns The bits
	 */
	toArray(): number[] {
		return this.bits;
	}

	/**
	 * Adds zero's to the start until the given length
	 * @param maxLength The length to which to fill
	 * @returns {ThisType}
	 */
	padStart(maxLength: number) {
		while (this.length < maxLength) {
			this.bits.unshift(0);
		}

		return this;
	}

	/**
	 * Adds zero's to the end until the given length
	 * @param maxLength The length to which to fill
	 * @returns {ThisType}
	 */
	padEnd(maxLength: number) {
		while (this.length < maxLength) {
			this.bits.push(0);
		}

		return this;
	}

	/**
	 * Splits the bits into chunks of given size
	 * @param chunkSize The size of a single chunk, after which to split
	 */
	chunk(chunkSize: number) {
		const result = [];

		for (let i = 0; i < this.bits.length; i += chunkSize) {
			result.push(new BitSet(this.bits.slice(i, i + chunkSize)));
		}

		return result;
	}
}
