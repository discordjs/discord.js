/* eslint-disable id-length */
/* eslint-disable no-param-reassign */
import type { Buffer } from 'node:buffer';
import { Collection, type ReadonlyCollection } from '@discordjs/collection';
import type { Redis } from 'ioredis';
import type { Serialized } from './utils.js';

const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');

/**
 * @internal
 */
export interface RedisCollectionOptions<T, ReturnType = Serialized<T>> {
	/**
	 * Deserialize values before returning them from Redis
	 */
	deserialize?(value: Buffer | number | string): ReturnType;
	/**
	 * The hash being used to store this data
	 */
	hash: string;
	/**
	 * IORedis client instance
	 */
	redis: Redis;
	/**
	 * Serialize values before inserting them into Redis
	 */
	serialize?(value: T): Buffer | number | string;
}

/**
 * @internal
 */
export interface RedisCollectionConstructor<V, ReturnType = Serialized<V>> {
	new (
		options: RedisCollectionOptions<V, ReturnType>,
		entries?: readonly (readonly [string, V])[] | null,
	): RedisCollection<V, ReturnType>;
	new (options: RedisCollectionOptions<V, ReturnType>, iterable: Iterable<readonly [string, V]>): RedisCollection<
		V,
		ReturnType
	>;
	readonly prototype: RedisCollection<V, ReturnType>;
}

/**
 * Represents an immutable version of a collection
 */
export type ReadonlyRedisCollection<V, ReturnType = Serialized<V>> = Omit<
	RedisCollection<V, ReturnType>,
	'delete' | 'ensure' | 'forEach' | 'reverse' | 'set' | 'sort' | 'sweep'
>;

/**
 * Separate interface for the constructor so that emitted js does not have a constructor that overwrites itself
 *
 * @internal
 */
export interface RedisCollection<V, ReturnType = Serialized<V>> {
	constructor: RedisCollectionConstructor<V, ReturnType>;
}

/**
 * A Map like async structure with additional utility methods.
 *
 * @typeParam V - The value type this collection holds
 * @typeParam ReturnType - The serialized value this collection returns
 */
export class RedisCollection<V, ReturnType = Serialized<V>> {
	/**
	 * Hash being used to store data into
	 */
	public readonly hash: string;

	/**
	 * IORedis client instance
	 */
	public readonly redis: Redis;

	/**
	 * Serialize values before inserting them into Redis
	 */
	public readonly serialize: (value: V) => Buffer | number | string;

	/**
	 * Deserialize values before returning them from Redis
	 */
	public readonly deserialize: (value: Buffer | number | string) => ReturnType;

	public constructor(
		options: RedisCollectionOptions<V, ReturnType>,
		entries?: readonly (readonly [string, V])[] | null,
	);
	public constructor(options: RedisCollectionOptions<V, ReturnType>, iterable: Iterable<readonly [string, V]>);
	public constructor(
		options: RedisCollectionOptions<V, ReturnType>,
		entries?: Iterable<readonly [string, V]> | readonly (readonly [string, V])[] | null,
	) {
		this.hash = options.hash;
		this.redis = options.redis;
		/* eslint-disable @typescript-eslint/unbound-method */
		this.serialize = options.serialize ?? JSON.stringify;
		this.deserialize = options.deserialize ?? (JSON.parse as (value: Buffer | number | string) => ReturnType);
		/* eslint-enable @typescript-eslint/unbound-method */

		if (entries) {
			for (const [id, value] of entries) {
				void this.set(id, value);
			}
		}
	}

	protected [customInspectSymbol]() {
		return `RedisCollection(${this.hash})`;
	}

	/**
	 * Returns an async iterable of entries in the collection.
	 */
	public async *[Symbol.asyncIterator]() {
		for await (const chunk of this.redis.hscanStream(this.hash)) {
			let isKey = true;
			let currentKey: string;

			for (const element of chunk) {
				if (isKey) {
					currentKey = element as string;
				} else {
					yield [currentKey!, this.deserialize(element as Buffer | number | string)] as [string, ReturnType];
				}

				isKey = !isKey;
			}
		}
	}

	/**
	 * Returns an async iterable of key, value pairs for every entry in the collection.
	 */
	public async *entries(): AsyncIterableIterator<[string, ReturnType]> {
		for await (const [k, v] of this) {
			yield [k, v];
		}
	}

	/**
	 * Returns an array of key, value pairs for every entry in the collection.
	 */
	public async entriesArray(): Promise<[string, ReturnType][]> {
		const entries: [string, ReturnType][] = [];
		for await (const entry of this.entries()) entries.push(entry);
		return entries;
	}

	/**
	 * Returns an async iterable of keys in the collection.
	 */
	public async *keys(): AsyncIterableIterator<string> {
		for await (const [k] of this) {
			yield k;
		}
	}

	/**
	 * Returns an array of keys in the collection.
	 */
	public async keysArray(): Promise<string[]> {
		const keys: string[] = [];
		for await (const key of this.keys()) {
			keys.push(key);
		}

		return keys;
	}

	/**
	 * Returns an iterable of values in the collection.
	 */
	public async *values(): AsyncIterableIterator<ReturnType> {
		for await (const [, v] of this) {
			yield v;
		}
	}

	/**
	 * Returns an array of values in the collection
	 */
	public async valuesArray(): Promise<ReturnType[]> {
		const values: ReturnType[] = [];
		for await (const value of this.values()) {
			values.push(value);
		}

		return values;
	}

	/**
	 *  Removes all entries from the collection.
	 *
	 *  @returns The number of entries that were removed.
	 */
	public async clear() {
		return this.redis.del(this.hash);
	}

	/**
	 * @returns true if an element in the Map existed and has been removed, or false if the element does not exist.
	 */
	public async delete(key: string) {
		const count = await this.redis.hdel(this.hash, key);
		return count !== 0;
	}

	/**
	 * Executes a provided function once per each key/value pair in the collection, in insertion order.
	 */
	public async forEach(fn: (value: ReturnType, key: string, collection: this) => void): Promise<void>;
	public async forEach<T>(
		fn: (this: T, value: ReturnType, key: string, collection: this) => void,
		thisArg: T,
	): Promise<void>;
	public async forEach(
		fn: (value: ReturnType, key: string, collection: this) => void,
		thisArg?: unknown,
	): Promise<void> {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for await (const [key, value] of this) {
			fn(value, key, this);
		}
	}

	/**
	 * Returns a specified element from the collection.
	 *
	 * @returns Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.
	 */
	public async get(key: string) {
		const data = await this.redis.hget(this.hash, key);
		if (!data) {
			return undefined;
		}

		return this.deserialize(data);
	}

	/**
	 * @returns boolean indicating whether an element with the specified key exists or not.
	 */
	public async has(key: string) {
		return (await this.redis.hexists(this.hash, key)) === 1;
	}

	/**
	 * Adds a new element with a specified key and value to the collection. If an element with the same key already exists, the element will be updated.
	 */
	public async set(key: string, value: V) {
		await this.redis.hset(this.hash, key, this.serialize(value));
		return this;
	}

	/**
	 * @returns the number of elements in the collection.
	 */
	public get size() {
		return this.redis.hlen(this.hash);
	}

	/**
	 * Obtains the value of the given key if it exists, otherwise sets and returns the value provided by the default value generator.
	 *
	 * @param key - The key to get if it exists, or set otherwise
	 * @param defaultValueGenerator - A function that generates the default value
	 * @example
	 * ```ts
	 * await collection.ensure(guildId, () => defaultGuildConfig);
	 * ```
	 */
	public async ensure(key: string, defaultValueGenerator: (key: string, collection: this) => V): Promise<ReturnType> {
		if (await this.has(key)) return (await this.get(key))!;
		if (typeof defaultValueGenerator !== 'function') throw new TypeError(`${defaultValueGenerator} is not a function`);
		const defaultValue = defaultValueGenerator(key, this);
		await this.set(key, defaultValue);
		return this.deserialize(this.serialize(defaultValue));
	}

	/**
	 * Checks if all of the elements exist in the collection.
	 *
	 * @param keys - The keys of the elements to check for
	 * @returns `true` if all of the elements exist, `false` if at least one does not exist.
	 */
	public async hasAll(...keys: string[]) {
		return (await Promise.all(keys.map(async (k) => this.has(k)))).every(Boolean);
	}

	/**
	 * Checks if any of the elements exist in the collection.
	 *
	 * @param keys - The keys of the elements to check for
	 * @returns `true` if any of the elements exist, `false` if none exist.
	 */
	public async hasAny(...keys: string[]) {
		return (await Promise.all(keys.map(async (k) => this.has(k)))).some(Boolean);
	}

	/**
	 * Obtains the first value(s) in this collection.
	 *
	 * @param amount - Amount of values to obtain from the beginning
	 * @returns A single value if no amount is provided or an array of values, starting from the end if amount is negative
	 */
	public async first(): Promise<ReturnType | undefined>;
	public async first(amount: number): Promise<ReturnType[]>;
	public async first(amount?: number): Promise<ReturnType | ReturnType[] | undefined> {
		if (typeof amount === 'undefined') return (await this.values().next()).value;
		if (amount < 0) return this.last(amount * -1);
		amount = Math.min(await this.size, amount);
		const iter = this.values();
		return Promise.all(Array.from({ length: amount }, async (): Promise<ReturnType> => (await iter.next()).value));
	}

	/**
	 * Obtains the first key(s) in this collection.
	 *
	 * @param amount - Amount of keys to obtain from the beginning
	 * @returns A single key if no amount is provided or an array of keys, starting from the end if
	 * amount is negative
	 */
	public async firstKey(): Promise<string | undefined>;
	public async firstKey(amount: number): Promise<string[]>;
	public async firstKey(amount?: number): Promise<string[] | string | undefined> {
		if (typeof amount === 'undefined') return (await this.keys().next()).value;
		if (amount < 0) return this.lastKey(amount * -1);
		amount = Math.min(await this.size, amount);
		const iter = this.keys();
		return Promise.all(Array.from({ length: amount }, async (): Promise<string> => (await iter.next()).value));
	}

	/**
	 * Obtains the last value(s) in this collection.
	 *
	 * @param amount - Amount of values to obtain from the end
	 * @returns A single value if no amount is provided or an array of values, starting from the start if
	 * amount is negative
	 */
	public async last(): Promise<ReturnType | undefined>;
	public async last(amount: number): Promise<ReturnType[]>;
	public async last(amount?: number): Promise<ReturnType | ReturnType[] | undefined> {
		const values = await this.valuesArray();
		if (typeof amount === 'undefined') return values[values.length - 1];
		if (amount < 0) return this.first(amount * -1);
		if (!amount) return [];
		return values.slice(-amount);
	}

	/**
	 * Obtains the last key(s) in this collection.
	 *
	 * @param amount - Amount of keys to obtain from the end
	 * @returns A single key if no amount is provided or an array of keys, starting from the start if
	 * amount is negative
	 */
	public async lastKey(): Promise<string | undefined>;
	public async lastKey(amount: number): Promise<string[]>;
	public async lastKey(amount?: number): Promise<string[] | string | undefined> {
		const keys = await this.keysArray();
		if (typeof amount === 'undefined') return keys[keys.length - 1];
		if (amount < 0) return this.firstKey(amount * -1);
		if (!amount) return [];
		return keys.slice(-amount);
	}

	/**
	 * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at | Array.at()}.
	 * Returns the item at a given index, allowing for positive and negative integers.
	 * Negative integers count back from the last item in the collection.
	 *
	 * @param index - The index of the element to obtain
	 */
	public async at(index: number) {
		index = Math.floor(index);
		const values = await this.valuesArray();
		return values.at(index);
	}

	/**
	 * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at | Array.at()}.
	 * Returns the key at a given index, allowing for positive and negative integers.
	 * Negative integers count back from the last item in the collection.
	 *
	 * @param index - The index of the key to obtain
	 */
	public async keyAt(index: number) {
		index = Math.floor(index);
		const keys = await this.keysArray();
		return keys.at(index);
	}

	/**
	 * Obtains unique random value(s) from this collection.
	 *
	 * @param amount - Amount of values to obtain randomly
	 * @returns A single value if no amount is provided or an array of values
	 */
	public async random(): Promise<ReturnType | undefined>;
	public async random(amount: number): Promise<ReturnType[]>;
	public async random(amount?: number): Promise<ReturnType | ReturnType[] | undefined> {
		const values = await this.valuesArray();
		if (typeof amount === 'undefined') return values[Math.floor(Math.random() * values.length)];
		if (!values.length || !amount) return [];
		return Array.from(
			{ length: Math.min(amount, values.length) },
			(): ReturnType => values.splice(Math.floor(Math.random() * values.length), 1)[0]!,
		);
	}

	/**
	 * Obtains unique random key(s) from this collection.
	 *
	 * @param amount - Amount of keys to obtain randomly
	 * @returns A single key if no amount is provided or an array
	 */
	public async randomKey(): Promise<string | undefined>;
	public async randomKey(amount: number): Promise<string[]>;
	public async randomKey(amount?: number): Promise<string[] | string | undefined> {
		const keys = await this.keysArray();
		if (typeof amount === 'undefined') return keys[Math.floor(Math.random() * keys.length)];
		return Array.from(
			{ length: Math.min(amount, keys.length) },
			(): string => keys.splice(Math.floor(Math.random() * keys.length), 1)[0]!,
		);
	}

	/**
	 * Identical to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse | Array.reverse()}
	 * but returns a RedisCollection instead of an Array.
	 */
	public async reverse() {
		const entries = await this.entriesArray();
		await this.clear();
		for (const [key, value] of entries.reverse()) await this.set(key, value as unknown as V);
		return this;
	}

	/**
	 * Searches for a single item where the given function returns a truthy value. This behaves like
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find | Array.find()}.
	 *
	 * @param fn - The function to test with (should return boolean)
	 * @param thisArg - Value to use as `this` when executing function
	 * @example
	 * ```ts
	 * await collection.find(user => user.username === 'Bob');
	 * ```
	 */
	public async find<V2 extends ReturnType>(
		fn: (value: ReturnType, key: string, collection: this) => value is V2,
	): Promise<V2 | undefined>;
	public async find(fn: (value: ReturnType, key: string, collection: this) => boolean): Promise<ReturnType | undefined>;
	public async find<This, V2 extends ReturnType>(
		fn: (this: This, value: ReturnType, key: string, collection: this) => value is V2,
		thisArg: This,
	): Promise<V2 | undefined>;
	public async find<This>(
		fn: (this: This, value: ReturnType, key: string, collection: this) => boolean,
		thisArg: This,
	): Promise<ReturnType | undefined>;
	public async find(
		fn: (value: ReturnType, key: string, collection: this) => boolean,
		thisArg?: unknown,
	): Promise<ReturnType | undefined> {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for await (const [key, val] of this) {
			if (fn(val, key, this)) return val;
		}

		return undefined;
	}

	/**
	 * Searches for the key of a single item where the given function returns a truthy value. This behaves like
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex | Array.findIndex()},
	 * but returns the key rather than the positional index.
	 *
	 * @param fn - The function to test with (should return boolean)
	 * @param thisArg - Value to use as `this` when executing function
	 * @example
	 * ```ts
	 * await collection.findKey(user => user.username === 'Bob');
	 * ```
	 */
	public async findKey<K2 extends string>(
		fn: (value: ReturnType, key: string, collection: this) => key is K2,
	): Promise<K2 | undefined>;
	public async findKey(fn: (value: ReturnType, key: string, collection: this) => boolean): Promise<string | undefined>;
	public async findKey<This, K2 extends string>(
		fn: (this: This, value: ReturnType, key: string, collection: this) => key is K2,
		thisArg: This,
	): Promise<K2 | undefined>;
	public async findKey<This>(
		fn: (this: This, value: ReturnType, key: string, collection: this) => boolean,
		thisArg: This,
	): Promise<string | undefined>;
	public async findKey(
		fn: (value: ReturnType, key: string, collection: this) => boolean,
		thisArg?: unknown,
	): Promise<string | undefined> {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for await (const [key, val] of this) {
			if (fn(val, key, this)) return key;
		}

		return undefined;
	}

	/**
	 * Removes items that satisfy the provided filter function.
	 *
	 * @param fn - Function used to test (should return a boolean)
	 * @param thisArg - Value to use as `this` when executing function
	 * @returns The number of removed entries
	 */
	public async sweep(fn: (value: ReturnType, key: string, collection: this) => boolean): Promise<number>;
	public async sweep<T>(
		fn: (this: T, value: ReturnType, key: string, collection: this) => boolean,
		thisArg: T,
	): Promise<number>;
	public async sweep(
		fn: (value: ReturnType, key: string, collection: this) => boolean,
		thisArg?: unknown,
	): Promise<number> {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const previousSize = await this.size;
		for await (const [key, val] of this) {
			if (fn(val, key, this)) await this.delete(key);
		}

		return previousSize - (await this.size);
	}

	/**
	 * Identical to
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter | Array.filter()},
	 * but returns a RedisCollection instead of an Array.
	 *
	 * @param fn - The function to test with (should return boolean)
	 * @param thisArg - Value to use as `this` when executing function
	 * @example
	 * ```ts
	 * await collection.filter(user => user.username === 'Bob');
	 * ```
	 */
	public async filter(
		fn: (value: ReturnType, key: string, collection: this) => boolean,
	): Promise<Collection<string, ReturnType>>;
	public async filter<V2 extends ReturnType>(
		fn: (value: ReturnType, key: string, collection: this) => value is V2,
	): Promise<Collection<string, V2>>;
	public async filter(
		fn: (value: ReturnType, key: string, collection: this) => boolean,
	): Promise<Collection<string, ReturnType>>;
	public async filter<This>(
		fn: (this: This, value: ReturnType, key: string, collection: this) => boolean,
		thisArg: This,
	): Promise<Collection<string, ReturnType>>;
	public async filter<This, V2 extends ReturnType>(
		fn: (this: This, value: ReturnType, key: string, collection: this) => value is V2,
		thisArg: This,
	): Promise<Collection<string, V2>>;
	public async filter<This>(
		fn: (this: This, value: ReturnType, key: string, collection: this) => boolean,
		thisArg: This,
	): Promise<Collection<string, ReturnType>>;
	public async filter(
		fn: (value: ReturnType, key: string, collection: this) => boolean,
		thisArg?: unknown,
	): Promise<Collection<string, ReturnType>> {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const results = new Collection<string, ReturnType>();
		for await (const [key, val] of this) {
			if (fn(val, key, this)) results.set(key, val);
		}

		return results;
	}

	/**
	 * Partitions the collection into two collections where the first collection
	 * contains the items that passed and the second contains the items that failed.
	 *
	 * @param fn - Function used to test (should return a boolean)
	 * @param thisArg - Value to use as `this` when executing function
	 * @example
	 * ```ts
	 * await const [big, small] = collection.partition(guild => guild.memberCount > 250);
	 * ```
	 */
	public async partition(
		fn: (value: ReturnType, key: string, collection: this) => boolean,
	): Promise<[Collection<string, ReturnType>, Collection<string, ReturnType>]>;
	public async partition<V2 extends ReturnType>(
		fn: (value: ReturnType, key: string, collection: this) => value is V2,
	): Promise<[Collection<string, V2>, Collection<string, Exclude<V, V2>>]>;
	public async partition(
		fn: (value: ReturnType, key: string, collection: this) => boolean,
	): Promise<[Collection<string, ReturnType>, Collection<string, ReturnType>]>;
	public async partition<This>(
		fn: (this: This, value: ReturnType, key: string, collection: this) => boolean,
		thisArg: This,
	): Promise<[Collection<string, ReturnType>, Collection<string, ReturnType>]>;
	public async partition<This, V2 extends ReturnType>(
		fn: (this: This, value: ReturnType, key: string, collection: this) => value is V2,
		thisArg: This,
	): Promise<[Collection<string, V2>, Collection<string, Exclude<V, V2>>]>;
	public async partition<This>(
		fn: (this: This, value: ReturnType, key: string, collection: this) => boolean,
		thisArg: This,
	): Promise<[Collection<string, ReturnType>, Collection<string, ReturnType>]>;
	public async partition(
		fn: (value: ReturnType, key: string, collection: this) => boolean,
		thisArg?: unknown,
	): Promise<[Collection<string, ReturnType>, Collection<string, ReturnType>]> {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const results: [Collection<string, ReturnType>, Collection<string, ReturnType>] = [
			new Collection(),
			new Collection(),
		];
		for await (const [key, val] of this) {
			if (fn(val, key, this)) {
				results[0].set(key, val);
			} else {
				results[1].set(key, val);
			}
		}

		return results;
	}

	/**
	 * Maps each item into a RedisCollection, then joins the results into a single RedisCollection. Identical in behavior to
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap | Array.flatMap()}.
	 *
	 * @param fn - Function that produces a new RedisCollection
	 * @param thisArg - Value to use as `this` when executing function
	 * @example
	 * ```ts
	 * await collection.flatMap(guild => guild.members.cache);
	 * ```
	 */
	public async flatMap<T>(
		fn: (value: ReturnType, key: string, collection: this) => Collection<string, T>,
	): Promise<Collection<string, T>>;
	public async flatMap<T, This>(
		fn: (this: This, value: ReturnType, key: string, collection: this) => Collection<string, T>,
		thisArg: This,
	): Promise<Collection<string, T>>;
	public async flatMap<T>(
		fn: (value: ReturnType, key: string, collection: this) => Collection<string, T>,
		thisArg?: unknown,
	): Promise<Collection<string, T>> {
		// eslint-disable-next-line unicorn/no-array-method-this-argument
		const collections = (await this.map(fn, thisArg)).map((collection) => new Collection(collection));

		return new Collection<string, T>().concat(...collections);
	}

	/**
	 * Maps each item to another value into an array. Identical in behavior to
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map | Array.map()}.
	 *
	 * @param fn - Function that produces an element of the new array, taking three arguments
	 * @param thisArg - Value to use as `this` when executing function
	 * @example
	 * ```ts
	 * await collection.map(user => user.tag);
	 * ```
	 */
	public async map<T>(fn: (value: ReturnType, key: string, collection: this) => T): Promise<T[]>;
	public async map<This, T>(
		fn: (this: This, value: ReturnType, key: string, collection: this) => T,
		thisArg: This,
	): Promise<T[]>;
	public async map<T>(fn: (value: ReturnType, key: string, collection: this) => T, thisArg?: unknown): Promise<T[]> {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const iter = this.entries();
		return Promise.all(
			Array.from({ length: await this.size }, async (): Promise<T> => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const [key, value] = (await iter.next()).value;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				return fn(value, key, this);
			}),
		);
	}

	/**
	 * Maps each item to another value into a collection. Identical in behavior to
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map | Array.map()}.
	 *
	 * @param fn - Function that produces an element of the new collection, taking three arguments
	 * @param thisArg - Value to use as `this` when executing function
	 * @example
	 * ```ts
	 * await collection.mapValues(user => user.tag);
	 * ```
	 */
	public async mapValues<T>(
		fn: (value: ReturnType, key: string, collection: this) => T,
	): Promise<Collection<string, T>>;
	public async mapValues<This, T>(
		fn: (this: This, value: ReturnType, key: string, collection: this) => T,
		thisArg: This,
	): Promise<Collection<string, T>>;
	public async mapValues<T>(
		fn: (value: ReturnType, key: string, collection: this) => T,
		thisArg?: unknown,
	): Promise<Collection<string, T>> {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		const coll = new Collection<string, T>();
		for await (const [key, val] of this) coll.set(key, fn(val, key, this));
		return coll;
	}

	/**
	 * Checks if there exists an item that passes a test. Identical in behavior to
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some | Array.some()}.
	 *
	 * @param fn - Function used to test (should return a boolean)
	 * @param thisArg - Value to use as `this` when executing function
	 * @example
	 * ```ts
	 * await collection.some(user => user.discriminator === '0000');
	 * ```
	 */
	public async some(fn: (value: ReturnType, key: string, collection: this) => boolean): Promise<boolean>;
	public async some<T>(
		fn: (this: T, value: ReturnType, key: string, collection: this) => boolean,
		thisArg: T,
	): Promise<boolean>;
	public async some(
		fn: (value: ReturnType, key: string, collection: this) => boolean,
		thisArg?: unknown,
	): Promise<boolean> {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for await (const [key, val] of this) {
			if (fn(val, key, this)) return true;
		}

		return false;
	}

	/**
	 * Checks if all items passes a test. Identical in behavior to
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every | Array.every()}.
	 *
	 * @param fn - Function used to test (should return a boolean)
	 * @param thisArg - Value to use as `this` when executing function
	 * @example
	 * ```ts
	 * await collection.every(user => !user.bot);
	 * ```
	 */
	public async every(fn: (value: ReturnType, key: string, collection: this) => boolean): Promise<boolean>;
	public async every<V2 extends ReturnType>(
		fn: (value: ReturnType, key: string, collection: this) => value is V2,
	): Promise<boolean>;
	public async every(fn: (value: ReturnType, key: string, collection: this) => boolean): Promise<boolean>;
	public async every<This, K2 extends string>(
		fn: (this: This, value: ReturnType, key: string, collection: this) => key is K2,
		thisArg: This,
	): Promise<boolean>;
	public async every<This, V2 extends ReturnType>(
		fn: (this: This, value: ReturnType, key: string, collection: this) => value is V2,
		thisArg: This,
	): Promise<boolean>;
	public async every<This>(
		fn: (this: This, value: ReturnType, key: string, collection: this) => boolean,
		thisArg: This,
	): Promise<boolean>;
	public async every(
		fn: (value: ReturnType, key: string, collection: this) => boolean,
		thisArg?: unknown,
	): Promise<boolean> {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		for await (const [key, val] of this) {
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
	 * await collection.reduce((acc, guild) => acc + guild.memberCount, 0);
	 * ```
	 */
	public async reduce<T>(
		fn: (accumulator: T, value: ReturnType, key: string, collection: this) => T,
		initialValue?: T,
	): Promise<T> {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		let accumulator!: T;

		if (typeof initialValue !== 'undefined') {
			accumulator = initialValue;
			for await (const [key, val] of this) accumulator = fn(accumulator, val, key, this);
			return accumulator;
		}

		let first = true;
		for await (const [key, val] of this) {
			if (first) {
				accumulator = val as unknown as T;
				first = false;
				continue;
			}

			accumulator = fn(accumulator, val, key, this);
		}

		// No items iterated.
		if (first) {
			throw new TypeError('Reduce of empty collection with no initial value');
		}

		return accumulator;
	}

	/**
	 * Identical to
	 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach | Map.forEach()},
	 * but returns the collection instead of undefined.
	 *
	 * @param fn - Function to execute for each element
	 * @param thisArg - Value to use as `this` when executing function
	 * @example
	 * ```ts
	 * await collection
	 *  .each(user => console.log(user.username))
	 * ```
	 */
	public async each(fn: (value: ReturnType, key: string, collection: this) => void): Promise<this>;
	public async each<T>(
		fn: (this: T, value: ReturnType, key: string, collection: this) => void,
		thisArg: T,
	): Promise<this>;
	public async each(fn: (value: ReturnType, key: string, collection: this) => void, thisArg?: unknown): Promise<this> {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		// eslint-disable-next-line unicorn/no-array-method-this-argument, unicorn/no-array-for-each
		await this.forEach(fn, thisArg);
		return this;
	}

	/**
	 * Runs a function on the collection and returns the collection.
	 *
	 * @param fn - Function to execute
	 * @param thisArg - Value to use as `this` when executing function
	 * @example
	 * ```ts
	 * await collection
	 *  .tap(coll => console.log(coll.size))
	 * ```
	 */
	public tap(fn: (collection: this) => void): this;
	public tap<T>(fn: (this: T, collection: this) => void, thisArg: T): this;
	public tap(fn: (collection: this) => void, thisArg?: unknown): this {
		if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
		if (typeof thisArg !== 'undefined') fn = fn.bind(thisArg);
		fn(this);
		return this;
	}

	/**
	 * Creates an identical shallow copy of this collection.
	 *
	 * @example
	 * ```ts
	 * const newColl = await someColl.clone();
	 * ```
	 */
	public async clone(newHash: string): Promise<RedisCollection<V, ReturnType>> {
		const entries = (await this.entriesArray()) as unknown as [string, V][];

		return new RedisCollection(
			{
				hash: newHash,
				redis: this.redis,
				serialize: this.serialize,
				deserialize: this.deserialize,
			},
			entries,
		);
	}

	/**
	 * Combines this collection with others into a new collection. None of the source collections are modified.
	 *
	 * @param newHash - Hash for the new collection
	 * @param collections - Collections to merge
	 * @example
	 * ```ts
	 * const newColl = await someColl.concat(someOtherColl, anotherColl, ohBoyAColl);
	 * ```
	 */
	public async concat(newHash: string, ...collections: ReadonlyRedisCollection<V, ReturnType>[]) {
		const newColl = await this.clone(newHash);
		for (const coll of collections) {
			for await (const [key, val] of coll) await newColl.set(key, val as unknown as V);
		}

		return newColl;
	}

	/**
	 * Checks if this collection shares identical items with another.
	 * This is different to checking for equality using equal-signs, because
	 * the collections may be different objects, but contain the same data.
	 *
	 * @param collection - RedisCollection to compare with
	 * @returns Whether the collections have identical contents
	 */
	public async equals(collection: ReadonlyRedisCollection<V>) {
		if (!collection) return false; // runtime check
		if (this === collection) return true;
		if ((await this.size) !== (await collection.size)) return false;
		for await (const [key, value] of this) {
			if (!(await collection.has(key)) || value !== (await collection.get(key))) {
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
	public async sort(compareFunction: Comparator<ReturnType | V> = RedisCollection.defaultSort): Promise<this> {
		const entries = await this.entriesArray();
		entries.sort((a, b): number => compareFunction(a[1], b[1], a[0], b[0]));

		// Perform clean-up
		await this.clear();
		// Set the new entries
		for (const [k, v] of entries) {
			await this.set(k, v as unknown as V);
		}

		return this;
	}

	/**
	 * The intersect method returns a new structure containing items where the keys and values are present in both original structures.
	 *
	 * @param other - The other RedisCollection to filter against
	 */
	public async intersect<T>(
		other: ReadonlyCollection<string, T> | ReadonlyRedisCollection<any, T>,
	): Promise<Collection<string, T>> {
		const coll = new Collection<string, T>();
		for await (const [k, v] of other) {
			if ((await this.has(k)) && Object.is(v, await this.get(k))) {
				coll.set(k, v);
			}
		}

		return coll;
	}

	/**
	 * The difference method returns a new structure containing items where the key is present in one of the original structures but not the other.
	 *
	 * @param other - The other RedisCollection to filter against
	 */
	public async difference<T>(other: ReadonlyRedisCollection<any, T>): Promise<Collection<string, ReturnType | T>> {
		const coll = new Collection<string, ReturnType | T>();
		for await (const [k, v] of other) {
			if (!(await this.has(k))) coll.set(k, v);
		}

		for await (const [k, v] of this) {
			if (!(await other.has(k))) coll.set(k, v);
		}

		return coll;
	}

	/**
	 * Merges two Collections together into a new RedisCollection.
	 *
	 * @param other - The other RedisCollection to merge with
	 * @param whenInSelf - Function getting the result if the entry only exists in this RedisCollection
	 * @param whenInOther - Function getting the result if the entry only exists in the other RedisCollection
	 * @param whenInBoth - Function getting the result if the entry exists in both Collections
	 * @example
	 * ```ts
	 * // Sums up the entries in two collections.
	 * await coll.merge(
	 *  other,
	 *  x => ({ keep: true, value: x }),
	 *  y => ({ keep: true, value: y }),
	 *  (x, y) => ({ keep: true, value: x + y }),
	 * );
	 * ```
	 * @example
	 * ```ts
	 * // Intersects two collections in a left-biased manner.
	 * await coll.merge(
	 *  other,
	 *  x => ({ keep: false }),
	 *  y => ({ keep: false }),
	 *  (x, _) => ({ keep: true, value: x }),
	 * );
	 * ```
	 */
	public async merge<T, R>(
		other: RedisCollection<any, T>,
		whenInSelf: (value: ReturnType, key: string) => Keep<R>,
		whenInOther: (valueOther: T, key: string) => Keep<R>,
		whenInBoth: (value: ReturnType, valueOther: T, key: string) => Keep<R>,
	): Promise<Collection<string, R>> {
		const coll = new Collection<string, R>();
		const keys = [...(await this.keysArray()), ...(await other.keysArray())];
		const uniqueKeys = new Set(keys);
		for (const k of uniqueKeys) {
			const hasInSelf = await this.has(k);
			const hasInOther = await other.has(k);

			if (hasInSelf && hasInOther) {
				const r = whenInBoth((await this.get(k))!, (await other.get(k))!, k);
				if (r.keep) coll.set(k, r.value);
			} else if (hasInSelf) {
				const r = whenInSelf((await this.get(k))!, k);
				if (r.keep) coll.set(k, r.value);
			} else if (hasInOther) {
				const r = whenInOther((await other.get(k))!, k);
				if (r.keep) coll.set(k, r.value);
			}
		}

		return coll;
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
	 * await collection.sorted((userA, userB) => userA.createdTimestamp - userB.createdTimestamp);
	 * ```
	 */
	public async sorted(compareFunction: Comparator<ReturnType | V> = RedisCollection.defaultSort) {
		return (await this.toCollection()).sort((av, bv, ak, bk) => compareFunction(av, bv, ak, bk));
	}

	public async toCollection(): Promise<Collection<string, ReturnType>> {
		return new Collection(await this.entriesArray());
	}

	public toJSON() {
		return {
			hash: this.hash,
		};
	}

	private static defaultSort<V>(firstValue: V, secondValue: V): number {
		return Number(firstValue > secondValue) || Number(firstValue === secondValue) - 1;
	}

	/**
	 * Creates a RedisCollection from a list of entries.
	 *
	 * @param options - Options for the RedisCollection
	 * @param entries - The list of entries
	 * @param combine - Function to combine an existing entry with a new one
	 * @example
	 * ```ts
	 * await RedisCollection.combineEntries([["a", 1], ["b", 2], ["a", 2]], (x, y) => x + y);
	 * // returns RedisCollection { "a" => 3, "b" => 2 }
	 * ```
	 */
	public static async combineEntries<V, ReturnType = Serialized<V>>(
		options: RedisCollectionOptions<V>,
		entries: AsyncIterable<[string, ReturnType | V]> | Iterable<[string, ReturnType | V]>,
		combine: (firstValue: ReturnType, secondValue: ReturnType | V, key: string) => V,
	): Promise<RedisCollection<V>> {
		const coll = new RedisCollection<V>(options);
		for await (const [k, v] of entries) {
			if (await coll.has(k)) {
				await coll.set(k, combine((await coll.get(k))! as ReturnType, v, k));
			} else {
				await coll.set(k, v as V);
			}
		}

		return coll;
	}
}

/**
 * @internal
 */
export type Keep<V> = { keep: false } | { keep: true; value: V };

/**
 * @internal
 */
export type Comparator<V> = (firstValue: V, secondValue: V, firstKey: string, secondKey: string) => number;
