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
	AnnouncementThreadChannel,
	CategoryChannel,
	DMChannel,
	ForumChannel,
	GroupDMChannel,
	MediaChannel,
	PrivateThreadChannel,
	StageChannel,
	TextChannel,
	VoiceChannel,
} from '../src';
import { PublicThreadChannel } from '../src/channels/PublicThreadChannel';
import { kData } from '../src/utils/symbols';

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
		expect(instance.permissionOverwrites?.[0]?.allow?.toString()).toBe(data.permission_overwrites?.[0]?.allow);
		expect(instance.permissionOverwrites?.[0]?.deny?.toString()).toBe(data.permission_overwrites?.[0]?.deny);
		expect(instance.permissionOverwrites?.[0]?.id).toBe(data.permission_overwrites?.[0]?.id);
		expect(instance.permissionOverwrites?.[0]?.type).toBe(data.permission_overwrites?.[0]?.type);
		expect(instance.rateLimitPerUser).toBe(data.rate_limit_per_user);
		expect(instance.topic).toBe(data.topic);
		expect(instance.type).toBe(ChannelType.GuildText);
		expect(instance.url).toBe('https://discord.com/channels/2/1');
		expect(instance.toJSON()).toEqual(data);
		console.log(instance[kData]);
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
		expect(instance.isWebhookCapable()).toBe(true);
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
		last_pin_timestamp: null,
		nsfw: true,
		parent_id: '4',
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
		expect(instance.lastPinTimestamp).toBe(null);
		expect(instance.lastPinAt).toBe(data.last_pin_timestamp);
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
		expect(instance.isWebhookCapable()).toBe(true);
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
		expect(instance.isWebhookCapable()).toBe(false);
	});
});

describe('DM channel', () => {
	const dataNoRecipients: APIDMChannel = {
		id: '1',
		type: ChannelType.DM,
		last_message_id: '3',
		last_pin_timestamp: '2020-10-10T13:50:17.209Z',
		name: null,
	};

	const data = {
		...dataNoRecipients,
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

	test('DMChannel with no recipients', () => {
		const instance = new DMChannel(dataNoRecipients);
		expect(instance.recipients?.map((recipient) => recipient.toJSON())).toEqual(dataNoRecipients.recipients);
		expect(instance.toJSON()).toEqual(dataNoRecipients);
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
		expect(instance.isWebhookCapable()).toBe(false);
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
		expect(instance.icon).toBe(data.icon);
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
		expect(instance.isWebhookCapable()).toBe(false);
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
		expect(instance.availableTags.map((tag) => tag.toJSON())).toEqual(data.available_tags);
		expect(instance.availableTags[0]?.id).toBe(data.available_tags[0]?.id);
		expect(instance.availableTags[0]?.emojiId).toBe(data.available_tags[0]?.emoji_id);
		expect(instance.availableTags[0]?.emojiName).toBe(data.available_tags[0]?.emoji_name);
		expect(instance.availableTags[0]?.name).toBe(data.available_tags[0]?.name);
		expect(instance.availableTags[0]?.moderated).toBe(data.available_tags[0]?.moderated);
		expect(instance.availableTags[0]?.emoji).toBe(data.available_tags[0]?.emoji_name);
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
		expect(instance.isWebhookCapable()).toBe(true);
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
				emoji_name: null,
				moderated: false,
				id: '789',
				emoji_id: '444',
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
		expect(instance.availableTags.map((tag) => tag.toJSON())).toEqual(data.available_tags);
		expect(instance.availableTags[0]?.emoji).toBe(`<:_:${data.available_tags[0]?.emoji_id}>`);
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
		expect(instance.isWebhookCapable()).toBe(true);
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
		expect(instance.userLimit).toBe(data.user_limit);
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
		expect(instance.isWebhookCapable()).toBe(true);
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
		expect(instance.isWebhookCapable()).toBe(true);
	});
});

describe('thread channels', () => {
	// TODO: remove special handling once dtypes PR for thread channel types releases
	const dataPublic: Omit<APIThreadChannel, 'position'> = {
		id: '1',
		name: 'test',
		type: ChannelType.PublicThread,
		guild_id: '2',
		last_message_id: '3',
		nsfw: true,
		parent_id: '4',
		rate_limit_per_user: 9,
		applied_tags: ['567'],
		thread_metadata: {
			archive_timestamp: '2024-09-08T12:01:02.345Z',
			archived: false,
			auto_archive_duration: ThreadAutoArchiveDuration.ThreeDays,
			locked: true,
			create_timestamp: '2023-01-02T15:13:11.987Z',
			invitable: true,
		},
	};

	const dataPrivate: Omit<APIThreadChannel, 'position'> = {
		...dataPublic,
		type: ChannelType.PrivateThread,
	};

	const dataAnnounce: Omit<APIThreadChannel, 'position'> = {
		...dataPublic,
		type: ChannelType.AnnouncementThread,
	};

	test('PublicThreadChannel has all properties', () => {
		const instance = new PublicThreadChannel(dataPublic);
		expect(instance.id).toBe(dataPublic.id);
		expect(instance.name).toBe(dataPublic.name);
		expect(instance.flags).toBe(dataPublic.flags);
		expect(instance.guildId).toBe(dataPublic.guild_id);
		expect(instance.lastMessageId).toBe(dataPublic.last_message_id);
		expect(instance.nsfw).toBe(dataPublic.nsfw);
		expect(instance.parentId).toBe(dataPublic.parent_id);
		expect(instance.rateLimitPerUser).toBe(dataPublic.rate_limit_per_user);
		expect(instance.type).toBe(ChannelType.PublicThread);
		expect(instance.appliedTags).toEqual(dataPublic.applied_tags);
		expect(instance.threadMetadata?.toJSON()).toEqual(dataAnnounce.thread_metadata);
		expect(instance.url).toBe('https://discord.com/channels/2/1');
		expect(instance.toJSON()).toEqual(dataPublic);
	});

	test('typeguards PublicThread', () => {
		const instance = new PublicThreadChannel(dataPublic);
		expect(instance.isDMBased()).toBe(false);
		expect(instance.isGuildBased()).toBe(true);
		expect(instance.isPermissionCapabale()).toBe(false);
		expect(instance.isTextBased()).toBe(true);
		expect(instance.isThread()).toBe(true);
		expect(instance.isThreadOnly()).toBe(false);
		expect(instance.isVoiceBased()).toBe(false);
		expect(instance.isWebhookCapable()).toBe(false);
	});

	test('PrivateThreadChannel has all properties', () => {
		const instance = new PrivateThreadChannel(dataPrivate);
		expect(instance.id).toBe(dataPrivate.id);
		expect(instance.name).toBe(dataPrivate.name);
		expect(instance.flags).toBe(dataPrivate.flags);
		expect(instance.guildId).toBe(dataPrivate.guild_id);
		expect(instance.lastMessageId).toBe(dataPrivate.last_message_id);
		expect(instance.nsfw).toBe(dataPrivate.nsfw);
		expect(instance.parentId).toBe(dataPrivate.parent_id);
		expect(instance.rateLimitPerUser).toBe(dataPrivate.rate_limit_per_user);
		expect(instance.type).toBe(ChannelType.PrivateThread);
		expect(instance.url).toBe('https://discord.com/channels/2/1');
		expect(instance.toJSON()).toEqual(dataPrivate);
	});

	test('typeguards PrivateThread', () => {
		const instance = new PrivateThreadChannel(dataPrivate);
		expect(instance.isDMBased()).toBe(false);
		expect(instance.isGuildBased()).toBe(true);
		expect(instance.isPermissionCapabale()).toBe(false);
		expect(instance.isTextBased()).toBe(true);
		expect(instance.isThread()).toBe(true);
		expect(instance.isThreadOnly()).toBe(false);
		expect(instance.isVoiceBased()).toBe(false);
		expect(instance.isWebhookCapable()).toBe(false);
	});

	test('AnnouncementThreadChannel has all properties', () => {
		const instance = new AnnouncementThreadChannel(dataAnnounce);
		expect(instance.id).toBe(dataAnnounce.id);
		expect(instance.name).toBe(dataAnnounce.name);
		expect(instance.flags).toBe(dataAnnounce.flags);
		expect(instance.guildId).toBe(dataAnnounce.guild_id);
		expect(instance.lastMessageId).toBe(dataAnnounce.last_message_id);
		expect(instance.nsfw).toBe(dataAnnounce.nsfw);
		expect(instance.parentId).toBe(dataAnnounce.parent_id);
		expect(instance.rateLimitPerUser).toBe(dataAnnounce.rate_limit_per_user);
		expect(instance.type).toBe(ChannelType.AnnouncementThread);
		expect(instance.url).toBe('https://discord.com/channels/2/1');
		expect(instance.toJSON()).toEqual(dataAnnounce);
	});

	test('typeguards AnnouncementThread', () => {
		const instance = new AnnouncementThreadChannel(dataAnnounce);
		expect(instance.isDMBased()).toBe(false);
		expect(instance.isGuildBased()).toBe(true);
		expect(instance.isPermissionCapabale()).toBe(false);
		expect(instance.isTextBased()).toBe(true);
		expect(instance.isThread()).toBe(true);
		expect(instance.isThreadOnly()).toBe(false);
		expect(instance.isVoiceBased()).toBe(false);
		expect(instance.isWebhookCapable()).toBe(false);
	});
});
