import type { GuildChannelType } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols';
import type { Channel } from '../Channel';

export interface GuildChannelMixin<Type extends GuildChannelType> extends Channel<Type> {}

export class GuildChannelMixin<Type extends GuildChannelType> {
	/**
	 * The flags that are applied to the channel.
	 *
	 * @privateRemarks The type of `flags` can be narrowed in Guild Channels and DMChannel to ChannelFlags, and in GroupDM channel
	 * to null, respecting Omit behaviors
	 */
	public get flags() {
		return this[kData].flags!;
	}

	/**
	 * THe id of the guild this channel is in.
	 */
	public get guildId() {
		return this[kData].guild_id!;
	}

	/**
	 * The URL to this channel.
	 */
	public get url() {
		return `https://discord.com/channels/${this.guildId}/${this.id}`;
	}

	/**
	 * Indiciates whether this channel is in a guild
	 */
	public isGuildBased(): this is GuildChannelMixin<Extract<Type, GuildChannelType>> {
		return true;
	}
}
