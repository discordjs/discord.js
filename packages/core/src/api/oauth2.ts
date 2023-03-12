import { URL } from 'node:url';
import { type RequestData, type REST, makeURLSearchParams } from '@discordjs/rest';
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
} from 'discord-api-types/v10';

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
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.post(Routes.oauth2TokenExchange(), {
			body: makeURLSearchParams(body),
			passThroughBody: true,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			signal,
		}) as Promise<RESTPostOAuth2AccessTokenResult>;
	}

	/**
	 * Refreshes an OAuth2 access token, giving you a new one
	 *
	 * @see {@link https://discord.com/developers/docs/topics/oauth2#authorization-code-grant-refresh-token-exchange-example}
	 * @param data - The options for the refresh token request
	 * @param options - The options for the refresh token request
	 */
	public async refreshToken(
		data: RESTPostOAuth2RefreshTokenURLEncodedData,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.post(Routes.oauth2TokenExchange(), {
			body: makeURLSearchParams(data),
			passThroughBody: true,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			signal,
		}) as Promise<RESTPostOAuth2RefreshTokenResult>;
	}

	/**
	 * Fetches the bearer token for the current application
	 *
	 * @remarks
	 * This is primarily used for testing purposes
	 * @see {@link https://discord.com/developers/docs/topics/oauth2#client-credentials-grant}
	 * @param data - The options for the client credentials grant request
	 * @param options - The options for the client credentials grant request
	 */
	public async getToken(
		data: RESTPostOAuth2ClientCredentialsURLEncodedData,
		{ signal }: Pick<RequestData, 'signal'> = {},
	) {
		return this.rest.post(Routes.oauth2TokenExchange(), {
			body: makeURLSearchParams(data),
			passThroughBody: true,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			signal,
		}) as Promise<RESTPostOAuth2ClientCredentialsResult>;
	}

	/**
	 * Fetches the current bot's application information
	 *
	 * @see {@link https://discord.com/developers/docs/topics/oauth2#get-current-bot-application-information}
	 * @param options - The options for the current bot application information request
	 */
	public async getCurrentBotApplicationInformation({ signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.oauth2CurrentApplication(), {
			signal,
		}) as Promise<RESTGetAPIOAuth2CurrentApplicationResult>;
	}

	/**
	 * Fetches the current authorization information
	 *
	 * @see {@link https://discord.com/developers/docs/topics/oauth2#get-current-authorization-information}
	 * @param options - The options for the current authorization information request
	 */
	public async getCurrentAuthorizationInformation({ signal }: Pick<RequestData, 'signal'> = {}) {
		return this.rest.get(Routes.oauth2CurrentAuthorization(), {
			signal,
		}) as Promise<RESTGetAPIOAuth2CurrentAuthorizationResult>;
	}
}
