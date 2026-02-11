import { DiscordSnowflake } from '@sapphire/snowflake';
import { WebhookType, type APIWebhook } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { Webhook } from '../src/index.js';
import { kPatch } from '../src/utils/symbols.js';

const data: APIWebhook = {
	id: '1',
	type: WebhookType.Incoming,
	guild_id: 'djs://webhook-guild-id',
	channel_id: 'djs://webhook-channel-id',
	name: 'djs://webhook-name',
	avatar: 'djs://webhook-avatar',
	application_id: 'djs://webhook-application-id',
	url: 'djs://webhook-url',
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
		const patched = instance[kPatch]({
			token: 'djs://webhook-token',
			channel_id: 'djs://[PATCHED]-channel-id',
		});

		expect(patched.token).toEqual('djs://webhook-token');
		expect(patched.channelId).toEqual('djs://[PATCHED]-channel-id');

		expect(patched.toJSON()).not.toEqual(data);
		expect(patched).toBe(instance);
	});
});
