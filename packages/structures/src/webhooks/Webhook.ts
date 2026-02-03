import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIWebhook } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import { isIdSet } from '../utils/type-guards.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents any webhook on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructures `User`, `Guild`, `Channel` which need to be instantiated and stored by an extending class using it
 */
export class Webhook<Omitted extends keyof APIWebhook | '' = ''> extends Structure<APIWebhook, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each webhook
	 */
	public static override readonly DataTemplate: Partial<APIWebhook> = {};

	/**
	 * @param data - The raw data received from the API for the webhook
	 */
	public constructor(data: Partialize<APIWebhook, Omitted>) {
		super(data);
	}

	/**
	 * The id of the webhook
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The type of the webhook
	 *
	 * @see {@link https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-types}
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * The guild id this webhook is for, if any
	 */
	public get guildId() {
		return this[kData].guild_id;
	}

	/**
	 * The channel id this webhook is for, if any
	 */
	public get channelId() {
		return this[kData].channel_id;
	}

	/**
	 * The default name of the webhook
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The default user avatar hash of the webhook
	 *
	 * @see {@link https://discord.com/developers/docs/reference#image-formatting}
	 */
	public get avatar() {
		return this[kData].avatar;
	}

	/**
	 * The secure token of the webhook (returned for incoming webhooks)
	 */
	public get token() {
		return this[kData].token;
	}

	/**
	 * The id of the bot/OAuth2 application that created this webhook
	 */
	public get applicationId() {
		return this[kData].application_id;
	}

	/**
	 * The url used for executing the webhook (returned by the webhooks OAuth2 flow)
	 */
	public get url() {
		return this[kData].url;
	}

	/**
	 * The timestamp the webhook was created at
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the webhook was created at
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}
}
