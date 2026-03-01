import type { Structure } from '@discordjs/structures';
import { kClone, kPatch } from '@discordjs/structures';
import type { Snowflake } from 'discord-api-types/globals';
import type { Client } from '../Client.js';
import type { RawAPIType, Cache } from '../util/cache.js';

export abstract class CachedManager<
	Value extends Structure<{ id: Snowflake }> & { get id(): Snowflake },
	Raw extends RawAPIType<Value> = RawAPIType<Value>,
> {
	public client: Client;

	public cache: Cache<Value>;

	protected abstract createStructure(data: Partial<RawAPIType<Value>>, ...extras: unknown[]): Value;

	public constructor(client: Client, name: string) {
		this.client = client;
		this.cache = client.CacheConstructor<Value>(this.createStructure.bind(this), name);
	}

	protected async _add(data: Raw, cache = true, { id, extras = [] }: { extras?: unknown[]; id?: Snowflake } = {}) {
		const existing = await this.cache.get(id ?? data.id);
		if (existing) {
			if (cache) {
				existing[kPatch](data);
				return existing;
			}

			return existing[kClone](data);
		}

		const entry = this.createStructure(data, ...extras);
		if (cache) await this.cache.set(id ?? entry.id, entry);
		return entry;
	}
}
