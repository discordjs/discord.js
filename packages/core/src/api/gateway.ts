/* eslint-disable jsdoc/check-param-names */

import type { RequestData, REST } from '@discordjs/rest';
import { Routes, type RESTGetAPIGatewayBotResult, type RESTGetAPIGatewayResult } from 'discord-api-types/v10';

export class GatewayAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Gets gateway information.
	 *
	 * @see {@link https://discord.com/developers/docs/events/gateway#get-gateway}
	 * @param options - The options for fetching the gateway information
	 */
	public async get({ signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.gateway(), {
			auth: false,
			signal,
		}) as Promise<RESTGetAPIGatewayResult>;
	}

	/**
	 * Gets gateway information with additional metadata.
	 *
	 * @see {@link https://discord.com/developers/docs/events/gateway#get-gateway-bot}
	 * @param options - The options for fetching the gateway information
	 */
	public async getBot({ auth, signal }: Pick<RequestData, 'auth' | 'signal'> = {}) {
		return this.rest.get(Routes.gatewayBot(), {
			auth,
			signal,
		}) as Promise<RESTGetAPIGatewayBotResult>;
	}
}
