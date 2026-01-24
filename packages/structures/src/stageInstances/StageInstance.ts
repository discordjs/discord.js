import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIStageInstance, StageInstancePrivacyLevel } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import { isIdSet } from '../utils/type-guards.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents any stage instance on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class StageInstance<Omitted extends keyof APIStageInstance | '' = ''> extends Structure<
	APIStageInstance,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each stage instance
	 */
	public static override readonly DataTemplate: Partial<APIStageInstance> = {};

	/**
	 * @param data - The raw data received from the API for the stage instance
	 */
	public constructor(data: Partialize<APIStageInstance, Omitted>) {
		super(data);
	}

	/**
	 * The stage instance's id
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The guild id of the associated stage channel
	 */
	public get guildId() {
		return this[kData].guild_id;
	}

	/**
	 * The id of the associated stage channel
	 */
	public get channelId() {
		return this[kData].channel_id;
	}

	/**
	 * The topic of the stage instance (1-120 characters)
	 */
	public get topic() {
		return this[kData].topic;
	}

	/**
	 * The {@link https://discord.com/developers/docs/resources/stage-instance#stage-instance-object-privacy-level | privacy level} of the stage instance
	 *
	 * @see {@link StageInstancePrivacyLevel}
	 */
	public get privacyLevel() {
		return this[kData].privacy_level;
	}

	/**
	 * Whether the stage discovery is disabled (deprecated)
	 *
	 * @deprecated
	 * {@link https://github.com/discord/discord-api-docs/pull/4296 | discord-api-docs#4296}
	 */
	public get discoverableDisabled() {
		return this[kData].discoverable_disabled;
	}

	/**
	 * The id of the scheduled event for this stage instance
	 */
	public get guildScheduledEventId() {
		return this[kData].guild_scheduled_event_id;
	}

	/**
	 * The timestamp the stage instance was created at
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the stage instance was created at
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}
}
