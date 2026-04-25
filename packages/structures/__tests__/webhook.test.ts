import { DiscordSnowflake } from '@sapphire/snowflake';
import { WebhookType, type APIWebhook } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { Webhook } from '../src/index.js';
import { kPatch } from '../src/utils/symbols.js';

const data: APIWebhook = {
	id: '1252435243636',
	type: WebhookType.Incoming,
	guild_id: '222078108977594368',
	channel_id: '1469634725910941891',
	name: 'My Application',
	avatar: 'djs://webhook-avatar',
	application_id: '222078108977594368',
	url: 'https://discord.js.org/',
};

const instance = new Webhook(data);

describe('Webhook structure', () => {
	test('correct value for all getters', () => {
		expect(instance.id).toBe(data.id);
		expect(instance.type).toBe(data.type);
		expect(instance.guildId).toBe(data.guild_id);
		expect(instance.channelId).toBe(data.channel_id);
		expect(instance.name).toBe(data.name);
		expect(instance.avatar).toBe(data.avatar);
		expect(instance.applicationId).toBe(data.application_id);
		expect(instance.url).toBe(data.url);

		expect(instance.createdTimestamp).toBe(DiscordSnowflake.timestampFrom(instance.id!));
		expect(instance.createdAt).toEqual(new Date(instance.createdTimestamp!));
	});

	test('toJSON() returns expected values', () => {
		expect(instance.toJSON()).toStrictEqual(data);
	});

	test('patching the data works in place', () => {
		const channelId = '222086648706498562';
		const token = 'wkfmweqoifjio?EGWERGWTR453645643wreEWFre__';

		const patched = instance[kPatch]({
			channel_id: channelId,
			token,
		});

		expect(patched.token).toEqual(token);
		expect(patched.channelId).toEqual(channelId);

		expect(patched.toJSON()).not.toEqual(data);
		expect(patched).toBe(instance);
	});
});
