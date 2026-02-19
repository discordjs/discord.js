import { ChannelType, type APIChannel } from 'discord-api-types/v10';
import type { Client } from '../Client.js';
import { AnnouncementChannel } from '../structures/AnnouncementChannel.js';
import { AnnouncementThreadChannel } from '../structures/AnnouncementThreadChannel.js';
import { BaseChannel } from '../structures/BaseChannel.js';
import { CategoryChannel } from '../structures/CategoryChannel.js';
import { DMChannel } from '../structures/DMChannel.js';
import { ForumChannel } from '../structures/ForumChannel.js';
import { GroupDMChannel } from '../structures/GroupDMChannel.js';
import { MediaChannel } from '../structures/MediaChannel.js';
import { PrivateThreadChannel } from '../structures/PrivateThreadChannel.js';
import { PublicThreadChannel } from '../structures/PublicThreadChannel.js';
import { StageChannel } from '../structures/StageChannel.js';
import { TextChannel } from '../structures/TextChannel.js';
import { VoiceChannel } from '../structures/VoiceChannel.js';
import { CachedManager } from './CachedManager.js';

export type Channel =
	| AnnouncementChannel
	| AnnouncementThreadChannel
	| BaseChannel
	| CategoryChannel
	| DMChannel
	| ForumChannel
	| GroupDMChannel
	| MediaChannel
	| PrivateThreadChannel
	| PublicThreadChannel
	| StageChannel
	| TextChannel
	| VoiceChannel;

export class ChannelManager extends CachedManager<Channel> {
	public constructor(data: APIChannel[], client: Client) {
		super(client, 'channel');

		for (const channel of data) {
			this.cache.set(channel.id, this.createStructure(channel));
		}
	}

	protected override createStructure(data: APIChannel): Channel {
		switch (data.type) {
			case ChannelType.AnnouncementThread:
				return new AnnouncementThreadChannel(data);
			case ChannelType.DM:
				return new DMChannel(data);
			case ChannelType.GroupDM:
				return new GroupDMChannel(data);
			case ChannelType.GuildAnnouncement:
				return new AnnouncementChannel(data);
			case ChannelType.GuildCategory:
				return new CategoryChannel(data);
			case ChannelType.GuildForum:
				return new ForumChannel(data);
			case ChannelType.GuildMedia:
				return new MediaChannel(data);
			case ChannelType.GuildStageVoice:
				return new StageChannel(data);
			case ChannelType.GuildText:
				return new TextChannel(data);
			case ChannelType.GuildVoice:
				return new VoiceChannel(data);
			case ChannelType.PrivateThread:
				return new PrivateThreadChannel(data);
			case ChannelType.PublicThread:
				return new PublicThreadChannel(data);
			default:
				return new BaseChannel(data);
		}
	}
}
