import type { Structure } from '@discordjs/structures';
import { kClone, kPatch } from '@discordjs/structures';
import type { Snowflake } from 'discord-api-types/globals';
import type { Client } from '../Client.js';
import type { Cache } from '../util/types.js';

export class CachedManager<Value extends Structure<object> & { get id(): Snowflake }> {
	public client: Client;

	public cache: Cache<Snowflake, Value>;

	private readonly holds: new (...args: any[]) => Value;

	public constructor(client: Client, value: new (...args: any[]) => Value) {
		this.client = client;
		this.cache = client.CacheConstructor(value);
		this.holds = value;
	}

	protected async _add(
		data: Value extends Structure<infer Type> ? (Type extends { id: Snowflake } ? Type : never) : never,
		cache = true,
		{ id, extras = [] }: { extras?: unknown[]; id?: Snowflake } = {},
	) {
		const existing = await this.cache.get(id ?? data.id);
		if (existing) {
			if (cache) {
				existing[kPatch](data);
				return existing;
			}

			const clone = existing[kClone]();
			clone[kPatch](data);
			return clone;
		}

		const entry = this.holds ? new this.holds(data, this.client, ...extras) : data;
		if (cache) await this.cache.set(id ?? entry.id, entry);
		return entry;
	}
}
