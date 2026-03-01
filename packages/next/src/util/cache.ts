import { Collection } from '@discordjs/collection';
import { kPatch, type Structure } from '@discordjs/structures';
import type { Awaitable } from '@discordjs/util';
import type { Snowflake } from 'discord-api-types/globals';
import { createClient } from 'redis';

export type RawAPIType<Value extends Structure<{}>> = Value extends Structure<infer Type> ? Type : never;

export interface Cache<Value extends Structure<{ id: Snowflake }>, Raw extends RawAPIType<Value> = RawAPIType<Value>> {
	/**
	 * Adds or updates data in the cache, returning the instantiated structure.
	 * If the item exists, it patches it with the new data unless `overwrite` is true.
	 * If it does not exist, it constructs a new instance and stores it.
	 */
	add(data: Partial<Raw> & { id: Snowflake }, overwrite?: boolean): Awaitable<Value>;

	/**
	 * Clears all items from the cache.
	 */
	clear(): Awaitable<void>;

	/**
	 * The function used to construct instances of the structure this cache holds.
	 */
	readonly construct: StructureCreator<Value, Raw>;

	/**
	 * Deletes an item from the cache.
	 */
	delete(key: Snowflake): Awaitable<boolean>;

	/**
	 * Retrieves an item from the cache.
	 */
	get(key: Snowflake): Awaitable<Value | undefined>;

	/**
	 * Gets the number of items in the cache.
	 */
	getSize(): Awaitable<number>;

	/**
	 * Checks if an item exists in the cache.
	 */
	has(key: Snowflake): Awaitable<boolean>;

	/**
	 * Sets an item in the cache.
	 */
	set(key: Snowflake, value: Value): Awaitable<this>;
}

export type CacheConstructor = new <Value extends Structure<{ id: Snowflake }>>(
	creator: StructureCreator<Value>,
	name: string,
	...args: any[]
) => Cache<Value>;

export type StructureCreator<
	Value extends Structure<{ id: Snowflake }>,
	Raw extends RawAPIType<Value> = RawAPIType<Value>,
> = (data: Partial<Raw>) => Value;

export class CollectionCache<
	Value extends Structure<{ id: Snowflake }>,
	Raw extends RawAPIType<Value> = RawAPIType<Value>,
>
	extends Collection<Snowflake, Value>
	implements Cache<Value, Raw>
{
	public readonly construct: StructureCreator<Value>;

	public constructor(
		creator: StructureCreator<Value>,
		_name: string,
		...args: ConstructorParameters<typeof Collection<Snowflake, Value>>
	) {
		super(...args);
		this.construct = creator;
	}

	public add(_data: Partial<Raw> & { id: Snowflake }, overwrite: boolean = false) {
		if (!overwrite && this.has(_data.id)) {
			return this.get(_data.id)![kPatch](_data);
		} else {
			const value = this.construct(_data);
			this.set(_data.id, value);
			return value;
		}
	}

	public getSize() {
		return this.size;
	}
}

// TODO: remove before this gets merged, as this is merely a proof-of-concept for async cache
const redis = createClient();
export class RedisCache<
	Value extends Structure<{ id: Snowflake }>,
	Raw extends RawAPIType<Value> = RawAPIType<Value>,
> implements Cache<Value, Raw> {
	public readonly construct: StructureCreator<Value>;

	private readonly name: string;

	public constructor(creator: StructureCreator<Value>, name: string) {
		this.construct = creator;
		this.name = name;
	}

	public async clear() {
		return void redis.del(this.name);
	}

	public async delete(key: Snowflake) {
		return (await redis.hDel(this.name, key)) === 1;
	}

	public async getSize() {
		return redis.hLen(this.name);
	}

	public async has(key: Snowflake) {
		return (await redis.hExists(this.name, key)) === 1;
	}

	public async add(_data: Partial<Raw> & { id: Snowflake }, overwrite: boolean = false) {
		const value = await this.get(_data.id);
		if (!overwrite && value) {
			value[kPatch](_data);
			await this.set(_data.id, value);
			return value;
		} else {
			const value = this.construct(_data);
			await this.set(_data.id, value);
			return value;
		}
	}

	public async get(key: Snowflake) {
		const data = await redis.hGet(this.name, key);
		if (data) {
			const parsed = JSON.parse(data);
			if (typeof parsed === 'object' && !Array.isArray(parsed)) {
				return this.construct(parsed as Raw);
			}
		}

		return undefined;
	}

	public async set(key: Snowflake, value: Value) {
		await redis.hSet(this.name, key, JSON.stringify(value.toJSON()));
		return this;
	}
}
