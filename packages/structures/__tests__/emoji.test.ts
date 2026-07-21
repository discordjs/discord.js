import { DiscordSnowflake } from '@sapphire/snowflake';
import type { APIEmoji, APIUser } from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { Emoji } from '../src/emojis/Emoji.js';
import { kPatch } from '../src/utils/symbols.js';

describe('Emoji structure', () => {
	const user: APIUser = {
		id: '1',
		username: 'username',
		discriminator: '0000',
		global_name: 'User',
		avatar: 'ae786a76a887687a6eaea877866768',
	};

	const data: APIEmoji = {
		id: '1',
		name: 'name',
		roles: ['1', '2', '3'],
		user,
		require_colons: true,
		managed: true,
		animated: true,
		available: true,
	};

	const instance = new Emoji(data);

	test('Emoji has all properties', () => {
		expect(instance.id).toBe(data.id);
		expect(instance.name).toBe(data.name);
		expect(instance.requireColons).toBe(data.require_colons);
		expect(instance.managed).toBe(data.managed);
		expect(instance.animated).toBe(data.animated);
		expect(instance.available).toBe(data.available);

		const createdTimestamp = DiscordSnowflake.timestampFrom(data.id!);
		expect(instance.createdTimestamp).toBe(createdTimestamp);
		expect(instance.createdAt!.valueOf()).toBe(createdTimestamp);
	});

	test('toJSON() is accurate', () => {
		expect(instance.toJSON()).toStrictEqual(data);
	});

	test('Patching the Emoji works in place', () => {
		const patched = instance[kPatch]({
			available: false,
		});

		expect(patched.available).toBeFalsy();

		expect(patched.toJSON()).not.toEqual(data);
		expect(patched).toBe(instance);
	});
});
