import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIGuildScheduledEvent } from 'discord-api-types/v10';
import { Structure } from '../../Structure';
import { dateToDiscordISOTimestamp } from '../../utils/optimization';
import { kData, kScheduledEndTime, kScheduledStartTime } from '../../utils/symbols';
import { isIdSet } from '../../utils/type-guards';
import type { Partialize } from '../../utils/types';

/**
 * Represents a guild scheduled event on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructures `User` and `GuildScheduledEventEntityMetadata`, which need to be instantiated and stored by any extending classes using it.
 */
export class GuildScheduledEvent<
	Omitted extends keyof APIGuildScheduledEvent | '' = 'scheduled_end_time' | 'scheduled_start_time',
> extends Structure<APIGuildScheduledEvent, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each `GuildScheduledEvent`
	 *
	 * @remarks This template has defaults, if you want to remove additional data and keep the defaults,
	 * use `Object.defineProperties`. To override the defaults, set this value directly.
	 */
	public static override readonly DataTemplate: Partial<APIGuildScheduledEvent> = {
		set scheduled_end_time(_: string) {},
		set scheduled_start_time(_: string) {},
	};

	protected [kScheduledEndTime]: number | null = null;

	protected [kScheduledStartTime]: number | null = null;

	/**
	 *param data - The raw data from the API for the scheduled event.
	 */
	public constructor(data: Partialize<APIGuildScheduledEvent, Omitted>) {
		super(data);
		this.optimizeData(data);
	}

	/**
	 * The id of the scheduled event.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The guild id which the scheduled event belongs to.
	 */
	public get guildId() {
		return this[kData].guild_id;
	}

	/**
	 *
	 * The channel id in which the scheduled event will be hosted, or `null` if entity type is `EXTERNAL`.
	 *
	 * @see {@link https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-field-requirements-by-entity-type}
	 */
	public get channelId() {
		return this[kData].channel_id;
	}

	/**
	 * The id of the user that created the scheduled event.
	 */
	public get creatorId() {
		return this[kData].creator_id;
	}

	/**
	 * The name of the scheduled event.
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The description of the scheduled event
	 */
	public get description() {
		return this[kData].description;
	}

	/**
	 * The privacy level of the scheduled event.
	 */
	public get privacyLevel() {
		return this[kData].privacy_level;
	}

	/**
	 * The status of the scheduled event.
	 */
	public get status() {
		return this[kData].status;
	}

	/**
	 * The type of the scheduled event.
	 */
	public get entityType() {
		return this[kData].entity_type;
	}

	/**
	 * The id of the entity associated with a guild scheduled event.
	 */
	public get entityId() {
		return this[kData].entity_id;
	}

	/**
	 * The number of users subscribed to the scheduled event.
	 */
	public get userCount() {
		return this[kData].user_count;
	}

	/**
	 * The cover image hash of the scheduled event.
	 */
	public get image() {
		return this[kData].image;
	}

	/**
	 * The timestamp the scheduled event was created at.
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the scheduled event was created at.
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}

	/**
	 * {@inheritDoc Structure.optimizeData}
	 */
	protected override optimizeData(data: Partial<APIGuildScheduledEvent>): void {
		if (data.scheduled_end_time) {
			this[kScheduledEndTime] = Date.parse(data.scheduled_end_time);
		}

		if (data.scheduled_start_time) {
			this[kScheduledStartTime] = Date.parse(data.scheduled_start_time);
		}
	}

	/**
	 * {@inheritDoc Structure.toJSON}
	 */
	public override toJSON() {
		const clone = super.toJSON();

		const scheduledEndTime = this[kScheduledEndTime];
		const scheduledStartTime = this[kScheduledStartTime];

		if (scheduledEndTime) {
			clone.scheduled_end_time = dateToDiscordISOTimestamp(new Date(scheduledEndTime));
		}

		if (scheduledStartTime) {
			clone.scheduled_start_time = dateToDiscordISOTimestamp(new Date(scheduledStartTime));
		}

		return clone;
	}
}
