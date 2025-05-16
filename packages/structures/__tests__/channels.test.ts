import type { APIDMChannel, APIGuildCategoryChannel, APINewsChannel, APITextChannel } from 'discord-api-types/v10';
import { ChannelType, OverwriteType, ThreadAutoArchiveDuration } from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { AnnouncementChannel, CategoryChannel, DMChannel, TextChannel } from '../src';

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
});
