import type { Structure } from '@discordjs/structures';
import { kClone, kPatch } from '@discordjs/structures';
import type { Snowflake } from 'discord-api-types/globals';
import type { Client } from '../Client.js';
import type { StructureCache } from '../util/cache.js';

export abstract class CachedManager<
	Value extends Structure<{ id: Snowflake }> & { get id(): Snowflake },
	Raw extends { id: Snowflake } = Value extends Structure<infer Type> ? Type : never,
> {
	public client: Client;

	public cache: StructureCache<Raw, Value>;

	protected abstract createStructure(data: Raw, ...extras: unknown[]): Value;

	public constructor(client: Client) {
		this.client = client;
		this.cache = client.CacheConstructor<Value, Raw>();
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
