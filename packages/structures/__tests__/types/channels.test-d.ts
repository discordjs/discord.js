import type { ChannelType, GuildChannelType, GuildTextChannelType, ThreadChannelType } from 'discord-api-types/v10';
import { expectTypeOf } from 'vitest';
import type { Channel } from '../../src/channels/Channel.js';

declare const channel: Channel;

if (channel.isGuildBased()) {
	expectTypeOf(channel.guildId).toBeString();
	expectTypeOf(channel.type).toEqualTypeOf<GuildChannelType>();

	if (channel.isDMBased()) {
		expectTypeOf(channel).toBeNever();
	}

	if (channel.isPermissionCapable()) {
		expectTypeOf(channel.type).toEqualTypeOf<
			Exclude<GuildChannelType, ChannelType.GuildDirectory | ThreadChannelType>
		>();
	}

	if (channel.isTextBased()) {
		expectTypeOf(channel.type).toEqualTypeOf<GuildTextChannelType>();
	}

	if (channel.isWebhookCapable()) {
		expectTypeOf(channel.type).toEqualTypeOf<
			ChannelType.GuildForum | ChannelType.GuildMedia | Exclude<GuildTextChannelType, ThreadChannelType>
		>();
	}

	if (channel.isThread()) {
		expectTypeOf(channel.type).toEqualTypeOf<ThreadChannelType>();
	}

	if (channel.isThreadOnly()) {
		expectTypeOf(channel.type).toEqualTypeOf<ChannelType.GuildForum | ChannelType.GuildMedia>();
	}

	if (channel.isVoiceBased()) {
		expectTypeOf(channel.type).toEqualTypeOf<ChannelType.GuildStageVoice | ChannelType.GuildVoice>();
		if (!channel.isTextBased()) {
			expectTypeOf(channel).toBeNever();
		}

		if (!channel.isWebhookCapable()) {
			expectTypeOf(channel).toBeNever();
		}
	}
}

if (channel.isDMBased()) {
	expectTypeOf(channel.type).toEqualTypeOf<ChannelType.DM | ChannelType.GroupDM>();

	if (channel.isGuildBased()) {
		expectTypeOf(channel).toBeNever();
	}

	if (channel.isPermissionCapable()) {
		expectTypeOf(channel).toBeNever();
	}

	if (channel.isWebhookCapable()) {
		expectTypeOf(channel).toBeNever();
	}

	if (channel.isVoiceBased()) {
		expectTypeOf(channel).toBeNever();
	}

	if (channel.isThread()) {
		expectTypeOf(channel).toBeNever();
	}

	if (channel.isThreadOnly()) {
		expectTypeOf(channel).toBeNever();
	}

	if (channel.isTextBased()) {
		expectTypeOf(channel.type).toEqualTypeOf<ChannelType.DM | ChannelType.GroupDM>();
	}
}
