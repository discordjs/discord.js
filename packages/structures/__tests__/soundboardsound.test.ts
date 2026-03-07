import { DiscordSnowflake } from '@sapphire/snowflake';
import { type APISoundboardSound } from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { SoundboardSound } from '../src';
import { kPatch } from '../src/utils/symbols';

/**
 * @todo - do we want to potentially not expose these getters and just have
 * a partial Emoji structure for this structure?
 * I think either way it could be beneficial to expose an Emoji for this structure
 */
const emoji_id = '1';
const emoji_name = 'djs://emoji-name';

const soundboardSoundInGuild: APISoundboardSound = {
	name: 'djs://soundboardsound-name',
	sound_id: '1',
	volume: 1_000_000_000,
	guild_id: '1',
	available: true,
	emoji_id,
	emoji_name,
};

const defaulSoundboardtSound: APISoundboardSound = {
	name: 'djs://soundboardsound-name',
	sound_id: '1',
	volume: 1_000_000_000,
	available: true,
	emoji_id,
	emoji_name,
};

describe('SoundboardSound structure', () => {
	const guildSound = new SoundboardSound(soundboardSoundInGuild);
	const defaultSound = new SoundboardSound(defaulSoundboardtSound);

	test('correct value for all getters and helper method [createdTimestamp | createdAt]', () => {
		expect(guildSound.available).toBe(soundboardSoundInGuild.available);
		expect(guildSound.emojiId).toBe(soundboardSoundInGuild.emoji_id);
		expect(guildSound.emojiName).toBe(soundboardSoundInGuild.emoji_name);
		expect(guildSound.guildId).toBe(soundboardSoundInGuild.guild_id);
		expect(guildSound.name).toBe(soundboardSoundInGuild.name);
		expect(guildSound.soundId).toBe(soundboardSoundInGuild.sound_id);
		expect(guildSound.volume).toBe(soundboardSoundInGuild.volume);

		expect(guildSound.createdTimestamp).toBe(DiscordSnowflake.timestampFrom(guildSound.soundId!));
		expect(guildSound.createdAt).toEqual(new Date(guildSound.createdTimestamp!));
	});

	test('only sounds in guilds have the created[At|Timestamp] getters exposed', () => {
		expect(defaultSound.createdAt).toBeNull();
		expect(defaultSound.createdTimestamp).toBeNull();
		expect(defaultSound.guildId).toBeUndefined();
	});

	test('toJSON() returns expected values', () => {
		expect(guildSound.toJSON()).toStrictEqual(soundboardSoundInGuild);
	});

	test('patching the structure works in-place', () => {
		const patched = defaultSound[kPatch]({
			guild_id: '1',
		});

		expect(patched.createdTimestamp).toBe(DiscordSnowflake.timestampFrom(guildSound.soundId!));
		expect(patched.createdAt).toEqual(new Date(guildSound.createdTimestamp!));

		expect(patched.toJSON()).not.toEqual(defaulSoundboardtSound);
		expect(patched).toBe(defaultSound);
	});
});
