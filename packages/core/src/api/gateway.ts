/* eslint-disable jsdoc/check-param-names */

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
	public async get({ dispatcher, headers, rejectOnRateLimit, signal }: BaseRequestOptions = {}) {
		return this.rest.get(Routes.gateway(), {
			auth: false,
			dispatcher,
			headers,
			rejectOnRateLimit,
			signal,
		}) as Promise<RESTGetAPIGatewayResult>;
	}

	/**
	 * Gets gateway information with additional metadata.
	 *
	 * @see {@link https://discord.com/developers/docs/events/gateway#get-gateway-bot}
	 * @param options - The options for fetching the gateway information
	 */
	public async getBot({ auth, dispatcher, headers, rejectOnRateLimit, signal }: RequestOptions = {}) {
		return this.rest.get(Routes.gatewayBot(), {
			auth,
			dispatcher,
			headers,
			rejectOnRateLimit,
			signal,
		}) as Promise<RESTGetAPIGatewayBotResult>;
	}
}
