import { channelLink } from '@discordjs/formatters';
import type { GuildChannelType } from 'discord-api-types/v10';
import { ChannelFlagsBitField } from '../../bitfields/ChannelFlagsBitField.js';
import { kData } from '../../utils/symbols.js';
import type { Channel } from '../Channel.js';

export interface GuildChannelMixin<Type extends GuildChannelType = GuildChannelType> extends Channel<Type> {}

export class GuildChannelMixin<Type extends GuildChannelType = GuildChannelType> {
	/**
	 * The flags that are applied to the channel.
	 *
	 * @privateRemarks The type of `flags` can be narrowed in Guild Channels and DMChannel to ChannelFlags, and in GroupDM channel
	 * to null, respecting Omit behaviors
	 */
	public get flags() {
		return this[kData].flags ? new ChannelFlagsBitField(this[kData].flags) : null;
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
		return channelLink(this.id, this.guildId);
	}

	/**
	 * Indicates whether this channel is in a guild
	 */
	public isGuildBased(): this is GuildChannelMixin & this {
		return true;
	}
}
