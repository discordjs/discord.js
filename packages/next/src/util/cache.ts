import { Collection } from '@discordjs/collection';
import { kPatch, type Structure } from '@discordjs/structures';
import type { Awaitable } from '@discordjs/util';
import type { Snowflake } from 'discord-api-types/globals';

export interface StructureCache<Raw, Value extends Structure<object>> {
	add(key: Snowflake, data: Partial<Raw>): Value;
	get(key: Snowflake): Awaitable<Value | undefined>;
	set(key: Snowflake, value: Value): Awaitable<this>;
}

export type CacheConstructor = new (...args: any[]) => StructureCache<unknown, Structure<object>>;

export class CollectionCache<Raw, Value extends Structure<object>>
	extends Collection<Snowflake, Value>
	implements StructureCache<Raw, Value>
{
	public add(_key: Snowflake, _data: Partial<Raw>): Value {
		throw new Error('Method not implemented.');
	}

	public patch(key: Snowflake, data: Partial<Raw>): Value {
		return this.get(key)?.[kPatch](data) ?? this.add(key, data);
	}
}
