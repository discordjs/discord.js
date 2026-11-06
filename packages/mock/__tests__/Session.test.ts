/* eslint-disable id-length */

import {
	GatewayCloseCodes,
	GatewayDispatchEvents,
	GatewayIntentBits,
	GatewayOpcodes,
	type GatewayDispatchPayload,
	type GatewayIdentifyData,
	type GatewayReceivePayload,
} from 'discord-api-types/v10';
import { describe, expect, test } from 'vitest';
import { FakeGateway, World, type Session, type WorldOptions } from '../src/index.js';

const intents = GatewayIntentBits.Guilds | GatewayIntentBits.GuildMembers | GatewayIntentBits.GuildMessages;

function setup(options: WorldOptions = {}) {
	const world = new World(options);
	const gateway = new FakeGateway(world);
	return { world, gateway };
}

/**
 * A bare-bones client: records what it is sent and lets the test speak the protocol by hand
 */
function rawClient(gateway: FakeGateway) {
	const received: GatewayReceivePayload[] = [];
	const closes: { code: number; reason: string }[] = [];
	const session = gateway.open({
		send: (payload) => received.push(structuredClone(payload)),
		close: (code, reason) => closes.push({ code, reason }),
		drop: () => closes.push({ code: 1_006, reason: '' }),
	});

	return {
		session,
		received,
		closes,
		dispatches: () =>
			received.filter((payload): payload is GatewayDispatchPayload => payload.op === GatewayOpcodes.Dispatch),
		async identify(data: Partial<GatewayIdentifyData> = {}) {
			await session.receive({
				op: GatewayOpcodes.Identify,
				d: {
					token: gateway.world.token,
					intents,
					properties: { os: 'test', browser: 'test', device: 'test' },
					...data,
				},
			});
		},
		async resume(sessionId: string, seq: number) {
			await session.receive({
				op: GatewayOpcodes.Resume,
				d: { token: gateway.world.token, session_id: sessionId, seq },
			});
		},
	};
}

describe('handshake', () => {
	test('HELLO, then READY and one GUILD_CREATE per guild', async () => {
		const { world, gateway } = setup();
		const guild = world.createGuild({ name: 'Guild' });
		const client = rawClient(gateway);

		expect(client.received[0]).toMatchObject({ op: GatewayOpcodes.Hello, d: { heartbeat_interval: 41_250 } });

		await client.identify();
		const [ready, guildCreate] = client.dispatches();
		expect(ready).toMatchObject({
			t: GatewayDispatchEvents.Ready,
			s: 1,
			d: {
				v: 10,
				user: { id: world.botUserId },
				guilds: [{ id: guild.id, unavailable: true }],
				session_id: client.session.id,
				shard: [0, 1],
				application: { id: world.application.id },
			},
		});
		expect(guildCreate).toMatchObject({ t: GatewayDispatchEvents.GuildCreate, s: 2, d: { id: guild.id } });
		expect(client.session.status).toBe('ready');
	});

	test.each([
		['a wrong token', { token: 'nope' }, GatewayCloseCodes.AuthenticationFailed],
		['a shard outside the shard count', { shard: [1, 1] as [number, number] }, GatewayCloseCodes.InvalidShard],
		['the wrong shard count', { shard: [0, 2] as [number, number] }, GatewayCloseCodes.InvalidShard],
		['an intent that does not exist', { intents: 1 << 30 }, GatewayCloseCodes.InvalidIntents],
	])('identifying with %s closes the connection', async (_, data, code) => {
		const { gateway } = setup();
		const client = rawClient(gateway);

		await client.identify(data);
		await expect(client.session.expectClose(code)).resolves.toMatchObject({ initiator: 'server' });
		expect(client.closes).toEqual([{ code, reason: expect.any(String) }]);
		expect(client.session.status).toBe('invalidated');
	});

	test('privileged intents the application is not approved for are disallowed', async () => {
		const { gateway } = setup({ privilegedIntents: 0 });
		const client = rawClient(gateway);

		await client.identify({ intents: GatewayIntentBits.MessageContent });
		await client.session.expectClose(GatewayCloseCodes.DisallowedIntents);
	});

	test('anything but IDENTIFY, RESUME or a heartbeat before identifying closes with 4003', async () => {
		const { gateway } = setup();
		const client = rawClient(gateway);

		await client.session.receive({ op: GatewayOpcodes.Heartbeat, d: null });
		expect(client.session.connected).toBe(true);

		await client.session.receive({
			op: GatewayOpcodes.PresenceUpdate,
			d: { since: null, activities: [], status: 'online', afk: false },
		});
		await client.session.expectClose(GatewayCloseCodes.NotAuthenticated);
	});

	test('identifying twice closes with 4005', async () => {
		const { gateway } = setup();
		const client = rawClient(gateway);

		await client.identify();
		await client.identify();
		await client.session.expectClose(GatewayCloseCodes.AlreadyAuthenticated);
	});

	test('unknown opcodes close with 4001 and malformed payloads with 4002', async () => {
		const { gateway } = setup();
		const unknown = rawClient(gateway);
		await unknown.identify();
		await unknown.session.receive({ op: 99, d: null });
		await unknown.session.expectClose(GatewayCloseCodes.UnknownOpcode);

		const malformed = rawClient(gateway);
		await malformed.session.receive('not a payload');
		await malformed.session.expectClose(GatewayCloseCodes.DecodeError);
	});
});

describe('heartbeats', () => {
	test('are acknowledged until the test says otherwise', async () => {
		const { gateway } = setup();
		const client = rawClient(gateway);
		await client.identify();

		await client.session.receive({ op: GatewayOpcodes.Heartbeat, d: 2 });
		expect(client.received.at(-1)).toMatchObject({ op: GatewayOpcodes.HeartbeatAck });
		expect(client.session.lastHeartbeatSequence).toBe(2);

		client.session.stopAcking();
		const count = client.received.length;
		await client.session.receive({ op: GatewayOpcodes.Heartbeat, d: 2 });
		expect(client.received).toHaveLength(count);

		client.session.requestHeartbeat();
		expect(client.received.at(-1)).toMatchObject({ op: GatewayOpcodes.Heartbeat });
	});
});

describe('fan-out', () => {
	test('events only reach sessions whose intents include them', async () => {
		const { world, gateway } = setup();
		const guild = world.createGuild({ name: 'Guild' });
		const withMembers = rawClient(gateway);
		const withoutMembers = rawClient(gateway);
		await withMembers.identify();
		await withoutMembers.identify({ intents: GatewayIntentBits.Guilds });

		guild.addMember(world.createUser());

		expect(withMembers.dispatches().at(-1)?.t).toBe(GatewayDispatchEvents.GuildMemberAdd);
		expect(withoutMembers.dispatches().at(-1)?.t).toBe(GatewayDispatchEvents.GuildCreate);
	});

	test('GUILD_CREATE only lists the bot without the guild members intent', async () => {
		const { world, gateway } = setup();
		const guild = world.createGuild({ name: 'Guild' });
		guild.addMember(world.createUser());
		const client = rawClient(gateway);
		await client.identify({ intents: GatewayIntentBits.Guilds });

		const guildCreate = client.dispatches().find((payload) => payload.t === GatewayDispatchEvents.GuildCreate)!;
		expect(guildCreate.d).toMatchObject({ member_count: 3, members: [{ user: { id: world.botUserId } }] });
	});

	test('message content is withheld without the message content intent, unless the bot is mentioned', async () => {
		const { world, gateway } = setup();
		const guild = world.createGuild({ name: 'Guild' });
		const general = guild.createChannel({ name: 'general' });
		const alice = guild.addMember(world.createUser());
		const client = rawClient(gateway);
		await client.identify({ intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages });

		general.createMessage({ author: alice, content: 'secret' });
		expect(client.dispatches().at(-1)).toMatchObject({ t: GatewayDispatchEvents.MessageCreate, d: { content: '' } });

		general.createMessage({ author: alice, content: `hey <@${world.botUserId}>` });
		expect(client.dispatches().at(-1)).toMatchObject({ d: { content: `hey <@${world.botUserId}>` } });
	});

	test('guild events go to the shard that owns the guild', async () => {
		const { world, gateway } = setup({ shardCount: 2 });
		const shards = [rawClient(gateway), rawClient(gateway)];
		await shards[0]!.identify({ shard: [0, 2] });
		await shards[1]!.identify({ shard: [1, 2] });

		// ids one ms apart land on alternating shards
		const now = world.clock.now();
		const guilds = [
			world.createGuild({ name: 'A', createdAt: now }),
			world.createGuild({ name: 'B', createdAt: now + 1 }),
		];
		expect(new Set(guilds.map((guild) => shards.findIndex((shard) => shard.session.owns(guild.id)))).size).toBe(2);

		for (const guild of guilds) {
			const owner = gateway.sessions.all().find((session) => session.owns(guild.id))!;
			const other = owner === shards[0]!.session ? shards[1]! : shards[0]!;
			const ownerClient = owner === shards[0]!.session ? shards[0]! : shards[1]!;
			expect(ownerClient.dispatches().some((payload) => (payload.d as { id?: string }).id === guild.id)).toBe(true);
			expect(other.dispatches().some((payload) => (payload.d as { id?: string }).id === guild.id)).toBe(false);
		}
	});

	test('the raw dispatch escape hatch ignores intents', async () => {
		const { gateway } = setup();
		const client = rawClient(gateway);
		await client.identify({ intents: 0 });

		gateway.dispatch(GatewayDispatchEvents.TypingStart, { channel_id: '1', user_id: '2', timestamp: 0 });
		expect(client.dispatches().at(-1)).toMatchObject({ t: GatewayDispatchEvents.TypingStart, s: 2 });
	});
});

async function disconnectedSession() {
	const { world, gateway } = setup();
	const guild = world.createGuild({ name: 'Guild' });
	const first = rawClient(gateway);
	await first.identify();
	const seenUpTo = first.session.sequence;

	first.session.drop();
	await first.session.expectClose(1_006);
	expect(first.session.status).toBe('disconnected');

	guild.addMember(world.createUser({ username: 'missed-1' }));
	guild.addMember(world.createUser({ username: 'missed-2' }));
	return { world, gateway, first, seenUpTo };
}

describe('resuming', () => {
	test('replays what the client missed while disconnected, then sends RESUMED', async () => {
		const { gateway, first, seenUpTo } = await disconnectedSession();
		const second = rawClient(gateway);

		await second.resume(first.session.id!, seenUpTo);

		expect(second.dispatches().map((payload) => [payload.t, payload.s])).toEqual([
			[GatewayDispatchEvents.GuildMemberAdd, seenUpTo + 1],
			[GatewayDispatchEvents.GuildMemberAdd, seenUpTo + 2],
			[GatewayDispatchEvents.Resumed, seenUpTo + 3],
		]);
		expect(second.session.id).toBe(first.session.id);
		expect(first.session.status).toBe('invalidated');
		expect(gateway.sessions.for(0)).toBe(second.session);
	});

	test('an unknown session or a sequence outside the buffer is invalidated', async () => {
		const { gateway, first } = await disconnectedSession();

		const unknown = rawClient(gateway);
		await unknown.resume('nope', 0);
		expect(unknown.received.at(-1)).toMatchObject({ op: GatewayOpcodes.InvalidSession, d: false });

		const ahead = rawClient(gateway);
		await ahead.resume(first.session.id!, first.session.sequence + 1);
		expect(ahead.received.at(-1)).toMatchObject({ op: GatewayOpcodes.InvalidSession, d: false });
	});

	test('a session closed with a normal close code cannot be resumed', async () => {
		const { gateway } = setup();
		const first = rawClient(gateway);
		await first.identify();
		first.session.transportClosed(1_000);

		const second = rawClient(gateway);
		await second.resume(first.session.id!, first.session.sequence);
		expect(second.received.at(-1)).toMatchObject({ op: GatewayOpcodes.InvalidSession, d: false });
	});
});

describe('faults', () => {
	test('reconnect, invalidate and close send what Discord would', async () => {
		const { gateway } = setup();
		const client = rawClient(gateway);
		await client.identify();
		const { session } = client;

		session.reconnect();
		expect(client.received.at(-1)).toMatchObject({ op: GatewayOpcodes.Reconnect });

		session.invalidate({ resumable: true });
		expect(client.received.at(-1)).toMatchObject({ op: GatewayOpcodes.InvalidSession, d: true });
		expect(session.status).toBe('ready');

		session.close(GatewayCloseCodes.RateLimited, 'You are being rate limited.');
		await expect(session.expectClose(GatewayCloseCodes.RateLimited)).resolves.toMatchObject({ initiator: 'server' });
		expect(session.status).toBe('disconnected');
	});

	test('expectClose rejects on a different close code', async () => {
		const { gateway } = setup();
		const { session } = rawClient(gateway);
		const expectation = session.expectClose(4_200);
		session.transportClosed(1_000);
		await expect(expectation).rejects.toThrow(/Expected the session to close with 4200.*1000/);
	});
});

describe('opcode handlers', () => {
	test('a registered handler runs before the built-in and can fall through to it', async () => {
		const { gateway } = setup();
		const seen: string[] = [];
		const dispose = gateway.handle(GatewayOpcodes.Identify, async (payload, _session, next) => {
			seen.push(payload.d.token);
			return next();
		});

		const client = rawClient(gateway);
		await client.identify();
		expect(seen).toEqual(['bot-token']);
		expect(client.session.status).toBe('ready');

		dispose();
		await rawClient(gateway).identify();
		expect(seen).toHaveLength(1);
	});

	test('a handler that does not call next replaces the built-in', async () => {
		const { gateway } = setup();
		gateway.handle(GatewayOpcodes.Identify, (_payload, session: Session) => {
			session.invalidate({ resumable: false });
		});

		const client = rawClient(gateway);
		await client.identify();
		expect(client.session.status).toBe('awaiting-identify');
		expect(client.received.at(-1)).toMatchObject({ op: GatewayOpcodes.InvalidSession, d: false });
	});

	test('REQUEST_GUILD_MEMBERS answers with member chunks', async () => {
		const { world, gateway } = setup();
		const guild = world.createGuild({ name: 'Guild' });
		const alice = guild.addMember(world.createUser({ username: 'alice' }));
		guild.addMember(world.createUser({ username: 'bob' }));
		const client = rawClient(gateway);
		await client.identify();

		await client.session.receive({
			op: GatewayOpcodes.RequestGuildMembers,
			d: { guild_id: guild.id, query: 'al', limit: 0, nonce: 'n' },
		});
		expect(client.dispatches().at(-1)).toMatchObject({
			t: GatewayDispatchEvents.GuildMembersChunk,
			d: { guild_id: guild.id, members: [{ user: { id: alice.id } }], chunk_index: 0, chunk_count: 1, nonce: 'n' },
		});

		await client.session.receive({
			op: GatewayOpcodes.RequestGuildMembers,
			d: { guild_id: guild.id, user_ids: [alice.id, '1'] },
		});
		expect(client.dispatches().at(-1)).toMatchObject({
			d: { members: [{ user: { id: alice.id } }], not_found: ['1'] },
		});
	});
});
