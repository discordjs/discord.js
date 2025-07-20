import process from 'node:process';
import type { RESTGetAPIGatewayBotResult, Snowflake } from '@discordjs/core';
import { Client as CoreClient, Routes, GatewayDispatchEvents } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import type { Structure } from '@discordjs/structures';
import { WebSocketManager } from '@discordjs/ws';
import { CollectionCache, type CacheConstructor, type StructureCache } from './util/cache.js';
import { container } from './util/container.js';

export class Client {
	private core!: CoreClient;

	public options: { token: string | undefined };

	#token: string;

	public CacheConstructor<
		Value extends Structure<{ id: Snowflake }>,
		Raw extends { id: Snowflake } = Value extends Structure<infer Type> ? Type : never,
	>() {
		return new this.cacheConstructor() as StructureCache<Raw, Value>;
	}

	protected cacheConstructor: CacheConstructor;

	public constructor(
		{ token = process.env.DISCORD_TOKEN }: { token?: string },
		cache: CacheConstructor = CollectionCache,
	) {
		this.options = { token };
		this.#token = token!;
		this.cacheConstructor = cache;
		container.set('client', this);
	}

	public async login(token?: string) {
		if (token) {
			this.#token = token;
		}

		const rest = new REST().setToken(this.#token);
		const gateway = new WebSocketManager({
			fetchGatewayInformation: async () => rest.get(Routes.gatewayBot()) as Promise<RESTGetAPIGatewayBotResult>,
			intents: 0,
			token: this.#token,
		});
		this.core = new CoreClient({
			gateway,
			rest,
		});

		// TODO: remove once we actually implement anything using this.core
		this.core.on(GatewayDispatchEvents.Ready, console.log);

		await gateway.connect();
	}
}
