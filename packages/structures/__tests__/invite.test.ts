import type { APIExtendedInvite, APIInvite } from 'discord-api-types/v10';
import { InviteTargetType, InviteType } from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { Invite } from '../src/invites/Invite.js';
import { dateToDiscordISOTimestamp } from '../src/utils/optimization.js';
import { kPatch } from '../src/utils/symbols.js';

describe('Invite', () => {
	// TODO: Check if omitting `expires_at` is appropriate

	const dataNoCode: Omit<APIInvite, 'code' | 'expires_at'> = {
		type: InviteType.Guild,
		channel: null,
		approximate_member_count: 15,
		approximate_presence_count: 35,
		target_type: InviteTargetType.EmbeddedApplication,
	};

	const data: Omit<APIInvite, 'expires_at'> = {
		...dataNoCode,
		code: '123',
	};

	const dataExtended: Omit<APIExtendedInvite, 'expires_at'> = {
		...data,
		created_at: '2020-10-10T13:50:17.209000+00:00',
		max_age: 12,
		max_uses: 34,
		temporary: false,
		uses: 5,
	};

	test('Invite has all properties', () => {
		const instance = new Invite(data);
		expect(instance.type).toBe(data.type);
		expect(instance.code).toBe(data.code);
		expect(instance.createdDate).toBeNull();
		expect(instance.createdTimestamp).toBeNull();
		expect(instance.maxAge).toBeUndefined();
		expect(instance.maxUses).toBeUndefined();
		expect(instance.approximateMemberCount).toBe(data.approximate_member_count);
		expect(instance.approximatePresenceCount).toBe(data.approximate_presence_count);
		expect(instance.targetType).toBe(data.target_type);
		expect(instance.temporary).toBeUndefined();
		expect(instance.uses).toBeUndefined();
		expect(instance.expiresTimestamp).toBeNull();
		expect(instance.expiresDate).toBeNull();
		expect(instance.url).toBe('https://discord.gg/123');
		expect(instance.toJSON()).toEqual(data);
		expect(`${instance}`).toBe('https://discord.gg/123');
		expect(instance.valueOf()).toBe(data.code);
	});

	test('extended Invite has all properties', () => {
		const instance = new Invite(dataExtended);

		expect(instance.type).toBe(data.type);
		expect(instance.code).toBe(dataExtended.code);
		expect(dateToDiscordISOTimestamp(instance.createdDate!)).toBe(dataExtended.created_at);
		expect(instance.createdTimestamp).toBe(Date.parse(dataExtended.created_at));
		expect(instance.maxAge).toBe(dataExtended.max_age);
		expect(instance.maxUses).toBe(dataExtended.max_uses);
		expect(instance.approximateMemberCount).toBe(dataExtended.approximate_member_count);
		expect(instance.approximatePresenceCount).toBe(dataExtended.approximate_presence_count);
		expect(instance.targetType).toBe(dataExtended.target_type);
		expect(instance.temporary).toBe(dataExtended.temporary);
		expect(instance.uses).toBe(dataExtended.uses);
		expect(instance.createdTimestamp).toBe(Date.parse(dataExtended.created_at));
		expect(dateToDiscordISOTimestamp(instance.createdDate!)).toEqual(dataExtended.created_at);
		expect(instance.expiresTimestamp).toStrictEqual(Date.parse('2020-10-10T13:50:29.209000+00:00'));
		expect(instance.expiresDate).toStrictEqual(new Date('2020-10-10T13:50:29.209000+00:00'));
		expect(instance.url).toBe('https://discord.gg/123');
		expect(instance.toJSON()).toEqual({ ...dataExtended, expires_at: '2020-10-10T13:50:29.209000+00:00' });
		expect(instance.toString()).toEqual('https://discord.gg/123');
		expect(instance.valueOf()).toEqual('123');
	});

	test('Invite with omitted properties', () => {
		const instance = new Invite(dataNoCode);
		expect(instance.toJSON()).toEqual(dataNoCode);
		expect(instance.url).toBe(null);
		expect(instance.code).toBe(undefined);
		expect(`${instance}`).toBe('');
		expect(instance.valueOf()).toEqual(Object.prototype.valueOf.apply(instance));
	});

	test('Invite with expiration', () => {
		const instance = new Invite({ ...dataExtended, expires_at: '2020-10-10T13:50:29.209000+00:00' });
		expect(instance.toJSON()).toEqual({ ...dataExtended, expires_at: '2020-10-10T13:50:29.209000+00:00' });
	});

	test('Patching Invite works in place', () => {
		const instance1 = new Invite(data);
		const instance2 = instance1[kPatch]({ max_age: 34 });
		expect(instance1.toJSON()).not.toEqual(data);
		expect(instance2).toBe(instance1);
	});
});
