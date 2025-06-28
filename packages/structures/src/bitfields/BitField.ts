import type { EnumLike, NonAbstract, RecursiveReadonlyArray } from '../utils/types';

/**
 * Data that can be resolved to give a bitfield. This can be:
 * A bit number (this can be a number literal or a value taken from {@link BitField.Flags})
 * A string bit number
 * An instance of BitField
 * An Array of BitFieldResolvable
 */
export type BitFieldResolvable<Flags extends string, Type extends bigint | number> =
	| Flags
	| Readonly<BitField<Flags, Type>>
	| RecursiveReadonlyArray<Flags | Readonly<BitField<Flags, Type>> | Type | `${bigint}`>
	| Type
	| `${bigint}`;

/**
 * Data structure that makes it easy to interact with a bitfield.
 */
export abstract class BitField<Flags extends string, Type extends bigint | number = number> {
	/**
	 * Numeric bitfield flags.
	 * <info>Defined in extension classes</info>
	 */
	public static readonly Flags: EnumLike<unknown, bigint | number> = {};

	public static readonly DefaultBit: bigint | number = 0;

	/**
	 * Bitfield of the packed bits
	 */
	public bitfield: Type;

	declare public ['constructor']: NonAbstract<typeof BitField<Flags, Type>>;

	/**
	 * @param bits - Bit(s) to read from
	 */
	public constructor(bits: BitFieldResolvable<Flags, Type> = this.constructor.DefaultBit as Type) {
		this.bitfield = this.constructor.resolve(bits);
	}

	/**
	 * Checks whether the bitfield has a bit, or any of multiple bits.
	 *
	 * @param bit - Bit(s) to check for
	 * @returns
	 */
	public any(bit: BitFieldResolvable<Flags, Type>) {
		return (this.bitfield & this.constructor.resolve(bit)) !== this.constructor.DefaultBit;
	}

	/**
	 * Checks if this bitfield equals another
	 *
	 * @param bit - Bit(s) to check for
	 * @returns
	 */
	public equals(bit: BitFieldResolvable<Flags, Type>) {
		return this.bitfield === this.constructor.resolve(bit);
	}

	/**
	 * Checks whether the bitfield has a bit, or multiple bits.
	 *
	 * @param bit - Bit(s) to check for
	 * @returns
	 */
	public has(bit: BitFieldResolvable<Flags, Type>, ..._hasParams: unknown[]) {
		const resolvedBit = this.constructor.resolve(bit);
		return (this.bitfield & resolvedBit) === resolvedBit;
	}

	/**
	 * Gets all given bits that are missing from the bitfield.
	 *
	 * @param bits - Bit(s) to check for
	 * @param hasParams -  Additional parameters for the has method, if any
	 * @returns
	 */
	public missing(bits: BitFieldResolvable<Flags, Type>, ...hasParams: readonly unknown[]) {
		return new (this.constructor as unknown as new (bits: BitFieldResolvable<Flags, Type>) => BitField<Flags, Type>)(
			bits,
		)
			.remove(this)
			.toArray(...hasParams);
	}

	/**
	 * Freezes these bits, making them immutable.
	 *
	 * @returns
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
	public add(...bits: BitFieldResolvable<Flags, Type>[]) {
		let total = (this.constructor as typeof BitField<Flags, Type>).DefaultBit as Type;
		for (const bit of bits) {
			// @ts-expect-error we know both are bigint or both number here
			total |= (this.constructor as typeof BitField<Flags, Type>).resolve(bit);
		}

		if (Object.isFrozen(this))
			return new (this.constructor as unknown as new (bits: BitFieldResolvable<Flags, Type>) => BitField<Flags, Type>)(
				// @ts-expect-error we know both are bigint or both number here
				this.bitfield | total,
			);
		// @ts-expect-error we know both are bigint or both number here
		this.bitfield |= total;
		return this;
	}

	/**
	 * Removes bits from these.
	 *
	 * @param bits - Bits to remove
	 * @returns These bits or new BitField if the instance is frozen.
	 */
	public remove(...bits: BitFieldResolvable<Flags, Type>[]) {
		let total = this.constructor.DefaultBit as Type;
		for (const bit of bits) {
			// @ts-expect-error we know both are bigint or both number here
			total |= (this.constructor as typeof BitField<Flags, Type>).resolve(bit);
		}

		if (Object.isFrozen(this))
			// @ts-expect-error we know both are bigint or both number here
			return new (this.constructor as new (bit: Type) => BitField<Flags, Type>)(this.bitfield & ~total);
		// @ts-expect-error we know both are bigint or both number here
		this.bitfield &= ~total;
		return this;
	}

	/**
	 * Gets an object mapping field names to a {@link boolean} indicating whether the
	 * bit is available.
	 *
	 * @param hasParams - Additional parameters for the has method, if any
	 * @returns
	 */
	public serialize(...hasParams: readonly unknown[]) {
		const serialized: Partial<Record<keyof Flags, boolean>> = {};
		for (const [flag, bit] of Object.entries(this.constructor.Flags)) {
			if (Number.isNaN(Number(flag))) serialized[flag as keyof Flags] = this.has(bit as Type, ...hasParams);
		}

		return serialized;
	}

	/**
	 * Gets an {@link Array} of bitfield names based on the bits available.
	 *
	 * @param hasParams - Additional parameters for the has method, if any
	 * @returns
	 */
	public toArray(...hasParams: readonly unknown[]) {
		return [...this[Symbol.iterator](...hasParams)];
	}

	public toJSON() {
		return typeof this.bitfield === 'number' ? this.bitfield : this.bitfield.toString();
	}

	public valueOf() {
		return this.bitfield;
	}

	public *[Symbol.iterator](...hasParams: unknown[]) {
		for (const bitName of Object.keys(this.constructor.Flags)) {
			if (Number.isNaN(Number(bitName)) && this.has(bitName as Flags, ...hasParams)) yield bitName as Flags;
		}
	}

	/**
	 * Resolves bitfields to their numeric form.
	 *
	 * @param bit - bit(s) to resolve
	 * @returns
	 */
	public static resolve<Type extends bigint | number, Flags extends string = string>(
		bit: BitFieldResolvable<Flags, Type>,
	): Type {
		const DefaultBit = this.DefaultBit as Type;
		if (typeof DefaultBit === typeof bit && (bit as typeof DefaultBit) >= DefaultBit) return bit as typeof DefaultBit;
		if (bit instanceof BitField) return bit.bitfield;
		if (Array.isArray(bit)) {
			return bit.map((bit_) => this.resolve(bit_)).reduce((prev, bit_) => prev | bit_, DefaultBit);
		}

		if (typeof bit === 'string') {
			if (!Number.isNaN(Number(bit)))
				return typeof DefaultBit === 'bigint' ? (BigInt(bit) as Type) : (Number(bit) as Type);
			if (bit in this.Flags) return this.Flags[bit as keyof typeof this.Flags];
		}

		throw new Error(`BitFieldInvalid: ${JSON.stringify(bit)}`);
	}
}
