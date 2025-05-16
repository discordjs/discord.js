import type { APIExtendedInvite } from 'discord-api-types/v10';
import { InviteTargetType, InviteType } from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { Invite } from '../src';

describe('Invite', () => {
	const data: APIExtendedInvite = {
		type: InviteType.Guild,
		channel: null,
		code: '123',
		created_at: '2020-10-10T13:50:17.209Z',
		max_age: 12,
		max_uses: 34,
		temporary: false,
		uses: 5,
		approximate_member_count: 15,
		approximate_presence_count: 35,
		target_type: InviteTargetType.EmbeddedApplication,
	};

	test('TextChannel has all properties', () => {
		const instance = new Invite(data);
		// expect(instance.type).toBe(data.type);
		expect(instance.code).toBe(data.code);
		expect(instance.createdAt?.toISOString()).toBe(data.created_at);
		expect(instance.createdTimestamp).toBe(Date.parse(data.created_at));
		expect(instance.maxAge).toBe(data.max_age);
		expect(instance.maxUses).toBe(data.max_uses);
		expect(instance.memberCount).toBe(data.approximate_member_count);
		expect(instance.presenceCount).toBe(data.approximate_presence_count);
		expect(instance.targetType).toBe(data.target_type);
		expect(instance.temporary).toBe(data.temporary);
		expect(instance.url).toBe('https://discord.gg/123');
		expect(instance.toJSON()).toEqual(data);
	});
});
