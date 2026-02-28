import { DiscordSnowflake } from '@sapphire/snowflake';
import { type APISubscription, SubscriptionStatus } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { Subscription } from '../src/index.js';
import { kPatch } from '../src/utils/symbols';

const data: APISubscription = {
	id: '34524354325',
	user_id: '435435236464',
	status: SubscriptionStatus.Active,
	sku_ids: ['23423423423', '23423423423'],
	entitlement_ids: ['23444', '242343242'],
	renewal_sku_ids: ['234234423432345', '354354235423543'],
	canceled_at: null,
	current_period_end: '2099-10-10T15:50:17.209000+00:00',
	current_period_start: '2023-10-10T15:50:17.209000+00:00',
	country: 'GB',
};

describe('Subscription structure', () => {
	const instance = new Subscription(data);

	test('correct value for all getters', () => {
		expect(instance.country).toBe(data.country);
		expect(instance.entitlementIds).toBe(data.entitlement_ids);
		expect(instance.renewalSkuIds).toBe(data.renewal_sku_ids);
		expect(instance.skuIds).toBe(data.sku_ids);
		expect(instance.status).toBe(data.status);
		expect(instance.userId).toBe(data.user_id);

		const createdTimestamp = DiscordSnowflake.timestampFrom(instance.id!);
		expect(instance.createdTimestamp).toBe(createdTimestamp);
		expect(instance.createdAt!.valueOf()).toBe(createdTimestamp);

		const startsTimestamp = Date.parse(data.current_period_start!);
		expect(instance.currentPeriodStartTimestamp).toBe(startsTimestamp);
		expect(instance.currentPeriodStartAt!.valueOf()).toBe(startsTimestamp);

		const endsTimestamp = Date.parse(data.current_period_end!);
		expect(instance.currentPeriodEndTimestamp).toBe(endsTimestamp);
		expect(instance.currentPeriodEndsAt!.valueOf()).toBe(endsTimestamp);

		expect(instance.canceledAt).toBeNull();
		expect(instance.canceledTimestamp).toBeNull();
	});

	// test('toJSON() is accurate', () => {
	// 	const expectedData = { ...data };

	// 	// @ts-expect-error the dapi-types type here does not allow canceled_at to be
	// 	// optional and the toJSON() on Structures is written to omit values that are
	// 	// equivalent to null. Hence this is used as a workaround.
	// 	delete expectedData.canceled_at;

	// 	expect(instance.toJSON()).toStrictEqual(expectedData);
	// });

	test('patching the structure works in-place', () => {
		const canceled_at = '2099-10-10T15:50:17.209000+00:00';
		const country = 'NL';

		const patched = instance[kPatch]({
			canceled_at,
			country,
		});

		const canceledTimestamp = Date.parse(data.current_period_end!);
		expect(instance.canceledTimestamp).toBe(canceledTimestamp);
		expect(instance.canceledAt!.valueOf()).toBe(canceledTimestamp);

		expect(patched.country).toEqual(country);

		expect(patched.toJSON()).not.toEqual(data);
		expect(patched).toBe(instance);
	});
});
