import type { ChannelType, GuildChannelType, ThreadChannelType } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols.js';
import type { Channel } from '../Channel.js';

export interface ChannelPermissionMixin<
	Type extends Exclude<GuildChannelType, ChannelType.GuildDirectory | ThreadChannelType> = Exclude<
		GuildChannelType,
		ChannelType.GuildDirectory | ThreadChannelType
	>,
> extends Channel<Type> {}

/**
 * @remarks has an array of sub-structures {@link PermissionOverwrite} that extending mixins should add to their DataTemplate and _optimizeData
 */
export class ChannelPermissionMixin<
	Type extends Exclude<GuildChannelType, ChannelType.GuildDirectory | ThreadChannelType> = Exclude<
		GuildChannelType,
		ChannelType.GuildDirectory | ThreadChannelType
	>,
> {
	/**
	 * The sorting position of the channel
	 */
	public get position() {
		return this[kData].position;
	}

	/**
	 * Indicates whether this channel can have permission overwrites
	 */
	public isPermissionCapable(): this is ChannelPermissionMixin & this {
		return true;
	}
}
