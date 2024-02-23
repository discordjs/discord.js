/* eslint-disable no-param-reassign */
/**
 * @internal
 */
export interface CollectionConstructor {
	new (): Collection<unknown, unknown>;
	new <Key, Value>(entries?: readonly (readonly [Key, Value])[] | null): Collection<Key, Value>;
	new <Key, Value>(iterable: Iterable<readonly [Key, Value]>): Collection<Key, Value>;
	readonly prototype: Collection<unknown, unknown>;
	readonly [Symbol.species]: CollectionConstructor;
}

/**
 * Represents an immutable version of a collection
 */
export type ReadonlyCollection<Key, Value> = Omit<
	Collection<Key, Value>,
	'clear' | 'delete' | 'ensure' | 'forEach' | 'get' | 'reverse' | 'set' | 'sort' | 'sweep'
> &
	ReadonlyMap<Key, Value>;

/**
 * Separate interface for the constructor so that emitted js does not have a constructor that overwrites itself
 *
 * @internal
 */
export interface Collection<Key, Value> extends Map<Key, Value> {
	constructor: CollectionConstructor;
}

/**
 * A Map with additional utility methods. This is used throughout discord.js rather than Arrays for anything that has
 * an ID, for significantly improved performance and ease-of-use.
 *
 * @typeParam Key - The key type this collection holds
 * @typeParam Value - The value type this collection holds
 */
export class Collection<Key, Value> extends Map<Key, Value> {
	/**
	 * Obtains the value of the given key if it exists, otherwise sets and returns the value provided by the default value generator.
	 *
	 * @param key - The key to get if it exists, or set otherwise
	 * @param defaultValueGenerator - A function that generates the default value
	 * @example
	 * ```ts
	 * collection.ensure(guildId, () => defaultGuildConfig);
	 * ```
	 */
	public ensure(key: Key, defaultValueGenerator: (key: Key, collection: this) => Value): Value {
		if (this.has(key)) return this.get(key)!;
		if (typeof defaultValueGenerator !== 'function') throw new TypeError(`${defaultValueGenerator} is not a function`);
		const defaultValue = defaultValueGenerator(key, this);
		this.set(key, defaultValue);
		return defaultValue;
	}

	/**
	 * Checks if all of the elements exist in the collection.
	 *
	 * @param keys - The keys of the elements to check for
	 * @returns `true` if all of the elements exist, `false` if at least one does not exist.
	 */
	public hasAll(...keys: Key[]) {
		return keys.every((key) => super.has(key));
	}

	/**
	 * Checks if any of the elements exist in the collection.
	 *
	 * @param keys - The keys of the elements to check for
	 * @returns `true` if any of the elements exist, `false` if none exist.
	 */
	public hasAny(...keys: Key[]) {
		return keys.some((key) => super.has(key));
	}

	/**
	 * Obtains the first value(s) in this collection.
	 *
	 * @param amount - Amount of values to obtain from the beginning
	 * @returns A single value if no amount is provided or an array of values, starting from the end if amount is negative
	 */
	public first(): Value | undefined;
	public first(amount: number): Value[];
	public first(amount?: number): Value | Value[] | undefined {
		if (amount === undefined) return this.values().next().value;
		if (amount < 0) return this.last(amount * -1);
		amount = Math.min(this.size, amount);
		const iter = this.values();
		return Array.from({ length: amount }, (): Value => iter.next().value);
	}

	/**
	 * Obtains the first key(s) in this collection.
	 *
	 * @param amount - Amount of keys to obtain from the beginning
	 * @returns A single key if no amount is provided or an array of keys, starting from the end if
	 * amount is negative
	 */
	public firstKey(): Key | undefined;
	public firstKey(amount: number): Key[];
	public firstKey(amount?: number): Key | Key[] | undefined {
		if (amount === undefined) return this.keys().next().value;
		if (amount < 0) return this.lastKey(amount * -1);
		amount = Math.min(this.size, amount);
		const iter = this.keys();
		return Array.from({ length: amount }, (): Key => iter.next().value);
	}

	/**
	 * Obtains the last value(s) in this collection.
	 *
	 * @param amount - Amount of values to obtain from the end
	 * @returns A single value if no amount is provided or an array of values, starting from the start if
	 * amount is negative
	 */
	public last(): Value | undefined;
	public last(amount: number): Value[];
	public last(amount?: number): Value | Value[] | undefined {
		const arr = [...this.values()];
		if (amount === undefined) return arr[arr.length - 1];
		if (amount < 0) return this.first(amount * -1);
		if (!amount) return [];
		return arr.slice(-amount);
	}

	/**
	 * Obtains the last key(s) in this collection.
	 *
	 * @param amount - Amount of keys to obtain from the end
	 * @returns A single key if no amount is provided or an array of keys, starting from the start if
	 * amount is negative
	 */
	public lastKey(): Key | undefined;
	public lastKey(amount: number): Key[];
	public lastKey(amount?: number): Key | Key[] | undefined {
		const arr = [...this.keys()];
		if (amount === undefined) return arr[arr.length - 1];
		if (amount < 0) return this.firstKey(amount * -1);
		if (!amount) return [];
		return arr.slice(-amount);
	}

	/**
	 * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at | Array.at()}.
	 * Returns the item at a given index, allowing for positive and negative integers.
	 * Negative integers count back from the last item in the collection.
	 *
	 * @param index - The index of the element to obtain
	 */
	public at(index: number) {
		index = Math.floor(index);
		const arr = [...this.values()];
		return arr.at(index);
	}

	/**
	 * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at | Array.at()}.
	 * Returns the key at a given index, allowing for positive and negative integers.
	 * Negative integers count back from the last item in the collection.
	 *
	 * @param index - The index of the key to obtain
	 */
	public keyAt(index: number) {
		index = Math.floor(index);
		const arr = [...this.keys()];
		return arr.at(index);
	}

	/**
	 * Obtains unique random value(s) from this collection.
	 *
	 * @param amount - Amount of values to obtain randomly
	 * @returns A single value if no amount is provided or an array of values
	 */
	public random(): Value | undefined;
	public random(amount: number): Value[];
	public random(amount?: number): Value | Value[] | undefined {
		const arr = [...this.values()];
		if (amount === undefined) return arr[Math.floor(Math.random() * arr.length)];
		if (!arr.length || !amount) return [];
		return Array.from(
			{ length: Math.min(amount, arr.length) },
			(): Value => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]!,
		);
	}

	/**
	 * Obtains unique random key(s) from this collection.
	 *
	 * @param amount - Amount of keys to obtain randomly
	 * @returns A single key if no amount is provided or an array
	 */
	public randomKey(): Key | undefined;
	public randomKey(amount: number): Key[];
	public randomKey(amount?: number): Key | Key[] | undefined {
		const arr = [...this.keys()];
		if (amount === undefined) return arr[Math.floor(Math.random() * arr.length)];
		if (!arr.length || !amount) return [];
		return Array.from(
			{ length: Math.min(amount, arr.length) },
			(): Key => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]!,
		);
	}

	/**
	 * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse | Array.reverse()}
	 * but returns a Collection instead of an Array.
	 */
	public reverse() {
		const entries = [...this.entries()].reverse();
		this.clear();
		for (const [key, value] of entries) this.set(key, value);
		return this;
	}

	/**
	 * Searches for a single item where the given function returns a truthy value. This behaves like
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find | Array.find()}.
	 * All collections used in Discord.js are mapped using their `id` property, and if you want to find by id you
	 * should use the `get` method. See
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get | MDN} for details.
	 *
	 * @param fn - The function to test with (should return a boolean)
	 * @param thisArg - Value to use as `this` when executing the function
	 * @example
	 * ```ts
	 * collection.find(user => user.username === 'Bob');
	 * ```
	 */
	public find<NewValue extends Value>(
		fn: (value: Value, key: Key, collection: this) => value is NewValue,
	): NewValue | undefined;
	public find(fn: (value: Value, key: Key, collection: this) => unknown): Value | undefined;
	public find<This, NewValue extends Value>(
		fn: (this: This, value: Value, key: Key, collection: this) => value is NewValue,
		thisArg: This,
	): NewValue | undefined;
	public find<This>(
		fn: (this: This, value: Value, key: Key, collection: this) => unknown,
		thisArg: This,
	): Value | undefined;
	public find(fn: (value: Value, key: Key, collection: this) => unknown, thisArg?: unknown): Value | undefined {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (thisArg !== undefined) fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (fn(val, key, this)) return val;
		}

		return undefined;
	}

	/**
	 * Searches for the key of a single item where the given function returns a truthy value. This behaves like
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex | Array.findIndex()},
	 * but returns the key rather than the positional index.
	 *
	 * @param fn - The function to test with (should return a boolean)
	 * @param thisArg - Value to use as `this` when executing the function
	 * @example
	 * ```ts
	 * collection.findKey(user => user.username === 'Bob');
	 * ```
	 */
	public findKey<NewKey extends Key>(
		fn: (value: Value, key: Key, collection: this) => key is NewKey,
	): NewKey | undefined;
	public findKey(fn: (value: Value, key: Key, collection: this) => unknown): Key | undefined;
	public findKey<This, NewKey extends Key>(
		fn: (this: This, value: Value, key: Key, collection: this) => key is NewKey,
		thisArg: This,
	): NewKey | undefined;
	public findKey<This>(
		fn: (this: This, value: Value, key: Key, collection: this) => unknown,
		thisArg: This,
	): Key | undefined;
	public findKey(fn: (value: Value, key: Key, collection: this) => unknown, thisArg?: unknown): Key | undefined {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (thisArg !== undefined) fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (fn(val, key, this)) return key;
		}

		return undefined;
	}

	/**
	 * Searches for a last item where the given function returns a truthy value. This behaves like
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast | Array.findLast()}.
	 *
	 * @param fn - The function to test with (should return a boolean)
	 * @param thisArg - Value to use as `this` when executing the function
	 */
	public findLast<NewValue extends Value>(
		fn: (value: Value, key: Key, collection: this) => value is NewValue,
	): NewValue | undefined;
	public findLast(fn: (value: Value, key: Key, collection: this) => unknown): Value | undefined;
	public findLast<This, NewValue extends Value>(
		fn: (this: This, value: Value, key: Key, collection: this) => value is NewValue,
		thisArg: This,
	): NewValue | undefined;
	public findLast<This>(
		fn: (this: This, value: Value, key: Key, collection: this) => unknown,
		thisArg: This,
	): Value | undefined;
	public findLast(fn: (value: Value, key: Key, collection: this) => unknown, thisArg?: unknown): Value | undefined {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (thisArg !== undefined) fn = fn.bind(thisArg);
		const entries = [...this.entries()];
		for (let index = entries.length - 1; index >= 0; index--) {
			const val = entries[index]![1];
			const key = entries[index]![0];
			if (fn(val, key, this)) return val;
		}

		return undefined;
	}

	/**
	 * Searches for the key of a last item where the given function returns a truthy value. This behaves like
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLastIndex | Array.findLastIndex()},
	 * but returns the key rather than the positional index.
	 *
	 * @param fn - The function to test with (should return a boolean)
	 * @param thisArg - Value to use as `this` when executing the function
	 */
	public findLastKey<NewKey extends Key>(
		fn: (value: Value, key: Key, collection: this) => key is NewKey,
	): NewKey | undefined;
	public findLastKey(fn: (value: Value, key: Key, collection: this) => unknown): Key | undefined;
	public findLastKey<This, NewKey extends Key>(
		fn: (this: This, value: Value, key: Key, collection: this) => key is NewKey,
		thisArg: This,
	): NewKey | undefined;
	public findLastKey<This>(
		fn: (this: This, value: Value, key: Key, collection: this) => unknown,
		thisArg: This,
	): Key | undefined;
	public findLastKey(fn: (value: Value, key: Key, collection: this) => unknown, thisArg?: unknown): Key | undefined {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (thisArg !== undefined) fn = fn.bind(thisArg);
		const entries = [...this.entries()];
		for (let index = entries.length - 1; index >= 0; index--) {
			const key = entries[index]![0];
			const val = entries[index]![1];
			if (fn(val, key, this)) return key;
		}

		return undefined;
	}

	/**
	 * Removes items that satisfy the provided filter function.
	 *
	 * @param fn - Function used to test (should return a boolean)
	 * @param thisArg - Value to use as `this` when executing the function
	 * @returns The number of removed entries
	 */
	public sweep(fn: (value: Value, key: Key, collection: this) => unknown): number;
	public sweep<This>(fn: (this: This, value: Value, key: Key, collection: this) => unknown, thisArg: This): number;
	public sweep(fn: (value: Value, key: Key, collection: this) => unknown, thisArg?: unknown): number {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (thisArg !== undefined) fn = fn.bind(thisArg);
		const previousSize = this.size;
		for (const [key, val] of this) {
			if (fn(val, key, this)) this.delete(key);
		}

		return previousSize - this.size;
	}

	/**
	 * Identical to
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter | Array.filter()},
	 * but returns a Collection instead of an Array.
	 *
	 * @param fn - The function to test with (should return a boolean)
	 * @param thisArg - Value to use as `this` when executing the function
	 * @example
	 * ```ts
	 * collection.filter(user => user.username === 'Bob');
	 * ```
	 */
	public filter<NewKey extends Key>(
		fn: (value: Value, key: Key, collection: this) => key is NewKey,
	): Collection<NewKey, Value>;
	public filter<NewValue extends Value>(
		fn: (value: Value, key: Key, collection: this) => value is NewValue,
	): Collection<Key, NewValue>;
	public filter(fn: (value: Value, key: Key, collection: this) => unknown): Collection<Key, Value>;
	public filter<This, NewKey extends Key>(
		fn: (this: This, value: Value, key: Key, collection: this) => key is NewKey,
		thisArg: This,
	): Collection<NewKey, Value>;
	public filter<This, NewValue extends Value>(
		fn: (this: This, value: Value, key: Key, collection: this) => value is NewValue,
		thisArg: This,
	): Collection<Key, NewValue>;
	public filter<This>(
		fn: (this: This, value: Value, key: Key, collection: this) => unknown,
		thisArg: This,
	): Collection<Key, Value>;
	public filter(fn: (value: Value, key: Key, collection: this) => unknown, thisArg?: unknown): Collection<Key, Value> {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (thisArg !== undefined) fn = fn.bind(thisArg);
		const results = new this.constructor[Symbol.species]<Key, Value>();
		for (const [key, val] of this) {
			if (fn(val, key, this)) results.set(key, val);
		}

		return results;
	}

	/**
	 * Partitions the collection into two collections where the first collection
	 * contains the items that passed and the second contains the items that failed.
	 *
	 * @param fn - Function used to test (should return a boolean)
	 * @param thisArg - Value to use as `this` when executing the function
	 * @example
	 * ```ts
	 * const [big, small] = collection.partition(guild => guild.memberCount > 250);
	 * ```
	 */
	public partition<NewKey extends Key>(
		fn: (value: Value, key: Key, collection: this) => key is NewKey,
	): [Collection<NewKey, Value>, Collection<Exclude<Key, NewKey>, Value>];
	public partition<NewValue extends Value>(
		fn: (value: Value, key: Key, collection: this) => value is NewValue,
	): [Collection<Key, NewValue>, Collection<Key, Exclude<Value, NewValue>>];
	public partition(
		fn: (value: Value, key: Key, collection: this) => unknown,
	): [Collection<Key, Value>, Collection<Key, Value>];
	public partition<This, NewKey extends Key>(
		fn: (this: This, value: Value, key: Key, collection: this) => key is NewKey,
		thisArg: This,
	): [Collection<NewKey, Value>, Collection<Exclude<Key, NewKey>, Value>];
	public partition<This, NewValue extends Value>(
		fn: (this: This, value: Value, key: Key, collection: this) => value is NewValue,
		thisArg: This,
	): [Collection<Key, NewValue>, Collection<Key, Exclude<Value, NewValue>>];
	public partition<This>(
		fn: (this: This, value: Value, key: Key, collection: this) => unknown,
		thisArg: This,
	): [Collection<Key, Value>, Collection<Key, Value>];
	public partition(
		fn: (value: Value, key: Key, collection: this) => unknown,
		thisArg?: unknown,
	): [Collection<Key, Value>, Collection<Key, Value>] {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (thisArg !== undefined) fn = fn.bind(thisArg);
		const results: [Collection<Key, Value>, Collection<Key, Value>] = [
			new this.constructor[Symbol.species]<Key, Value>(),
			new this.constructor[Symbol.species]<Key, Value>(),
		];
		for (const [key, val] of this) {
			if (fn(val, key, this)) {
				results[0].set(key, val);
			} else {
				results[1].set(key, val);
			}
		}

		return results;
	}

	/**
	 * Maps each item into a Collection, then joins the results into a single Collection. Identical in behavior to
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap | Array.flatMap()}.
	 *
	 * @param fn - Function that produces a new Collection
	 * @param thisArg - Value to use as `this` when executing the function
	 * @example
	 * ```ts
	 * collection.flatMap(guild => guild.members.cache);
	 * ```
	 */
	public flatMap<NewValue>(
		fn: (value: Value, key: Key, collection: this) => Collection<Key, NewValue>,
	): Collection<Key, NewValue>;
	public flatMap<NewValue, This>(
		fn: (this: This, value: Value, key: Key, collection: this) => Collection<Key, NewValue>,
		thisArg: This,
	): Collection<Key, NewValue>;
	public flatMap<NewValue>(
		fn: (value: Value, key: Key, collection: this) => Collection<Key, NewValue>,
		thisArg?: unknown,
	): Collection<Key, NewValue> {
		// eslint-disable-next-line unicorn/no-array-method-this-argument
		const collections = this.map(fn, thisArg);
		return new this.constructor[Symbol.species]<Key, NewValue>().concat(...collections);
	}

	/**
	 * Maps each item to another value into an array. Identical in behavior to
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map | Array.map()}.
	 *
	 * @param fn - Function that produces an element of the new array, taking three arguments
	 * @param thisArg - Value to use as `this` when executing the function
	 * @example
	 * ```ts
	 * collection.map(user => user.tag);
	 * ```
	 */
	public map<NewValue>(fn: (value: Value, key: Key, collection: this) => NewValue): NewValue[];
	public map<This, NewValue>(
		fn: (this: This, value: Value, key: Key, collection: this) => NewValue,
		thisArg: This,
	): NewValue[];
	public map<NewValue>(fn: (value: Value, key: Key, collection: this) => NewValue, thisArg?: unknown): NewValue[] {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (thisArg !== undefined) fn = fn.bind(thisArg);
		const iter = this.entries();
		return Array.from({ length: this.size }, (): NewValue => {
			const [key, value] = iter.next().value;
			return fn(value, key, this);
		});
	}

	/**
	 * Maps each item to another value into a collection. Identical in behavior to
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map | Array.map()}.
	 *
	 * @param fn - Function that produces an element of the new collection, taking three arguments
	 * @param thisArg - Value to use as `this` when executing the function
	 * @example
	 * ```ts
	 * collection.mapValues(user => user.tag);
	 * ```
	 */
	public mapValues<NewValue>(fn: (value: Value, key: Key, collection: this) => NewValue): Collection<Key, NewValue>;
	public mapValues<This, NewValue>(
		fn: (this: This, value: Value, key: Key, collection: this) => NewValue,
		thisArg: This,
	): Collection<Key, NewValue>;
	public mapValues<NewValue>(
		fn: (value: Value, key: Key, collection: this) => NewValue,
		thisArg?: unknown,
	): Collection<Key, NewValue> {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (thisArg !== undefined) fn = fn.bind(thisArg);
		const coll = new this.constructor[Symbol.species]<Key, NewValue>();
		for (const [key, val] of this) coll.set(key, fn(val, key, this));
		return coll;
	}

	/**
	 * Checks if there exists an item that passes a test. Identical in behavior to
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some | Array.some()}.
	 *
	 * @param fn - Function used to test (should return a boolean)
	 * @param thisArg - Value to use as `this` when executing the function
	 * @example
	 * ```ts
	 * collection.some(user => user.discriminator === '0000');
	 * ```
	 */
	public some(fn: (value: Value, key: Key, collection: this) => unknown): boolean;
	public some<This>(fn: (this: This, value: Value, key: Key, collection: this) => unknown, thisArg: This): boolean;
	public some(fn: (value: Value, key: Key, collection: this) => unknown, thisArg?: unknown): boolean {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (thisArg !== undefined) fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (fn(val, key, this)) return true;
		}

		return false;
	}

	/**
	 * Checks if all items passes a test. Identical in behavior to
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every | Array.every()}.
	 *
	 * @param fn - Function used to test (should return a boolean)
	 * @param thisArg - Value to use as `this` when executing the function
	 * @example
	 * ```ts
	 * collection.every(user => !user.bot);
	 * ```
	 */
	public every<NewKey extends Key>(
		fn: (value: Value, key: Key, collection: this) => key is NewKey,
	): this is Collection<NewKey, Value>;
	public every<NewValue extends Value>(
		fn: (value: Value, key: Key, collection: this) => value is NewValue,
	): this is Collection<Key, NewValue>;
	public every(fn: (value: Value, key: Key, collection: this) => unknown): boolean;
	public every<This, NewKey extends Key>(
		fn: (this: This, value: Value, key: Key, collection: this) => key is NewKey,
		thisArg: This,
	): this is Collection<NewKey, Value>;
	public every<This, NewValue extends Value>(
		fn: (this: This, value: Value, key: Key, collection: this) => value is NewValue,
		thisArg: This,
	): this is Collection<Key, NewValue>;
	public every<This>(fn: (this: This, value: Value, key: Key, collection: this) => unknown, thisArg: This): boolean;
	public every(fn: (value: Value, key: Key, collection: this) => unknown, thisArg?: unknown): boolean {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (thisArg !== undefined) fn = fn.bind(thisArg);
		for (const [key, val] of this) {
			if (!fn(val, key, this)) return false;
		}

		return true;
	}

	/**
	 * Applies a function to produce a single value. Identical in behavior to
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce | Array.reduce()}.
	 *
	 * @param fn - Function used to reduce, taking four arguments; `accumulator`, `currentValue`, `currentKey`,
	 * and `collection`
	 * @param initialValue - Starting value for the accumulator
	 * @example
	 * ```ts
	 * collection.reduce((acc, guild) => acc + guild.memberCount, 0);
	 * ```
	 */
	public reduce<InitialValue = Value>(
		fn: (accumulator: InitialValue, value: Value, key: Key, collection: this) => InitialValue,
		initialValue?: InitialValue,
	): InitialValue {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		let accumulator!: InitialValue;

		const iterator = this.entries();
		if (initialValue === undefined) {
			if (this.size === 0) throw new TypeError('Reduce of empty collection with no initial value');
			accumulator = iterator.next().value[1];
		} else {
			accumulator = initialValue;
		}

		for (const [key, value] of iterator) {
			accumulator = fn(accumulator, value, key, this);
		}

		return accumulator;
	}

	/**
	 * Applies a function to produce a single value. Identical in behavior to
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight | Array.reduceRight()}.
	 *
	 * @param fn - Function used to reduce, taking four arguments; `accumulator`, `value`, `key`, and `collection`
	 * @param initialValue - Starting value for the accumulator
	 */
	public reduceRight<InitialValue>(
		fn: (accumulator: InitialValue, value: Value, key: Key, collection: this) => InitialValue,
		initialValue?: InitialValue,
	): InitialValue {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		const entries = [...this.entries()];
		let accumulator!: InitialValue;

		let index: number;
		if (initialValue === undefined) {
			if (entries.length === 0) throw new TypeError('Reduce of empty collection with no initial value');
			accumulator = entries[entries.length - 1]![1] as unknown as InitialValue;
			index = entries.length - 1;
		} else {
			accumulator = initialValue;
			index = entries.length;
		}

		while (--index >= 0) {
			const key = entries[index]![0];
			const val = entries[index]![1];
			accumulator = fn(accumulator, val, key, this);
		}

		return accumulator;
	}

	/**
	 * Identical to
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach | Map.forEach()},
	 * but returns the collection instead of undefined.
	 *
	 * @param fn - Function to execute for each element
	 * @param thisArg - Value to use as `this` when executing the function
	 * @example
	 * ```ts
	 * collection
	 *  .each(user => console.log(user.username))
	 *  .filter(user => user.bot)
	 *  .each(user => console.log(user.username));
	 * ```
	 */
	public each(fn: (value: Value, key: Key, collection: this) => void): this;
	public each<This>(fn: (this: This, value: Value, key: Key, collection: this) => void, thisArg: This): this;
	public each(fn: (value: Value, key: Key, collection: this) => void, thisArg?: unknown): this {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (thisArg !== undefined) fn = fn.bind(thisArg);

		for (const [key, value] of this) {
			fn(value, key, this);
		}

		return this;
	}

	/**
	 * Runs a function on the collection and returns the collection.
	 *
	 * @param fn - Function to execute
	 * @param thisArg - Value to use as `this` when executing the function
	 * @example
	 * ```ts
	 * collection
	 *  .tap(coll => console.log(coll.size))
	 *  .filter(user => user.bot)
	 *  .tap(coll => console.log(coll.size))
	 * ```
	 */
	public tap(fn: (collection: this) => void): this;
	public tap<This>(fn: (this: This, collection: this) => void, thisArg: This): this;
	public tap(fn: (collection: this) => void, thisArg?: unknown): this {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (thisArg !== undefined) fn = fn.bind(thisArg);
		fn(this);
		return this;
	}

	/**
	 * Creates an identical shallow copy of this collection.
	 *
	 * @example
	 * ```ts
	 * const newColl = someColl.clone();
	 * ```
	 */
	public clone(): Collection<Key, Value> {
		return new this.constructor[Symbol.species](this);
	}

	/**
	 * Combines this collection with others into a new collection. None of the source collections are modified.
	 *
	 * @param collections - Collections to merge
	 * @example
	 * ```ts
	 * const newColl = someColl.concat(someOtherColl, anotherColl, ohBoyAColl);
	 * ```
	 */
	public concat(...collections: ReadonlyCollection<Key, Value>[]) {
		const newColl = this.clone();
		for (const coll of collections) {
			for (const [key, val] of coll) newColl.set(key, val);
		}

		return newColl;
	}

	/**
	 * Checks if this collection shares identical items with another.
	 * This is different to checking for equality using equal-signs, because
	 * the collections may be different objects, but contain the same data.
	 *
	 * @param collection - Collection to compare with
	 * @returns Whether the collections have identical contents
	 */
	public equals(collection: ReadonlyCollection<Key, Value>) {
		if (!collection) return false; // runtime check
		if (this === collection) return true;
		if (this.size !== collection.size) return false;
		for (const [key, value] of this) {
			if (!collection.has(key) || value !== collection.get(key)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * The sort method sorts the items of a collection in place and returns it.
	 * The sort is not necessarily stable in Node 10 or older.
	 * The default sort order is according to string Unicode code points.
	 *
	 * @param compareFunction - Specifies a function that defines the sort order.
	 * If omitted, the collection is sorted according to each character's Unicode code point value, according to the string conversion of each element.
	 * @example
	 * ```ts
	 * collection.sort((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
	 * ```
	 */
	public sort(compareFunction: Comparator<Key, Value> = Collection.defaultSort) {
		const entries = [...this.entries()];
		entries.sort((a, b): number => compareFunction(a[1], b[1], a[0], b[0]));

		// Perform clean-up
		super.clear();

		// Set the new entries
		for (const [key, value] of entries) {
			super.set(key, value);
		}

		return this;
	}

	/**
	 * The intersection method returns a new collection containing the items where the key is present in both collections.
	 *
	 * @param other - The other Collection to filter against
	 * @example
	 * ```ts
	 * const col1 = new Collection([['a', 1], ['b', 2]]);
	 * const col2 = new Collection([['a', 1], ['c', 3]]);
	 * const intersection = col1.intersection(col2);
	 * console.log(col1.intersection(col2));
	 * // => Collection { 'a' => 1 }
	 * ```
	 */
	public intersection(other: ReadonlyCollection<Key, any>): Collection<Key, Value> {
		const coll = new this.constructor[Symbol.species]<Key, Value>();

		for (const [key, value] of this) {
			if (other.has(key)) coll.set(key, value);
		}

		return coll;
	}

	/**
	 * Returns a new collection containing the items where the key is present in either of the collections.
	 *
	 * @remarks
	 *
	 * If the collections have any items with the same key, the value from the first collection will be used.
	 * @param other - The other Collection to filter against
	 * @example
	 * ```ts
	 * const col1 = new Collection([['a', 1], ['b', 2]]);
	 * const col2 = new Collection([['a', 1], ['b', 3], ['c', 3]]);
	 * const union = col1.union(col2);
	 * console.log(union);
	 * // => Collection { 'a' => 1, 'b' => 2, 'c' => 3 }
	 * ```
	 */
	public union<OtherValue>(other: ReadonlyCollection<Key, OtherValue>): Collection<Key, OtherValue | Value> {
		const coll = new this.constructor[Symbol.species]<Key, OtherValue | Value>(this);

		for (const [key, value] of other) {
			if (!coll.has(key)) coll.set(key, value);
		}

		return coll;
	}

	/**
	 * Returns a new collection containing the items where the key is present in this collection but not the other.
	 *
	 * @param other - The other Collection to filter against
	 * @example
	 * ```ts
	 * const col1 = new Collection([['a', 1], ['b', 2]]);
	 * const col2 = new Collection([['a', 1], ['c', 3]]);
	 * console.log(col1.difference(col2));
	 * // => Collection { 'b' => 2 }
	 * console.log(col2.difference(col1));
	 * // => Collection { 'c' => 3 }
	 * ```
	 */
	public difference(other: ReadonlyCollection<Key, any>): Collection<Key, Value> {
		const coll = new this.constructor[Symbol.species]<Key, Value>();

		for (const [key, value] of this) {
			if (!other.has(key)) coll.set(key, value);
		}

		return coll;
	}

	/**
	 * Returns a new collection containing only the items where the keys are present in either collection, but not both.
	 *
	 * @param other - The other Collection to filter against
	 * @example
	 * ```ts
	 * const col1 = new Collection([['a', 1], ['b', 2]]);
	 * const col2 = new Collection([['a', 1], ['c', 3]]);
	 * const symmetricDifference = col1.symmetricDifference(col2);
	 * console.log(col1.symmetricDifference(col2));
	 * // => Collection { 'b' => 2, 'c' => 3 }
	 * ```
	 */
	public symmetricDifference<OtherValue>(
		other: ReadonlyCollection<Key, OtherValue>,
	): Collection<Key, OtherValue | Value> {
		const coll = new this.constructor[Symbol.species]<Key, OtherValue | Value>();

		for (const [key, value] of this) {
			if (!other.has(key)) coll.set(key, value);
		}

		for (const [key, value] of other) {
			if (!this.has(key)) coll.set(key, value);
		}

		return coll;
	}

	/**
	 * Merges two Collections together into a new Collection.
	 *
	 * @param other - The other Collection to merge with
	 * @param whenInSelf - Function getting the result if the entry only exists in this Collection
	 * @param whenInOther - Function getting the result if the entry only exists in the other Collection
	 * @param whenInBoth - Function getting the result if the entry exists in both Collections
	 * @example
	 * ```ts
	 * // Sums up the entries in two collections.
	 * coll.merge(
	 *  other,
	 *  x => ({ keep: true, value: x }),
	 *  y => ({ keep: true, value: y }),
	 *  (x, y) => ({ keep: true, value: x + y }),
	 * );
	 * ```
	 * @example
	 * ```ts
	 * // Intersects two collections in a left-biased manner.
	 * coll.merge(
	 *  other,
	 *  x => ({ keep: false }),
	 *  y => ({ keep: false }),
	 *  (x, _) => ({ keep: true, value: x }),
	 * );
	 * ```
	 */
	public merge<OtherValue, ResultValue>(
		other: ReadonlyCollection<Key, OtherValue>,
		whenInSelf: (value: Value, key: Key) => Keep<ResultValue>,
		whenInOther: (valueOther: OtherValue, key: Key) => Keep<ResultValue>,
		whenInBoth: (value: Value, valueOther: OtherValue, key: Key) => Keep<ResultValue>,
	): Collection<Key, ResultValue> {
		const coll = new this.constructor[Symbol.species]<Key, ResultValue>();
		const keys = new Set([...this.keys(), ...other.keys()]);

		for (const key of keys) {
			const hasInSelf = this.has(key);
			const hasInOther = other.has(key);

			if (hasInSelf && hasInOther) {
				const result = whenInBoth(this.get(key)!, other.get(key)!, key);
				if (result.keep) coll.set(key, result.value);
			} else if (hasInSelf) {
				const result = whenInSelf(this.get(key)!, key);
				if (result.keep) coll.set(key, result.value);
			} else if (hasInOther) {
				const result = whenInOther(other.get(key)!, key);
				if (result.keep) coll.set(key, result.value);
			}
		}

		return coll;
	}

	/**
	 * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toReversed | Array.toReversed()}
	 * but returns a Collection instead of an Array.
	 */
	public toReversed() {
		return new this.constructor[Symbol.species](this).reverse();
	}

	/**
	 * The sorted method sorts the items of a collection and returns it.
	 * The sort is not necessarily stable in Node 10 or older.
	 * The default sort order is according to string Unicode code points.
	 *
	 * @param compareFunction - Specifies a function that defines the sort order.
	 * If omitted, the collection is sorted according to each character's Unicode code point value,
	 * according to the string conversion of each element.
	 * @example
	 * ```ts
	 * collection.sorted((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
	 * ```
	 */
	public toSorted(compareFunction: Comparator<Key, Value> = Collection.defaultSort) {
		return new this.constructor[Symbol.species](this).sort((av, bv, ak, bk) => compareFunction(av, bv, ak, bk));
	}

	public toJSON() {
		// toJSON is called recursively by JSON.stringify.
		return [...this.entries()];
	}

	private static defaultSort<Value>(firstValue: Value, secondValue: Value): number {
		return Number(firstValue > secondValue) || Number(firstValue === secondValue) - 1;
	}

	/**
	 * Creates a Collection from a list of entries.
	 *
	 * @param entries - The list of entries
	 * @param combine - Function to combine an existing entry with a new one
	 * @example
	 * ```ts
	 * Collection.combineEntries([["a", 1], ["b", 2], ["a", 2]], (x, y) => x + y);
	 * // returns Collection { "a" => 3, "b" => 2 }
	 * ```
	 */
	public static combineEntries<Key, Value>(
		entries: Iterable<[Key, Value]>,
		combine: (firstValue: Value, secondValue: Value, key: Key) => Value,
	): Collection<Key, Value> {
		const coll = new Collection<Key, Value>();
		for (const [key, value] of entries) {
			if (coll.has(key)) {
				coll.set(key, combine(coll.get(key)!, value, key));
			} else {
				coll.set(key, value);
			}
		}

		return coll;
	}
}

/**
 * @internal
 */
export type Keep<Value> = { keep: false } | { keep: true; value: Value };

/**
 * @internal
 */
export type Comparator<Key, Value> = (firstValue: Value, secondValue: Value, firstKey: Key, secondKey: Key) => number;
