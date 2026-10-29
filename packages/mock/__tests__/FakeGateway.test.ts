/* eslint-disable id-length */

import {
	GatewayDispatchEvents,
	GatewayIntentBits,
	GatewayOpcodes,
	type GatewayDispatchPayload,
} from 'discord-api-types/v10';
import { expect, test, vi } from 'vitest';
import { createFakeDiscord } from '../src/index.js';

const intents = GatewayIntentBits.Guilds | GatewayIntentBits.GuildMembers | GatewayIntentBits.GuildMessages;

test('connect identifies every shard and emits READY and GUILD_CREATE before resolving', async () => {
	const discord = await createFakeDiscord({ shardCount: 2 });
	const guild = discord.world.createGuild({ name: 'Guild' });
	const received: [GatewayDispatchEvents, number][] = [];
	discord.gateway.on('dispatch', (payload, shardId) => void received.push([payload.t, shardId]));

	await discord.gateway.connect({ intents });

	const owner = discord.gateway.sessions.all().find((session) => session.owns(guild.id))!.shardId!;
	expect(received).toEqual(
		expect.arrayContaining([
			[GatewayDispatchEvents.Ready, 0],
			[GatewayDispatchEvents.Ready, 1],
			[GatewayDispatchEvents.GuildCreate, owner],
		]),
	);
	expect(received).toHaveLength(3);
	await discord.close();
});

test('world mutations reach the in-process client asynchronously and in order', async () => {
	const discord = await createFakeDiscord();
	const guild = discord.world.createGuild({ name: 'Guild' });
	const general = guild.createChannel({ name: 'general' });
	await discord.gateway.connect({ intents });

	const received: GatewayDispatchPayload[] = [];
	discord.gateway.on('dispatch', (payload) => void received.push(payload));

	const alice = guild.addMember(discord.world.createUser({ username: 'alice' }));
	general.createMessage({ author: alice, content: 'hello' });
	expect(received).toHaveLength(0);

	await new Promise<void>((resolve) => {
		discord.gateway.on('dispatch', (payload) => {
			if (payload.t === GatewayDispatchEvents.MessageCreate) resolve();
		});
	});
	expect(received.map((payload) => payload.t)).toEqual([
		GatewayDispatchEvents.GuildMemberAdd,
		GatewayDispatchEvents.MessageCreate,
	]);
	await discord.close();
});

test('send routes a payload from the in-process client to its session', async () => {
	const discord = await createFakeDiscord();
	const guild = discord.world.createGuild({ name: 'Guild' });
	await discord.gateway.connect({ intents });

	const chunk = new Promise<GatewayDispatchPayload>((resolve) => {
		discord.gateway.on('dispatch', (payload) => {
			if (payload.t === GatewayDispatchEvents.GuildMembersChunk) resolve(payload);
		});
	});
	await discord.gateway.send(0, {
		op: GatewayOpcodes.RequestGuildMembers,
		d: { guild_id: guild.id, query: '', limit: 0 },
	});

	await expect(chunk).resolves.toMatchObject({ d: { guild_id: guild.id, chunk_count: 1 } });
	await discord.close();
});

test('connect rejects when the gateway refuses the identify', async () => {
	const discord = await createFakeDiscord();
	await expect(discord.gateway.connect({ intents, token: 'wrong' })).rejects.toThrow(/closed with 4004/);
	await expect(discord.gateway.send(0, { op: GatewayOpcodes.Heartbeat, d: null })).rejects.toThrow(/not connected/);
});

test('fake timers do not stall in-process delivery', async () => {
	vi.useFakeTimers();
	try {
		const discord = await createFakeDiscord();
		discord.world.createGuild({ name: 'Guild' });
		await discord.gateway.connect({ intents });
		await discord.close();
	} finally {
		vi.useRealTimers();
	}
});
