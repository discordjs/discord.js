import { DiscordSnowflake } from '@sapphire/snowflake';
import { type APIEntitlement, EntitlementType } from 'discord-api-types/v10';
import { beforeEach, describe, expect, test } from 'vitest';
import { Entitlement } from '../src/entitlements/Entitlement.js';
import { kPatch } from '../src/utils/symbols.js';

describe('Entitlement structure', () => {
	const data: APIEntitlement = {
		id: '1081589159740833934',
		sku_id: '222086648706498562',
		application_id: '348607796335607817',
		user_id: '474807795183648809',
		type: EntitlementType.Purchase,
		deleted: false,
		starts_at: '2020-10-10T13:50:17.209000+00:00',
		ends_at: '2020-10-10T15:50:17.209000+00:00',
		consumed: false,
		// note guild_id is missing (to test kPatch)
	};

	let instance: Entitlement;

	beforeEach(() => {
		instance = new Entitlement(data);
	});

	test('Entitlement has all properties', () => {
		expect(instance.id).toBe(data.id);
		expect(instance.skuId).toBe(data.sku_id);
		expect(instance.applicationId).toBe(data.application_id);
		expect(instance.userId).toBe(data.user_id);
		expect(instance.type).toBe(data.type);
		expect(instance.consumed).toBe(data.consumed);
		expect(instance.deleted).toBe(data.deleted);
		expect(instance.guildId).toBeUndefined();

		const createdTimestamp = DiscordSnowflake.timestampFrom(instance.id!);
		expect(instance.createdTimestamp).toBe(createdTimestamp);
		expect(instance.createdAt!.valueOf()).toBe(createdTimestamp);

		const startsTimestamp = Date.parse(data.starts_at!);
		expect(instance.startsTimestamp).toBe(startsTimestamp);
		expect(instance.startsAt!.valueOf()).toBe(startsTimestamp);

		const endsTimestamp = Date.parse(data.ends_at!);
		expect(instance.endsTimestamp).toBe(endsTimestamp);
		expect(instance.endsAt!.valueOf()).toBe(endsTimestamp);
	});

	test('toJSON() is accurate', () => {
		expect(instance.toJSON()).toStrictEqual(data);
	});

	test('Patching the Entitlement works in place', () => {
		const guildId = '111111';
		const consumed = true;

		const patched = instance[kPatch]({
			guild_id: guildId,
			consumed,
		});

		expect(patched.guildId).toEqual(guildId);
		expect(patched.consumed).toEqual(consumed);

		expect(patched.toJSON()).toEqual({
			...data,
			guild_id: guildId,
			consumed,
		});

		expect(patched).toBe(instance);
	});
});
