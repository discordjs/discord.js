import { FakeGateway, type FakeGatewayOptions } from './gateway/FakeGateway.js';
import { World, type WorldOptions } from './world/World.js';

export interface FakeDiscordOptions extends WorldOptions {
	gateway?: FakeGatewayOptions;
}

export interface FakeDiscord {
	/**
	 * Tears down every session
	 */
	close(): Promise<void>;
	readonly gateway: FakeGateway;
	readonly world: World;
}

/**
 * Creates a fake Discord
 *
 * @example
 * ```ts
 * const discord = await createFakeDiscord({ token: 'bot-token' });
 * const client = new Client({ rest, gateway: discord.gateway });
 * await discord.gateway.connect({ intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages });
 *
 * const guild = discord.world.createGuild({ name: 'Test' });
 * const general = guild.createChannel({ name: 'general' });
 * general.createMessage({ author: guild.addMember(discord.world.createUser()), content: 'hello' });
 * ```
 */
export async function createFakeDiscord(options: FakeDiscordOptions = {}): Promise<FakeDiscord> {
	const { gateway: gatewayOptions, ...worldOptions } = options;
	const world = new World(worldOptions);
	const gateway = new FakeGateway(world, gatewayOptions);

	return {
		world,
		gateway,
		async close() {
			gateway.disconnect();
			for (const session of gateway.sessions) session.close(1_001, 'Fake Discord is shutting down');
		},
	};
}
