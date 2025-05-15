import type { ChannelType } from 'discord-api-types/v10';
import { kData } from '../utils/symbols';
import type { Channel } from './Channel';

export interface ChannelPermissionMixin<
	Type extends
		| ChannelType.GuildAnnouncement
		| ChannelType.GuildCategory
		| ChannelType.GuildForum
		| ChannelType.GuildMedia
		| ChannelType.GuildStageVoice
		| ChannelType.GuildText
		| ChannelType.GuildVoice,
> extends Channel<Type> {}

export class ChannelPermissionMixin<
	Type extends
		| ChannelType.GuildAnnouncement
		| ChannelType.GuildCategory
		| ChannelType.GuildForum
		| ChannelType.GuildMedia
		| ChannelType.GuildStageVoice
		| ChannelType.GuildText
		| ChannelType.GuildVoice,
> {
	public get position() {
		return this[kData].position;
	}

	public get permissionOverwrites() {
		return this[kData].permission_overwrites;
	}

	/**
	 * Indicates whether this channel can have permission overwrites
	 */
	public isPermissionCapabale() {
		return true;
	}
}
