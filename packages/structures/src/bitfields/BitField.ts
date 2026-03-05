import type { EnumLike, NonAbstract, RecursiveReadonlyArray } from '../utils/types.js';

// TODO: this currently is mostly copied from mainlib discord.js v14 and definitely needs a refactor in a later iteration

/**
 * Data that can be resolved to give a bit field. This can be:
 * A bit number (this can be a number literal or a value taken from {@link (BitField:class).Flags})
 * A string bit number
 * An instance of BitField
 * An Array of BitFieldResolvable
 */
export type BitFieldResolvable<Flags extends string> =
	| Flags
	| Readonly<BitField<Flags>>
	| RecursiveReadonlyArray<Flags | Readonly<BitField<Flags>> | bigint | number | `${bigint}`>
	| bigint
	| number
	| `${bigint}`;

/**
 * Data structure that makes it easy to interact with a bit field.
 */
export abstract class BitField<Flags extends string> {
	/**
	 * Numeric bit field flags.
	 *
	 * @remarks Defined in extension classes
	 */
	public static readonly Flags: EnumLike<unknown, bigint | number> = {};

	public static readonly DefaultBit: bigint = 0n;

	/**
	 * Bitfield of the packed bits
	 */
	public bitField: bigint;

	declare public ['constructor']: NonAbstract<typeof BitField<Flags>>;

	/**
	 * @param bits - Bit(s) to read from
	 */
	public constructor(bits: BitFieldResolvable<Flags> = this.constructor.DefaultBit) {
		this.bitField = this.constructor.resolve(bits);
	}

	/**
	 * Checks whether the bit field has a bit, or any of multiple bits.
	 *
	 * @param bit - Bit(s) to check for
	 * @returns Whether the bit field has the bit(s)
	 */
	public any(bit: BitFieldResolvable<Flags>) {
		return (this.bitField & this.constructor.resolve(bit)) !== this.constructor.DefaultBit;
	}

	/**
	 * Checks if this bit field equals another
	 *
	 * @param bit - Bit(s) to check for
	 * @returns Whether this bit field equals the other
	 */
	public equals(bit: BitFieldResolvable<Flags>) {
		return this.bitField === this.constructor.resolve(bit);
	}

	/**
	 * Checks whether the bit field has a bit, or multiple bits.
	 *
	 * @param bit - Bit(s) to check for
	 * @returns Whether the bit field has the bit(s)
	 */
	public has(bit: BitFieldResolvable<Flags>, ..._hasParams: unknown[]) {
		const resolvedBit = this.constructor.resolve(bit);
		return (this.bitField & resolvedBit) === resolvedBit;
	}

	/**
	 * Gets all given bits that are missing from the bit field.
	 *
	 * @param bits - Bit(s) to check for
	 * @param hasParams -  Additional parameters for the has method, if any
	 * @returns A bit field containing the missing bits
	 */
	public missing(bits: BitFieldResolvable<Flags>, ...hasParams: readonly unknown[]) {
		return new this.constructor(bits).remove(this).toArray(...hasParams);
	}

	/**
	 * Freezes these bits, making them immutable.
	 *
	 * @returns This bit field but frozen
	 */
	public freeze() {
		return Object.freeze(this);
	}

	/**
	 * Adds bits to these ones.
	 *
	 * @param bits - Bits to add
	 * @returns These bits or new BitField if the instance is frozen.
	 */
	public add(...bits: BitFieldResolvable<Flags>[]) {
		let total = this.constructor.DefaultBit;
		for (const bit of bits) {
			total |= this.constructor.resolve(bit);
		}

		if (Object.isFrozen(this)) return new this.constructor(this.bitField | total);
		this.bitField |= total;
		return this;
	}

	/**
	 * Removes bits from these.
	 *
	 * @param bits - Bits to remove
	 * @returns These bits or new BitField if the instance is frozen.
	 */
	public remove(...bits: BitFieldResolvable<Flags>[]) {
		let total = this.constructor.DefaultBit;
		for (const bit of bits) {
			total |= this.constructor.resolve(bit);
		}

		if (Object.isFrozen(this)) return new this.constructor(this.bitField & ~total);
		this.bitField &= ~total;
		return this;
	}

	/**
	 * Gets an object mapping field names to a boolean indicating whether the bit is available.
	 *
	 * @param hasParams - Additional parameters for the has method, if any
	 * @returns An object mapping field names to a boolean indicating whether the bit is available
	 */
	public serialize(...hasParams: readonly unknown[]) {
		const serialized: Partial<Record<keyof Flags, boolean>> = {};
		for (const [flag, bit] of Object.entries(this.constructor.Flags)) {
			if (Number.isNaN(Number(flag))) serialized[flag as keyof Flags] = this.has(bit as bigint | number, ...hasParams);
		}

		return serialized;
	}

	/**
	 * Gets an Array of bit field names based on the bits available.
	 *
	 * @param hasParams - Additional parameters for the has method, if any
	 * @returns An Array of bit field names
	 */
	public toArray(...hasParams: readonly unknown[]) {
		return [...this[Symbol.iterator](...hasParams)];
	}

	public toJSON(asNumber?: boolean) {
		if (asNumber) {
			if (this.bitField > Number.MAX_SAFE_INTEGER) {
				throw new RangeError(
					`Cannot convert bitfield value ${this.bitField} to number, as it is bigger than ${Number.MAX_SAFE_INTEGER} (the maximum safe integer)`,
				);
			}

			return Number(this.bitField);
		}

		return this.bitField.toString();
	}

	public valueOf() {
		return this.bitField;
	}

	public *[Symbol.iterator](...hasParams: unknown[]) {
		for (const bitName of Object.keys(this.constructor.Flags)) {
			if (Number.isNaN(Number(bitName)) && this.has(bitName as Flags, ...hasParams)) yield bitName as Flags;
		}
	}

	/**
	 * Resolves bit fields to their numeric form.
	 *
	 * @param bit - bit(s) to resolve
	 * @returns the numeric value of the bit fields
	 */
	public static resolve<Flags extends string = string>(bit: BitFieldResolvable<Flags>): bigint {
		const DefaultBit = this.DefaultBit;
		if (typeof bit === 'bigint' && bit >= DefaultBit) return bit;
		if (typeof bit === 'number' && BigInt(bit) >= DefaultBit) return BigInt(bit);
		if (bit instanceof BitField) return bit.bitField;
		if (Array.isArray(bit)) {
			return bit.map((bit_) => this.resolve(bit_)).reduce((prev, bit_) => prev | bit_, DefaultBit);
		}

		if (typeof bit === 'string') {
			if (!Number.isNaN(Number(bit))) return BigInt(bit);
			if (bit in this.Flags) return this.Flags[bit as keyof typeof this.Flags];
		}

		throw new Error(`BitFieldInvalid: ${JSON.stringify(bit)}`);
	}
}
