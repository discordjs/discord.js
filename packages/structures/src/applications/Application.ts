import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIApplication } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData, kPatch } from '../utils/symbols.js';
import { isIdSet } from '../utils/type-guards.js';
import type { Partialize } from '../utils/types.js';
/**
 * Represents a Discord application
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class Application<Omitted extends keyof APIApplication | '' = ''> extends Structure<APIApplication, Omitted> {
	public static override readonly DataTemplate: Partial<APIApplication> = {};

	/**
	 * @param data - The raw data received from the API for the application
	 */
	public constructor(data: Partialize<APIApplication, Omitted>) {
		super(data);
	}

	/**
	 * {@inheritDoc Structure.[kPatch]}
	 *
	 * @internal
	 */
	public override [kPatch](data: Partial<APIApplication>) {
		return super[kPatch](data);
	}

	/**
	 * The id of the application
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The name of the application
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The description of the application
	 */
	public get description() {
		return this[kData].description;
	}

	/**
	 * The icon hash of the application
	 */
	public get icon() {
		return this[kData].icon;
	}

	/**
	 * If this application's bot is public.
	 * When `false` only the application owner can add the application's bot to guilds
	 */
	public get botPublic() {
		return this[kData].bot_public;
	}

	/**
	 * If this application's bot requires code grant.
	 * When `true` the application's bot will only join upon completion of the full OAuth2 code grant flow
	 */
	public get botRequireCodeGrant() {
		return this[kData].bot_require_code_grant;
	}

	/**
	 * The hexadecimal encoded key for verification in interactions and the GameSDK's GetTicket function
	 */
	public get verifyKey() {
		return this[kData].verify_key;
	}

	/**
	 * The team this application belongs to
	 */
	public get team() {
		return this[kData].team;
	}

	/**
	 * If webhook events are enabled for the application
	 */
	public get eventWebhookStatus() {
		return this[kData].event_webhooks_status;
	}

	/**
	 * The timestamp the application was created at
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

	/**
	 * When concatenated with a string, this automatically returns the application's name instead of the
	 * Application object.
	 *
	 * @returns The application's name or an empty string if it doesn't have a name
	 */
	public override toString() {
		return this.name ?? '';
	}
}
