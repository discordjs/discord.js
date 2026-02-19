import { Collection } from '@discordjs/collection';
import { kPatch, type Structure } from '@discordjs/structures';
import type { Awaitable } from '@discordjs/util';
import type { Snowflake } from 'discord-api-types/globals';
import { createClient } from 'redis';

export type RawAPIType<Value extends Structure<{}>> = Value extends Structure<infer Type> ? Type : never;

export interface StructureCache<
	Value extends Structure<{ id: Snowflake }>,
	Raw extends RawAPIType<Value> = RawAPIType<Value>,
> {
	add(key: Snowflake, data: Partial<Raw>): Awaitable<Value>;
	get(key: Snowflake): Awaitable<Value | undefined>;
	set(key: Snowflake, value: Value): Awaitable<this>;
}

export type CacheConstructor = new <Value extends Structure<{ id: Snowflake }>>(
	creator: StructureCreator<Value>,
	name: string,
	...args: any[]
) => StructureCache<Value>;

export type StructureCreator<
	Value extends Structure<{ id: Snowflake }>,
	Raw extends RawAPIType<Value> = RawAPIType<Value>,
> = (data: Partial<Raw>) => Value;

export class CollectionCache<
	Value extends Structure<{ id: Snowflake }>,
	Raw extends RawAPIType<Value> = RawAPIType<Value>,
>
	extends Collection<Snowflake, Value>
	implements StructureCache<Value, Raw>
{
	private readonly structureCreator: StructureCreator<Value>;

	public constructor(
		creator: StructureCreator<Value>,
		_name: string,
		...args: ConstructorParameters<typeof Collection<Snowflake, Value>>
	) {
		super(...args);
		this.structureCreator = creator;
	}

	public add(_key: Snowflake, _data: Partial<Raw>): Value {
		const value = this.structureCreator(_data);
		this.set(_key, value);
		return value;
	}

	public patch(key: Snowflake, data: Partial<Raw>): Value {
		return this.get(key)?.[kPatch](data) ?? this.add(key, data);
	}
}

// TODO: remove before this gets merged, as this is merely a proof-of-concept for async cache
const redis = createClient();
export class RedisCache<
	Value extends Structure<{ id: Snowflake }>,
	Raw extends RawAPIType<Value> = RawAPIType<Value>,
> implements StructureCache<Value, Raw> {
	private readonly structureCreator: StructureCreator<Value>;

	private readonly name: string;

	public constructor(creator: StructureCreator<Value>, name: string) {
		this.structureCreator = creator;
		this.name = name;
	}

	public async add(_key: Snowflake, _data: Partial<Raw>) {
		const value = this.structureCreator(_data);
		await this.set(_key, value);
		return value;
	}

	public async get(key: Snowflake) {
		const data = await redis.json.get(`${this.name}:${key}`);
		if (data && typeof data === 'object' && !Array.isArray(data)) {
			return this.structureCreator(data as Raw);
		}

		return undefined;
	}

	public async patch(key: Snowflake, data: Partial<Raw>): Promise<Value> {
		const value = await this.get(key);
		if (value) {
			value[kPatch](data);
			await this.set(key, value);
			return value;
		} else {
			return this.add(key, data);
		}
	}

	public async set(key: Snowflake, value: Value) {
		await redis.json.set(`${this.name}:${key}`, '$', value.toJSON());
		return this;
	}
}
