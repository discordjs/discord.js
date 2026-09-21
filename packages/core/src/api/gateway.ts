import type { REST } from '@discordjs/rest';
import { Routes, type RESTGetAPIGatewayBotResult, type RESTGetAPIGatewayResult } from 'discord-api-types/v10';
import type { BaseRequestOptions, RequestOptions } from '../util/types.js';

export class GatewayAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Gets gateway information.
	 *
	 * @see {@link https://discord.com/developers/docs/events/gateway#get-gateway}
	 * @param options - The options for fetching the gateway information
	 */
	public async get(options: BaseRequestOptions = {}) {
		return this.rest.get(Routes.gateway(), {
			...options,
			auth: false,
		}) as Promise<RESTGetAPIGatewayResult>;
	}

	/**
	 * Gets gateway information with additional metadata.
	 *
	 * @see {@link https://discord.com/developers/docs/events/gateway#get-gateway-bot}
	 * @param options - The options for fetching the gateway information
	 */
	public async getBot(options: RequestOptions = {}) {
		return this.rest.get(Routes.gatewayBot(), options) as Promise<RESTGetAPIGatewayBotResult>;
	}
}
