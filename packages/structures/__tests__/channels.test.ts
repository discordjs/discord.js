import type {
	APIDMChannel,
	APIGroupDMChannel,
	APIGuildCategoryChannel,
	APIGuildForumChannel,
	APIGuildMediaChannel,
	APIGuildStageVoiceChannel,
	APIGuildVoiceChannel,
	APINewsChannel,
	APITextChannel,
	APIThreadChannel,
} from 'discord-api-types/v10';
import {
	ForumLayoutType,
	SortOrderType,
	ChannelType,
	OverwriteType,
	ThreadAutoArchiveDuration,
	VideoQualityMode,
} from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import {
	AnnouncementChannel,
	CategoryChannel,
	DMChannel,
	ForumChannel,
	GroupDMChannel,
	MediaChannel,
	StageChannel,
	TextChannel,
	VoiceChannel,
} from '../src';
import { PublicThreadChannel } from '../src/channels/PublicThreadChannel';

describe('text channel', () => {
	const data: APITextChannel = {
		id: '1',
		name: 'test',
		type: ChannelType.GuildText,
		position: 0,
		guild_id: '2',
		last_message_id: '3',
		last_pin_timestamp: '2020-10-10T13:50:17.209Z',
		nsfw: true,
		parent_id: '4',
		permission_overwrites: [
			{
				allow: '123',
				deny: '456',
				type: OverwriteType.Member,
				id: '5',
			},
		],
		rate_limit_per_user: 9,
		topic: 'hello',
		default_auto_archive_duration: ThreadAutoArchiveDuration.OneHour,
		default_thread_rate_limit_per_user: 30,
	};

	test('TextChannel has all properties', () => {
		const instance = new TextChannel(data);
		expect(instance.id).toBe(data.id);
		expect(instance.name).toBe(data.name);
		expect(instance.position).toBe(data.position);
		expect(instance.defaultAutoArchiveDuration).toBe(data.default_auto_archive_duration);
		expect(instance.defaultThreadRateLimitPerUser).toBe(data.default_thread_rate_limit_per_user);
		expect(instance.flags).toBe(data.flags);
		expect(instance.guildId).toBe(data.guild_id);
		expect(instance.lastMessageId).toBe(data.last_message_id);
		expect(instance.lastPinTimestamp).toBe(Date.parse(data.last_pin_timestamp!));
		expect(instance.lastPinAt?.toISOString()).toBe(data.last_pin_timestamp);
		expect(instance.nsfw).toBe(data.nsfw);
		expect(instance.parentId).toBe(data.parent_id);
		expect(instance.permissionOverwrites?.map((overwrite) => overwrite.toJSON())).toEqual(data.permission_overwrites);
		expect(instance.rateLimitPerUser).toBe(data.rate_limit_per_user);
		expect(instance.topic).toBe(data.topic);
		expect(instance.type).toBe(ChannelType.GuildText);
		expect(instance.url).toBe('https://discord.com/channels/2/1');
		expect(instance.toJSON()).toEqual(data);
	});

	test('typeguards', () => {
		const instance = new TextChannel(data);
		expect(instance.isDMBased()).toBe(false);
		expect(instance.isGuildBased()).toBe(true);
		expect(instance.isPermissionCapabale()).toBe(true);
		expect(instance.isTextBased()).toBe(true);
		expect(instance.isThread()).toBe(false);
		expect(instance.isThreadOnly()).toBe(false);
		expect(instance.isVoiceBased()).toBe(false);
	});
});

describe('announcement channel', () => {
	const data: APINewsChannel = {
		id: '1',
		name: 'test',
		type: ChannelType.GuildAnnouncement,
		position: 0,
		guild_id: '2',
		last_message_id: '3',
		last_pin_timestamp: '2020-10-10T13:50:17.209Z',
		nsfw: true,
		parent_id: '4',
		permission_overwrites: [
			{
				allow: '123',
				deny: '456',
				type: OverwriteType.Member,
				id: '5',
			},
		],
		rate_limit_per_user: 9,
		topic: 'hello',
		default_auto_archive_duration: ThreadAutoArchiveDuration.OneHour,
		default_thread_rate_limit_per_user: 30,
	};

	test('AnnouncementChannel has all properties', () => {
		const instance = new AnnouncementChannel(data);
		expect(instance.id).toBe(data.id);
		expect(instance.name).toBe(data.name);
		expect(instance.position).toBe(data.position);
		expect(instance.defaultAutoArchiveDuration).toBe(data.default_auto_archive_duration);
		expect(instance.defaultThreadRateLimitPerUser).toBe(data.default_thread_rate_limit_per_user);
		expect(instance.flags).toBe(data.flags);
		expect(instance.guildId).toBe(data.guild_id);
		expect(instance.lastMessageId).toBe(data.last_message_id);
		expect(instance.lastPinTimestamp).toBe(Date.parse(data.last_pin_timestamp!));
		expect(instance.lastPinAt?.toISOString()).toBe(data.last_pin_timestamp);
		expect(instance.nsfw).toBe(data.nsfw);
		expect(instance.parentId).toBe(data.parent_id);
		expect(instance.permissionOverwrites?.map((overwrite) => overwrite.toJSON())).toEqual(data.permission_overwrites);
		expect(instance.rateLimitPerUser).toBe(data.rate_limit_per_user);
		expect(instance.topic).toBe(data.topic);
		expect(instance.type).toBe(ChannelType.GuildAnnouncement);
		expect(instance.url).toBe('https://discord.com/channels/2/1');
		expect(instance.toJSON()).toEqual(data);
	});

	test('typeguards', () => {
		const instance = new AnnouncementChannel(data);
		expect(instance.isDMBased()).toBe(false);
		expect(instance.isGuildBased()).toBe(true);
		expect(instance.isPermissionCapabale()).toBe(true);
		expect(instance.isTextBased()).toBe(true);
		expect(instance.isThread()).toBe(false);
		expect(instance.isThreadOnly()).toBe(false);
		expect(instance.isVoiceBased()).toBe(false);
	});
});

describe('category channel', () => {
	const data: APIGuildCategoryChannel = {
		id: '1',
		name: 'test',
		type: ChannelType.GuildCategory,
		position: 0,
		guild_id: '2',
		permission_overwrites: [
			{
				allow: '123',
				deny: '456',
				type: OverwriteType.Member,
				id: '5',
			},
		],
	};

	test('CategoryChannel has all properties', () => {
		const instance = new CategoryChannel(data);
		expect(instance.id).toBe(data.id);
		expect(instance.name).toBe(data.name);
		expect(instance.position).toBe(data.position);
		expect(instance.flags).toBe(data.flags);
		expect(instance.guildId).toBe(data.guild_id);
		expect(instance.permissionOverwrites?.map((overwrite) => overwrite.toJSON())).toEqual(data.permission_overwrites);
		expect(instance.type).toBe(ChannelType.GuildCategory);
		expect(instance.url).toBe('https://discord.com/channels/2/1');
		expect(instance.toJSON()).toEqual(data);
	});

	test('typeguards', () => {
		const instance = new CategoryChannel(data);
		expect(instance.isDMBased()).toBe(false);
		expect(instance.isGuildBased()).toBe(true);
		expect(instance.isPermissionCapabale()).toBe(true);
		expect(instance.isTextBased()).toBe(false);
		expect(instance.isThread()).toBe(false);
		expect(instance.isThreadOnly()).toBe(false);
		expect(instance.isVoiceBased()).toBe(false);
	});
});

describe('DM channel', () => {
	const data: APIDMChannel = {
		id: '1',
		type: ChannelType.DM,
		last_message_id: '3',
		last_pin_timestamp: '2020-10-10T13:50:17.209Z',
		name: null,
		recipients: [
			{
				avatar: '123',
				discriminator: '0',
				global_name: 'tester',
				id: '1',
				username: 'test',
			},
		],
	};

	test('DMChannel has all properties', () => {
		const instance = new DMChannel(data);
		expect(instance.id).toBe(data.id);
		expect(instance.name).toBe(data.name);
		expect(instance.flags).toBe(data.flags);
		expect(instance.lastMessageId).toBe(data.last_message_id);
		expect(instance.lastPinTimestamp).toBe(Date.parse(data.last_pin_timestamp!));
		expect(instance.lastPinAt?.toISOString()).toBe(data.last_pin_timestamp);
		expect(instance.recipients?.map((recipient) => recipient.toJSON())).toEqual(data.recipients);
		expect(instance.type).toBe(ChannelType.DM);
		expect(instance.url).toBe('https://discord.com/channels/@me/1');
		expect(instance.toJSON()).toEqual(data);
	});

	test('typeguards', () => {
		const instance = new DMChannel(data);
		expect(instance.isDMBased()).toBe(true);
		expect(instance.isGuildBased()).toBe(false);
		expect(instance.isPermissionCapabale()).toBe(false);
		expect(instance.isTextBased()).toBe(true);
		expect(instance.isThread()).toBe(false);
		expect(instance.isThreadOnly()).toBe(false);
		expect(instance.isVoiceBased()).toBe(false);
	});
});

describe('GroupDM channel', () => {
	const data: APIGroupDMChannel = {
		id: '1',
		type: ChannelType.GroupDM,
		last_message_id: '3',
		name: 'name',
		recipients: [
			{
				avatar: '123',
				discriminator: '0',
				global_name: 'tester',
				id: '1',
				username: 'test',
			},
		],
		application_id: '34',
		icon: 'abc',
		managed: true,
		owner_id: '567',
	};

	test('GroupDMChannel has all properties', () => {
		const instance = new GroupDMChannel(data);
		expect(instance.id).toBe(data.id);
		expect(instance.name).toBe(data.name);
		expect(instance.flags).toBe(data.flags);
		expect(instance.lastMessageId).toBe(data.last_message_id);
		expect(instance.recipients?.map((recipient) => recipient.toJSON())).toEqual(data.recipients);
		expect(instance.applicationId).toBe(data.application_id);
		expect(instance.managed).toBe(data.managed);
		expect(instance.ownerId).toBe(data.owner_id);
		expect(instance.type).toBe(ChannelType.GroupDM);
		expect(instance.url).toBe('https://discord.com/channels/@me/1');
		expect(instance.toJSON()).toEqual(data);
	});

	test('typeguards', () => {
		const instance = new GroupDMChannel(data);
		expect(instance.isDMBased()).toBe(true);
		expect(instance.isGuildBased()).toBe(false);
		expect(instance.isPermissionCapabale()).toBe(false);
		expect(instance.isTextBased()).toBe(true);
		expect(instance.isThread()).toBe(false);
		expect(instance.isThreadOnly()).toBe(false);
		expect(instance.isVoiceBased()).toBe(false);
	});
});

describe('forum channel', () => {
	const data: APIGuildForumChannel = {
		id: '1',
		name: 'test',
		type: ChannelType.GuildForum,
		position: 0,
		guild_id: '2',
		nsfw: true,
		parent_id: '4',
		permission_overwrites: [
			{
				allow: '123',
				deny: '456',
				type: OverwriteType.Member,
				id: '5',
			},
		],
		topic: 'hello',
		default_auto_archive_duration: ThreadAutoArchiveDuration.OneHour,
		default_thread_rate_limit_per_user: 30,
		available_tags: [
			{
				name: 'emoji',
				emoji_name: '😀',
				moderated: false,
				id: '789',
				emoji_id: null,
			},
		],
		default_forum_layout: ForumLayoutType.GalleryView,
		default_reaction_emoji: {
			emoji_id: '159',
			emoji_name: null,
		},
		default_sort_order: SortOrderType.LatestActivity,
	};

	test('ForumChannel has all properties', () => {
		const instance = new ForumChannel(data);
		expect(instance.id).toBe(data.id);
		expect(instance.name).toBe(data.name);
		expect(instance.position).toBe(data.position);
		expect(instance.defaultAutoArchiveDuration).toBe(data.default_auto_archive_duration);
		expect(instance.defaultThreadRateLimitPerUser).toBe(data.default_thread_rate_limit_per_user);
		expect(instance.flags).toBe(data.flags);
		expect(instance.guildId).toBe(data.guild_id);
		expect(instance.nsfw).toBe(data.nsfw);
		expect(instance.parentId).toBe(data.parent_id);
		expect(instance.permissionOverwrites?.map((overwrite) => overwrite.toJSON())).toEqual(data.permission_overwrites);
		expect(instance.defaultForumLayout).toBe(data.default_forum_layout);
		expect(instance.topic).toBe(data.topic);
		expect(instance.type).toBe(ChannelType.GuildForum);
		expect(instance.url).toBe('https://discord.com/channels/2/1');
		expect(instance.toJSON()).toEqual(data);
	});

	test('typeguards', () => {
		const instance = new ForumChannel(data);
		expect(instance.isDMBased()).toBe(false);
		expect(instance.isGuildBased()).toBe(true);
		expect(instance.isPermissionCapabale()).toBe(true);
		expect(instance.isTextBased()).toBe(false);
		expect(instance.isThread()).toBe(false);
		expect(instance.isThreadOnly()).toBe(true);
		expect(instance.isVoiceBased()).toBe(false);
	});
});

describe('media channel', () => {
	const data: APIGuildMediaChannel = {
		id: '1',
		name: 'test',
		type: ChannelType.GuildMedia,
		position: 0,
		guild_id: '2',
		nsfw: true,
		parent_id: '4',
		permission_overwrites: [
			{
				allow: '123',
				deny: '456',
				type: OverwriteType.Member,
				id: '5',
			},
		],
		topic: 'hello',
		default_auto_archive_duration: ThreadAutoArchiveDuration.OneHour,
		default_thread_rate_limit_per_user: 30,
		available_tags: [
			{
				name: 'emoji',
				emoji_name: '😀',
				moderated: false,
				id: '789',
				emoji_id: null,
			},
		],
		default_reaction_emoji: {
			emoji_id: '159',
			emoji_name: null,
		},
		default_sort_order: SortOrderType.LatestActivity,
	};

	test('MediaChannel has all properties', () => {
		const instance = new MediaChannel(data);
		expect(instance.id).toBe(data.id);
		expect(instance.name).toBe(data.name);
		expect(instance.position).toBe(data.position);
		expect(instance.defaultAutoArchiveDuration).toBe(data.default_auto_archive_duration);
		expect(instance.defaultThreadRateLimitPerUser).toBe(data.default_thread_rate_limit_per_user);
		expect(instance.flags).toBe(data.flags);
		expect(instance.guildId).toBe(data.guild_id);
		expect(instance.nsfw).toBe(data.nsfw);
		expect(instance.parentId).toBe(data.parent_id);
		expect(instance.permissionOverwrites?.map((overwrite) => overwrite.toJSON())).toEqual(data.permission_overwrites);
		expect(instance.topic).toBe(data.topic);
		expect(instance.type).toBe(ChannelType.GuildMedia);
		expect(instance.url).toBe('https://discord.com/channels/2/1');
		expect(instance.toJSON()).toEqual(data);
	});

	test('typeguards', () => {
		const instance = new MediaChannel(data);
		expect(instance.isDMBased()).toBe(false);
		expect(instance.isGuildBased()).toBe(true);
		expect(instance.isPermissionCapabale()).toBe(true);
		expect(instance.isTextBased()).toBe(false);
		expect(instance.isThread()).toBe(false);
		expect(instance.isThreadOnly()).toBe(true);
		expect(instance.isVoiceBased()).toBe(false);
	});
});

describe('voice channel', () => {
	const data: APIGuildVoiceChannel = {
		id: '1',
		name: 'test',
		type: ChannelType.GuildVoice,
		position: 0,
		guild_id: '2',
		last_message_id: '3',
		nsfw: true,
		parent_id: '4',
		permission_overwrites: [
			{
				allow: '123',
				deny: '456',
				type: OverwriteType.Member,
				id: '5',
			},
		],
		rate_limit_per_user: 9,
		bitrate: 7,
		rtc_region: 'somewhere',
		user_limit: 100,
		video_quality_mode: VideoQualityMode.Full,
	};

	test('VoiceChannel has all properties', () => {
		const instance = new VoiceChannel(data);
		expect(instance.id).toBe(data.id);
		expect(instance.name).toBe(data.name);
		expect(instance.position).toBe(data.position);
		expect(instance.bitrate).toBe(data.bitrate);
		expect(instance.rtcRegion).toBe(data.rtc_region);
		expect(instance.flags).toBe(data.flags);
		expect(instance.guildId).toBe(data.guild_id);
		expect(instance.lastMessageId).toBe(data.last_message_id);
		expect(instance.videoQualityMode).toBe(data.video_quality_mode);
		expect(instance.nsfw).toBe(data.nsfw);
		expect(instance.parentId).toBe(data.parent_id);
		expect(instance.permissionOverwrites?.map((overwrite) => overwrite.toJSON())).toEqual(data.permission_overwrites);
		expect(instance.rateLimitPerUser).toBe(data.rate_limit_per_user);
		expect(instance.type).toBe(ChannelType.GuildVoice);
		expect(instance.url).toBe('https://discord.com/channels/2/1');
		expect(instance.toJSON()).toEqual(data);
	});

	test('typeguards', () => {
		const instance = new VoiceChannel(data);
		expect(instance.isDMBased()).toBe(false);
		expect(instance.isGuildBased()).toBe(true);
		expect(instance.isPermissionCapabale()).toBe(true);
		expect(instance.isTextBased()).toBe(true);
		expect(instance.isThread()).toBe(false);
		expect(instance.isThreadOnly()).toBe(false);
		expect(instance.isVoiceBased()).toBe(true);
	});
});

describe('stage channel', () => {
	const data: APIGuildStageVoiceChannel = {
		id: '1',
		name: 'test',
		type: ChannelType.GuildStageVoice,
		position: 0,
		guild_id: '2',
		last_message_id: '3',
		nsfw: true,
		parent_id: '4',
		permission_overwrites: [
			{
				allow: '123',
				deny: '456',
				type: OverwriteType.Member,
				id: '5',
			},
		],
		rate_limit_per_user: 9,
		bitrate: 7,
		rtc_region: 'somewhere',
		user_limit: 100,
		video_quality_mode: VideoQualityMode.Full,
	};

	test('StageChannel has all properties', () => {
		const instance = new StageChannel(data);
		expect(instance.id).toBe(data.id);
		expect(instance.name).toBe(data.name);
		expect(instance.position).toBe(data.position);
		expect(instance.bitrate).toBe(data.bitrate);
		expect(instance.rtcRegion).toBe(data.rtc_region);
		expect(instance.flags).toBe(data.flags);
		expect(instance.guildId).toBe(data.guild_id);
		expect(instance.lastMessageId).toBe(data.last_message_id);
		expect(instance.videoQualityMode).toBe(data.video_quality_mode);
		expect(instance.nsfw).toBe(data.nsfw);
		expect(instance.parentId).toBe(data.parent_id);
		expect(instance.permissionOverwrites?.map((overwrite) => overwrite.toJSON())).toEqual(data.permission_overwrites);
		expect(instance.rateLimitPerUser).toBe(data.rate_limit_per_user);
		expect(instance.type).toBe(ChannelType.GuildStageVoice);
		expect(instance.url).toBe('https://discord.com/channels/2/1');
		expect(instance.toJSON()).toEqual(data);
	});

	test('typeguards', () => {
		const instance = new StageChannel(data);
		expect(instance.isDMBased()).toBe(false);
		expect(instance.isGuildBased()).toBe(true);
		expect(instance.isPermissionCapabale()).toBe(true);
		expect(instance.isTextBased()).toBe(true);
		expect(instance.isThread()).toBe(false);
		expect(instance.isThreadOnly()).toBe(false);
		expect(instance.isVoiceBased()).toBe(true);
	});
});

describe('thread channels', () => {
	const data: APIThreadChannel = {
		id: '1',
		name: 'test',
		type: ChannelType.PublicThread,
		guild_id: '2',
		last_message_id: '3',
		nsfw: true,
		parent_id: '4',
		rate_limit_per_user: 9,
		applied_tags: ['567'],
	};

	test('PublicThreadChannel has all properties', () => {
		const instance = new PublicThreadChannel(data);
		expect(instance.id).toBe(data.id);
		expect(instance.name).toBe(data.name);
		expect(instance.flags).toBe(data.flags);
		expect(instance.guildId).toBe(data.guild_id);
		expect(instance.lastMessageId).toBe(data.last_message_id);
		expect(instance.nsfw).toBe(data.nsfw);
		expect(instance.parentId).toBe(data.parent_id);
		expect(instance.rateLimitPerUser).toBe(data.rate_limit_per_user);
		expect(instance.type).toBe(ChannelType.PublicThread);
		expect(instance.url).toBe('https://discord.com/channels/2/1');
		expect(instance.toJSON()).toEqual(data);
	});

	test('typeguards', () => {
		const instance = new PublicThreadChannel(data);
		expect(instance.isDMBased()).toBe(false);
		expect(instance.isGuildBased()).toBe(true);
		expect(instance.isPermissionCapabale()).toBe(true);
		expect(instance.isTextBased()).toBe(true);
		expect(instance.isThread()).toBe(false);
		expect(instance.isThreadOnly()).toBe(false);
		expect(instance.isVoiceBased()).toBe(true);
	});
});
