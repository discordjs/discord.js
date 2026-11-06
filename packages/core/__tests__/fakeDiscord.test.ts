import { createFakeDiscord, type FakeDiscord } from '@discordjs/mock';
import { REST } from '@discordjs/rest';
import { GatewayDispatchEvents, GatewayIntentBits } from 'discord-api-types/v10';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { Client } from '../src/index.js';

let discord: FakeDiscord;
let client: Client;

beforeEach(async () => {
	discord = await createFakeDiscord({ token: 'bot-token' });
	client = new Client({ rest: new REST().setToken('bot-token'), gateway: discord.gateway });
	await discord.gateway.connect({
		intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMembers | GatewayIntentBits.GuildMessages,
	});
});

afterEach(async () => {
	await discord.close();
});

test('a message created in the world reaches the client as MESSAGE_CREATE', async () => {
	const guild = discord.world.createGuild({ name: 'Guild' });
	const general = guild.createChannel({ name: 'general' });
	const alice = guild.addMember(discord.world.createUser({ username: 'alice' }));

	const received = new Promise((resolve) => {
		client.once(GatewayDispatchEvents.MessageCreate, resolve);
	});
	general.createMessage({ author: alice, content: 'hello' });

	await expect(received).resolves.toMatchObject({
		shardId: 0,
		data: { guild_id: guild.id, channel_id: general.id, author: { id: alice.id }, member: { roles: [] } },
	});
});

test('requestGuildMembers is answered by the fake gateway', async () => {
	const guild = discord.world.createGuild({ name: 'Guild' });
	const alice = guild.addMember(discord.world.createUser({ username: 'alice' }));

	const { members } = await client.requestGuildMembers({ guild_id: guild.id, query: 'ali', limit: 0 });

	expect(members.map((member) => member.user.id)).toEqual([alice.id]);
});
