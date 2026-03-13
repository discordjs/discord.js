import { DiscordSnowflake } from '@sapphire/snowflake';
import { SKUFlags, SKUType, type APISKU } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { SKU } from '../src/index.js';
import { kPatch } from '../src/utils/symbols.js';

const sku: APISKU = {
	id: '1',
	type: SKUType.Consumable,
	application_id: '2',
	name: 'djs://sku-name',
	slug: 'djs://slug-name',
	flags: SKUFlags.Available,
};

describe('SKU structure', () => {
	const instance = new SKU(sku);

	test('correct value for all getters', () => {
		expect(instance.applicationId).toBe(sku.application_id);
		expect(instance.type).toBe(sku.type);
		expect(instance.name).toBe(sku.name);
		expect(instance.id).toBe(sku.id);
		expect(instance.slug).toBe(sku.slug);

		expect(instance.flags?.bitField).toBe(BigInt(sku.flags));

		expect(instance.createdTimestamp).toBe(DiscordSnowflake.timestampFrom(instance.id!));
		expect(instance.createdDate).toEqual(new Date(instance.createdTimestamp!));
	});

	test('toJSON() returns expected values', () => {
		expect(instance.toJSON()).toStrictEqual(sku);
	});

	test('patching the structure works in-place', () => {
		const patched = instance[kPatch]({
			name: 'djs://[PATCHED]-sku-name',
			type: SKUType.Subscription,
		});

		expect(patched.name).toEqual('djs://[PATCHED]-sku-name');
		expect(patched.type).toEqual(SKUType.Subscription);

		expect(patched.toJSON()).not.toEqual(sku);
		expect(patched).toBe(instance);
	});
});
