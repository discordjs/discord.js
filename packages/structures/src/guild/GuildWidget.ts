import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIGuildWidget } from 'discord-api-types/v10';
import { Structure } from '../Structure';
import { kData } from '../utils/symbols';
import { isIdSet } from '../utils/type-guards';
import type { Partialize } from '../utils/types';

/**
 * Represents a guild widget on Discord.
 *
 *  @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 *  @remarks Intentionally does not export `channels`, or `members`,
 *  so extending classes can map each array to `GuildWidgetChannel[]`, and `GuildWidgetMember[]` respectively.
 */
export class GuildWidget<Omitted extends keyof APIGuildWidget | ''> extends Structure<APIGuildWidget, Omitted> {
	/**
	 * @param data - The raw data from the API for the guild widget.
	 */
	public constructor(data: Partialize<APIGuildWidget, Omitted>) {
		super(data);
	}

	/**
	 * The id of the guild.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The name of the guild.
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * Instant invite for the guild's specified widget invite channel.
	 */
	public get instantInvite() {
		return this[kData].instant_invite;
	}

	/**
	 * Number of online members in this guild.
	 */
	public get presenceCount() {
		return this[kData].presence_count;
	}

	/**
	 * The timestamp the guild was created at.
	 */
	public get createdTimestamp() {
		return isIdSet(this.id) ? DiscordSnowflake.timestampFrom(this.id) : null;
	}

	/**
	 * The time the guild was created at.
	 */
	public get createdAt() {
		const createdTimestamp = this.createdTimestamp;
		return createdTimestamp ? new Date(createdTimestamp) : null;
	}
}
