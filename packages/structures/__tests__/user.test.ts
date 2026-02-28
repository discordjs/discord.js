import { DiscordSnowflake } from '@sapphire/snowflake';
import {
	type APIUser,
	type APIAvatarDecorationData,
	UserPremiumType,
	type APIConnection,
	ConnectionService,
	ConnectionVisibility,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { User, AvatarDecorationData, Connection } from '../src/index.js';
import { kPatch } from '../src/utils/symbols.js';

const avatarDecorationData: APIAvatarDecorationData = {
	asset: '34525654654364635465346trtgwretre',
	sku_id: '456546465437347',
};

const user: APIUser = {
	username: 'idk',
	id: '52435243526763',
	global_name: 'test',
	avatar: '34525654654364635465346trtgwretre',
	discriminator: '0000',
	accent_color: 123_456,
	mfa_enabled: false,
	locale: 'en-GB',
	verified: false,
	system: true,
	premium_type: UserPremiumType.NitroBasic,
};

const connections: APIConnection = {
	id: '52435243526763',
	name: 'GitHub',
	type: ConnectionService.GitHub,
	revoked: false,
	integrations: [
		{
			id: '2343523453',
			name: 'integration',
		},
	],
	verified: true,
	visibility: ConnectionVisibility.Everyone,
	friend_sync: true,
	show_activity: true,
	two_way_link: false,
};

describe('User structure', () => {
	const data = user;
	const instance = new User(data);

	test('correct value for all getters', () => {
		expect(instance.accentColor).toBe(data.accent_color);
		expect(instance.avatar).toBe(data.avatar);
		expect(instance.banner).toBe(data.banner);
		expect(instance.discriminator).toBe(data.discriminator);
		expect(instance.displayName).toBe(data.global_name ?? data.username);
		expect(instance.hexAccentColor).toBe('#01e240');
		expect(instance.id).toBe(data.id);
		expect(instance.locale).toBe(data.locale);
		expect(instance.username).toBe(data.username);
		expect(instance.premiumType).toBe(data.premium_type);

		const createdTimestamp = DiscordSnowflake.timestampFrom(instance.id!);
		expect(instance.createdTimestamp).toBe(createdTimestamp);
		expect(instance.createdAt!.valueOf()).toBe(createdTimestamp);

		expect(instance.bot).toBeFalsy();
		expect(instance.system).toBeTruthy();
		expect(instance.verified).toBeFalsy();
		expect(instance.email).toBeUndefined();
		expect(instance.mfaEnabled).toBeFalsy();
	});

	test('toJSON() is accurate', () => {
		expect(instance.toJSON()).toStrictEqual(data);
	});

	test('patching the structure works in-place', () => {
		const premium_type = UserPremiumType.Nitro;
		const mfa_enabled = true;
		const locale = 'en-US';

		const patched = instance[kPatch]({
			premium_type,
			mfa_enabled,
			locale,
		});

		expect(patched.premiumType).toEqual(premium_type);
		expect(patched.mfaEnabled).toEqual(mfa_enabled);
		expect(patched.locale).toEqual(locale);

		expect(patched.toJSON()).not.toEqual(data);
		expect(patched).toBe(instance);
	});

	describe('AvatarDecorationData sub-structure', () => {
		const data = avatarDecorationData;
		const instance = new AvatarDecorationData(data);

		test('correct value for all getters', () => {
			expect(instance.asset).toBe(data.asset);
			expect(instance.skuId).toBe(data.sku_id);
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const asset = '52654653460892f8wfu0fihfoqiufhqrfhoqfh35236262546';

			const patched = instance[kPatch]({
				asset,
			});

			expect(patched.asset).toEqual(asset);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});

	describe('Connection sub-structure', () => {
		const data = connections;
		const instance = new Connection(data);

		test('correct value for all getters', () => {
			expect(instance.id).toBe(data.id);
			expect(instance.name).toBe(data.name);
			expect(instance.type).toBe(data.type);
			expect(instance.visibility).toBe(data.visibility);
			// eslint-disable-next-line n/no-sync
			expect(instance.friendSync).toBe(data.friend_sync);

			expect(instance.revoked).toBeFalsy();
			expect(instance.verified).toBeTruthy();
			expect(instance.twoWayLink).toBeFalsy();
			expect(instance.showActivity).toBeTruthy();
		});

		test('toJSON() is accurate', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const visibility = ConnectionVisibility.None;
			const type = ConnectionService.AmazonMusic;

			const patched = instance[kPatch]({
				visibility,
				type,
			});

			expect(patched.type).toEqual(type);
			expect(patched.visibility).toEqual(visibility);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});
});
