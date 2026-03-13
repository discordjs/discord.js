import { DiscordSnowflake } from '@sapphire/snowflake';
import { StageInstancePrivacyLevel, type APIStageInstance } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { StageInstance } from '../src/index.js';
import { kPatch } from '../src/utils/symbols.js';

const data: APIStageInstance = {
	id: '43234543',
	guild_id: '34579823414',
	channel_id: '47239857823573',
	topic: 'a very interesting topic',
	discoverable_disabled: false,
	guild_scheduled_event_id: '429874893572435',
	privacy_level: StageInstancePrivacyLevel.GuildOnly,
};

describe('Stage Instance Structure', () => {
	const instance = new StageInstance(data);

	test('correct value for all getters', () => {
		expect(instance.channelId).toBe(data.channel_id);
		expect(instance.guildId).toBe(data.guild_id);
		expect(instance.guildScheduledEventId).toBe(data.guild_scheduled_event_id);
		expect(instance.privacyLevel).toBe(data.privacy_level);
		expect(instance.topic).toBe(data.topic);

		const createdTimestamp = DiscordSnowflake.timestampFrom(instance.id!);
		expect(instance.createdTimestamp).toBe(createdTimestamp);
		expect(instance.createdAt!.valueOf()).toBe(createdTimestamp);
	});

	test('toJSON() is accurate', () => {
		expect(instance.toJSON()).toStrictEqual(data);
	});

	test('patching the structure works in-place', () => {
		const privacy_level = StageInstancePrivacyLevel.Public;
		const topic = 'a slightly less interesting topic';

		const patched = instance[kPatch]({
			privacy_level,
			topic,
		});

		expect(patched.topic).toBe(topic);
		expect(patched.privacyLevel).toBe(privacy_level);

		expect(patched.toJSON()).not.toEqual(data);
		expect(patched).toBe(instance);
	});
});
