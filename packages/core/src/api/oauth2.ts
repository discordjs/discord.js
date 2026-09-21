/* eslint-disable jsdoc/check-param-names */

import { type REST, makeURLSearchParams } from '@discordjs/rest';
import {
	Routes,
	RouteBases,
	type RESTOAuth2AuthorizationQuery,
	type RESTPostOAuth2RefreshTokenURLEncodedData,
	type RESTPostOAuth2RefreshTokenResult,
	type RESTPostOAuth2ClientCredentialsURLEncodedData,
	type RESTPostOAuth2ClientCredentialsResult,
	type RESTGetAPIOAuth2CurrentAuthorizationResult,
	type RESTGetAPIOAuth2CurrentApplicationResult,
	type RESTPostOAuth2AccessTokenURLEncodedData,
	type RESTPostOAuth2AccessTokenResult,
	type RESTPostOAuth2TokenRevocationQuery,
	type Snowflake,
} from 'discord-api-types/v10';
import type { BaseRequestOptions, RequestOptions } from '../util/types.js';

export class OAuth2API {
	public constructor(private readonly rest: REST) {}

	/**
	 * Creates an OAuth2 authorization URL given the options
	 *
	 * @see {@link https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-authorization-url-example}
	 * @param options - The options for creating the authorization URL
	 */
	public generateAuthorizationURL(options: RESTOAuth2AuthorizationQuery) {
		const url = new URL(`${RouteBases.api}${Routes.oauth2Authorization()}`);
		url.search = makeURLSearchParams(options).toString();
		return url.toString();
	}

	/**
	 * Performs an OAuth2 token exchange, giving you an access token
	 *
	 * @see {@link https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-access-token-exchange-example}
	 * @param body - The body of the token exchange request
	 * @param options - The options for the token exchange request
	 */
	public async tokenExchange(
		body: RESTPostOAuth2AccessTokenURLEncodedData,
		{ headers, ...options }: BaseRequestOptions = {},
	) {
		return this.rest.post(Routes.oauth2TokenExchange(), {
			...options,
			body: makeURLSearchParams<RESTPostOAuth2AccessTokenURLEncodedData>(body),
			passThroughBody: true,
			headers: {
				...headers,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			auth: false,
		}) as Promise<RESTPostOAuth2AccessTokenResult>;
	}

	/**
	 * Refreshes an OAuth2 access token, giving you a new one
	 *
	 * @see {@link https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-refresh-token-exchange-example}
	 * @param body - The options for the refresh token request
	 * @param options - The options for the refresh token request
	 */
	public async refreshToken(
		body: RESTPostOAuth2RefreshTokenURLEncodedData,
		{ headers, ...options }: BaseRequestOptions = {},
	) {
		return this.rest.post(Routes.oauth2TokenExchange(), {
			...options,
			body: makeURLSearchParams<RESTPostOAuth2RefreshTokenURLEncodedData>(body),
			passThroughBody: true,
			headers: {
				...headers,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			auth: false,
		}) as Promise<RESTPostOAuth2RefreshTokenResult>;
	}

	/**
	 * Fetches the bearer token for the current application
	 *
	 * @remarks
	 * This is primarily used for testing purposes
	 * @see {@link https://discord.com/developers/docs/topics/oauth2#client-credentials-grant}
	 * @param body - The options for the client credentials grant request
	 * @param options - The options for the client credentials grant request
	 */
	public async getToken(
		body: RESTPostOAuth2ClientCredentialsURLEncodedData,
		{ headers, ...options }: BaseRequestOptions = {},
	) {
		return this.rest.post(Routes.oauth2TokenExchange(), {
			...options,
			body: makeURLSearchParams(body),
			passThroughBody: true,
			headers: {
				...headers,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			auth: false,
		}) as Promise<RESTPostOAuth2ClientCredentialsResult>;
	}

	/**
	 * Fetches the current bot's application information
	 *
	 * @see {@link https://discord.com/developers/docs/topics/oauth2#get-current-bot-application-information}
	 * @param options - The options for the current bot application information request
	 */
	public async getCurrentBotApplicationInformation(options: RequestOptions = {}) {
		return this.rest.get(
			Routes.oauth2CurrentApplication(),
			options,
		) as Promise<RESTGetAPIOAuth2CurrentApplicationResult>;
	}

	/**
	 * Fetches the current authorization information
	 *
	 * @see {@link https://discord.com/developers/docs/topics/oauth2#get-current-authorization-information}
	 * @param options - The options for the current authorization information request
	 */
	public async getCurrentAuthorizationInformation(options: RequestOptions = {}) {
		return this.rest.get(
			Routes.oauth2CurrentAuthorization(),
			options,
		) as Promise<RESTGetAPIOAuth2CurrentAuthorizationResult>;
	}

	/**
	 * Revokes an OAuth2 token
	 *
	 * @see {@link https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-token-revocation-example}
	 * @param applicationId - The application id
	 * @param applicationSecret - The application secret
	 * @param body - The body of the token revocation request
	 * @param options - The options for the token revocation request
	 */
	public async revokeToken(
		applicationId: Snowflake,
		applicationSecret: string,
		body: RESTPostOAuth2TokenRevocationQuery,
		{ headers, ...options }: BaseRequestOptions = {},
	) {
		await this.rest.post(Routes.oauth2TokenRevocation(), {
			...options,
			body: makeURLSearchParams(body),
			passThroughBody: true,
			headers: {
				...headers,
				Authorization: `Basic ${btoa(`${applicationId}:${applicationSecret}`)}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			auth: false,
		});
	}
}
