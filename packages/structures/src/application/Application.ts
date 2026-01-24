import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIApplication, ApplicationFlags } from 'discord-api-types/v10';
import { Structure } from '../Structure';
import { ApplicationFlagsBitField } from '../bitfields';
import { kData } from '../utils/symbols';
import { isIdSet } from '../utils/type-guards';
import type { Partialize } from '../utils/types';

// TODO: missing "team" substructure

/**
 * Represents an application on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks Has substructure `User`, `Guild` and `Team`, which need to be instantiated and stored by an extending class using it.
 */
export class Application<Omitted extends keyof APIApplication | '' = ''> extends Structure<APIApplication, Omitted> {
	/**
	 * @param data - The raw data from the API for the application.
	 */
	public constructor(data: Partialize<APIApplication, Omitted>) {
		super(data);
	}

	/**
	 * The id of the application.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The name of the application.
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The icon hash of the application.
	 *
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting}
	 */
	public get icon() {
		return this[kData].icon;
	}

	/**
	 * The description of the application.
	 */
	public get description() {
		return this[kData].description;
	}

	/**
	 * A list of RPC origin URLs, if RPC is enabled.
	 */
	public get rpcOrigins() {
		return this[kData].rpc_origins;
	}

	/**
	 * Whether the application is public.
	 *
	 * @remarks If `false`, only the app owner can add the app to guilds.
	 */
	public get botPublic() {
		return this[kData].bot_public;
	}

	/**
	 * Whether the application requires a code grant.
	 *
	 * @remarks When `true`, the app's bot will only join upon completion of the full OAuth2 grant flow.
	 */
	public get botRequiresCodeGrant() {
		return this[kData].bot_require_code_grant;
	}

	/**
	 * The URL of the app's terms and service.
	 */
	public get termsOfServiceURL() {
		return this[kData].terms_of_service_url;
	}

	/**
	 * The URL of the app's privacy policy.
	 */
	public get privacyPolicyURL() {
		return this[kData].privacy_policy_url;
	}

	/**
	 * Hexadecimal encoded key for verification in interactions and the GameSDK's GetTicket function.
	 *
	 * @see {@link https://discord.com/developers/docs/game-sdk/applications#getticket}
	 */
	public get verifyKey() {
		return this[kData].verify_key;
	}

	/**
	 * The id of the guild associated with the app.
	 */
	public get guildId() {
		return this[kData].guild_id;
	}

	/**
	 * The id of the "Game SKU" that is created, if this application is a game sold on Discord, .
	 */
	public get primarySKUId() {
		return this[kData].primary_sku_id;
	}

	/**
	 * The URL that links to the store page, if the application is a game sold on Discord.
	 */
	public get slug() {
		return this[kData].slug;
	}

	/**
	 * The application's default rich presence invite cover image hash.
	 *
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting}
	 */
	public get coverImage() {
		return this[kData].cover_image;
	}

	/**
	 * The application's public flags.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/application#application-object-application-flags}
	 */
	public get flags() {
		const flags = this[kData].flags;
		return flags ? new ApplicationFlagsBitField(this[kData].flags as ApplicationFlags) : null;
	}

	/**
	 * Approximate count of guilds the application has been added to.
	 */
	public get approximateGuildCount() {
		return this[kData].approximate_guild_count;
	}

	/**
	 * Approximate count of users that have installed the application
	 * (authorized with `application.commands` as a scope)
	 */
	public get approximateUserInstallCount() {
		return this[kData].approximate_user_install_count;
	}

	/**
	 * Approximate count of users that have OAuth2 authorizations for the app.
	 */
	public get approximateUserAuthorizationCount() {
		return this[kData].approximate_user_authorization_count;
	}

	/**
	 * An array of redirect URIs for the application.
	 */
	public get redirectURIs() {
		return this[kData].redirect_uris;
	}

	/**
	 * The interaction's endpoint URL for the application.
	 */
	public get interactionsEndpointURL() {
		return this[kData].interactions_endpoint_url;
	}

	/**
	 * The application's role connection verification entry point, which when configured will render the app as a verification method in the guild role verification configuration
	 */
	public get roleConnectionsVerificationURL() {
		return this[kData].role_connections_verification_url;
	}

	/**
	 * The event webhooks URL for the application to receive webhook events.
	 */
	public get eventWebhooksURL() {
		return this[kData].event_webhooks_url;
	}

	/**
	 * If webhook events are enabled for the app
	 */
	public get eventWebhooksStatus() {
		return this[kData].event_webhooks_status;
	}

	/**
	 * List of webhook event types the application subscribes to.
	 */
	public get eventWebhooksTypes() {
		return this[kData].event_webhooks_types;
	}

	/**
	 * Up to 5 tags of 20 maximum characters, used to describe the content and functionality of the application.
	 */
	public get tags() {
		return this[kData].tags;
	}

	/**
	 * Settings for the app's default in-app authorization link, if enabled.
	 */
	public get installParams() {
		return this[kData].install_params;
	}

	/**
	 * Default scopes and permissions for each supported installation context. Value for each key is an integration type configuration object.
	 */
	public get integrationTypesConfig() {
		return this[kData].integration_types_config;
	}

	/**
	 * Default custom authorization URL for the application, if enabled.
	 */
	public get customInstallURL() {
		return this[kData].custom_install_url;
	}

	/**
	 * The timestamp the application was created at.
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the application was created at
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}
}
