import type { ChannelType, GuildChannelType, GuildTextChannelType, ThreadChannelType } from 'discord-api-types/v10';
import { expectNever, expectType } from 'tsd';
import type { Channel } from '../../src/index.js';

declare const channel: Channel;

if (channel.isGuildBased()) {
	expectType<string>(channel.guildId);
	expectType<GuildChannelType>(channel.type);

	if (channel.isDMBased()) {
		expectNever(channel);
	}

	if (channel.isPermissionCapable()) {
		expectType<Exclude<GuildChannelType, ChannelType.GuildDirectory | ThreadChannelType>>(channel.type);
	}

	if (channel.isTextBased()) {
		expectType<GuildTextChannelType>(channel.type);
	}

	if (channel.isWebhookCapable()) {
		expectType<ChannelType.GuildForum | ChannelType.GuildMedia | Exclude<GuildTextChannelType, ThreadChannelType>>(
			channel.type,
		);
	}

	if (channel.isThread()) {
		expectType<ThreadChannelType>(channel.type);
	}

	if (channel.isThreadOnly()) {
		expectType<ChannelType.GuildForum | ChannelType.GuildMedia>(channel.type);
	}

	if (channel.isVoiceBased()) {
		expectType<ChannelType.GuildStageVoice | ChannelType.GuildVoice>(channel.type);
		if (!channel.isTextBased()) {
			expectNever(channel);
		}

		if (!channel.isWebhookCapable()) {
			expectNever(channel);
		}
	}
}

if (channel.isDMBased()) {
	expectType<ChannelType.DM | ChannelType.GroupDM>(channel.type);

	if (channel.isGuildBased()) {
		expectNever(channel);
	}

	if (channel.isPermissionCapable()) {
		expectNever(channel);
	}

	if (channel.isWebhookCapable()) {
		expectNever(channel);
	}

	if (channel.isVoiceBased()) {
		expectNever(channel);
	}

	if (channel.isThread()) {
		expectNever(channel);
	}

	if (channel.isThreadOnly()) {
		expectNever(channel);
	}

	if (channel.isTextBased()) {
		expectType<ChannelType.DM | ChannelType.GroupDM>(channel.type);
	}
}
