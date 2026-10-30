/* eslint-disable id-length */

import { DiscordSnowflake } from '@sapphire/snowflake';
import { ChannelType, GatewayDispatchEvents, GatewayIntentBits, RESTJSONErrorCodes } from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { DiscordError, MemoryStore, World, type WorldEvent } from '../src/index.js';

function recordEvents(world: World) {
	const events: WorldEvent[] = [];
	world.bus.subscribe((event) => events.push(event));
	return events;
}

describe('MemoryStore', () => {
	test('values are copied in and out', () => {
		const store = new MemoryStore();
		const value = { nested: { count: 1 } };
		store.put('key', value);
		value.nested.count = 2;

		const read = store.get<typeof value>('key')!;
		expect(read.nested.count).toBe(1);
		read.nested.count = 3;
		expect(store.get<typeof value>('key')!.nested.count).toBe(1);
	});

	test('list, counters and logs', () => {
		const store = new MemoryStore();
		store.put('a:1', 1);
		store.put('b:1', 2);
		store.put('a:2', 3);

		expect(store.list('a:')).toEqual([
			['a:1', 1],
			['a:2', 3],
		]);
		expect(store.increment('counter')).toBe(1);
		expect(store.increment('counter', 5)).toBe(6);
		expect(store.append('log', 'first')).toBe(0);
		expect(store.append('log', 'second')).toBe(1);
		expect(store.read('log', 1)).toEqual(['second']);
	});
});

describe('World', () => {
	test('a new guild has an @everyone role, the bot as a member, and announces itself', () => {
		const world = new World();
		const events = recordEvents(world);
		const owner = world.createUser({ username: 'owner' });

		const guild = world.createGuild({ name: 'Guild', ownerId: owner });

		expect(guild.data.owner_id).toBe(owner.id);
		expect(guild.roles.get(guild.id)?.name).toBe('@everyone');
		expect(guild.members.has(world.botUserId)).toBe(true);
		expect(guild.members.has(owner.id)).toBe(true);
		expect(events).toHaveLength(1);
		expect(events[0]).toMatchObject({
			t: GatewayDispatchEvents.GuildCreate,
			guildId: guild.id,
			intent: GatewayIntentBits.Guilds,
			d: { id: guild.id, member_count: 2, unavailable: false },
		});
	});

	test('handles read through to the store instead of caching', () => {
		const world = new World();
		const guild = world.createGuild({ name: 'Guild' });
		const alice = guild.addMember(world.createUser({ username: 'alice' }));
		const role = guild.createRole({ name: 'mod' });

		expect(alice.data.roles).toEqual([]);
		alice.addRole(role);
		expect(alice.data.roles).toEqual([role.id]);
		expect(guild.member(alice.id).data.roles).toEqual([role.id]);
	});

	test('banning a member publishes a ban and a removal, and deletes their recent messages', () => {
		const world = new World();
		const guild = world.createGuild({ name: 'Guild' });
		const general = guild.createChannel({ name: 'general', type: ChannelType.GuildText });
		const alice = guild.addMember(world.createUser({ username: 'alice' }));
		const old = general.createMessage({ author: alice, content: 'old', createdAt: world.clock.now() - 3_600_000 });
		general.createMessage({ author: alice, content: 'one' });
		general.createMessage({ author: alice, content: 'two' });

		const events = recordEvents(world);
		guild.addBan(alice, { reason: 'spam', deleteMessageSeconds: 60 });

		expect(events.map((event) => event.t)).toEqual([
			GatewayDispatchEvents.GuildBanAdd,
			GatewayDispatchEvents.GuildMemberRemove,
			GatewayDispatchEvents.MessageDeleteBulk,
		]);
		expect(guild.bans.get(alice)).toMatchObject({ reason: 'spam', user: { id: alice.id } });
		expect(guild.members.has(alice)).toBe(false);
		expect(general.messages.list().map((message) => message.id)).toEqual([old.id]);
	});

	test('messages resolve mentions and carry the author member in MESSAGE_CREATE', () => {
		const world = new World();
		const guild = world.createGuild({ name: 'Guild' });
		const general = guild.createChannel({ name: 'general' });
		const alice = guild.addMember(world.createUser({ username: 'alice' }));
		const role = guild.createRole({ name: 'mod' });
		const events = recordEvents(world);

		const message = general.createMessage({
			author: alice,
			content: `hi <@${world.botUserId}> and <@&${role.id}> and <@123456789012345678>`,
		});

		expect(message.data.mentions.map((user) => user.id)).toEqual([world.botUserId]);
		expect(message.data.mention_roles).toEqual([role.id]);
		expect(general.data).toMatchObject({ last_message_id: message.id });
		expect(events[0]).toMatchObject({
			t: GatewayDispatchEvents.MessageCreate,
			intent: GatewayIntentBits.GuildMessages,
			d: { guild_id: guild.id, member: { roles: [] }, author: { id: alice.id } },
		});
	});

	test('the clock decides snowflake timestamps', () => {
		const world = new World();
		const createdAt = Date.parse('2020-01-01T00:00:00.000Z');
		const user = world.createUser({ createdAt });
		expect(DiscordSnowflake.timestampFrom(user.id)).toBe(createdAt);

		world.clock.set(Date.parse('2030-01-01T00:00:00.000Z'));
		expect(DiscordSnowflake.timestampFrom(world.createUser().id)).toBeGreaterThanOrEqual(
			Date.parse('2030-01-01T00:00:00.000Z'),
		);
	});

	test('unknown records fail with Discord errors', () => {
		const world = new World();
		const guild = world.createGuild({ name: 'Guild' });

		expect(() => world.guild('1')).toThrow(DiscordError);
		expect(() => guild.member('1')).toThrow(
			expect.objectContaining({ code: RESTJSONErrorCodes.UnknownMember, status: 404 }),
		);
		expect(() => guild.removeBan(world.botUserId)).toThrow(
			expect.objectContaining({ code: RESTJSONErrorCodes.UnknownBan }),
		);
	});
});
