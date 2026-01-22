import { Collection } from '@discordjs/collection';
import { kPatch, type Structure } from '@discordjs/structures';
import type { Awaitable } from '@discordjs/util';
import type { Snowflake } from 'discord-api-types/globals';

export type RawAPIType<Value extends Structure<{}>> = Value extends Structure<infer Type> ? Type : never;

export interface StructureCache<
	Value extends Structure<{ id: Snowflake }>,
	Raw extends RawAPIType<Value> = RawAPIType<Value>,
> {
	add(key: Snowflake, data: Partial<Raw>): Value;
	get(key: Snowflake): Awaitable<Value | undefined>;
	set(key: Snowflake, value: Value): Awaitable<this>;
}

export type CacheConstructor = new <Value extends Structure<{ id: Snowflake }>>(
	creator: StructureCreator<Value>,
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
