import process from 'node:process';
import { Collection } from '@discordjs/collection';
import type { RESTGetAPIGatewayBotResult, Snowflake } from '@discordjs/core';
import { Client as CoreClient, Routes, GatewayDispatchEvents } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import type { Structure } from '@discordjs/structures';
import { WebSocketManager } from '@discordjs/ws';
import type { CacheConstructor, Cache } from './util/types';

export class Client {
	private core!: CoreClient;

	public options: { token: string | undefined };

	#token: string;

	public CacheConstructor<Value extends Structure<object>>(_value: new (...args: any[]) => Value) {
		return new this.cacheConstructor() as Cache<Snowflake, Value>;
	}

	protected cacheConstructor: CacheConstructor;

	public constructor({ token = process.env.DISCORD_TOKEN }: { token?: string }, cache: CacheConstructor = Collection) {
		this.options = { token };
		this.#token = token!;
		this.cacheConstructor = cache;
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
