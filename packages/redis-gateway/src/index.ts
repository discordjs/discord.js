import { randomBytes } from 'node:crypto';
import { PubSubRedisBroker } from '@discordjs/brokers';
import type { RESTOptions } from '@discordjs/rest';
import { REST } from '@discordjs/rest';
import type { OptionalWebSocketManagerOptions, RequiredWebSocketManagerOptions } from '@discordjs/ws';
import { WorkerShardingStrategy, CompressionMethod, WebSocketManager, WebSocketShardEvents } from '@discordjs/ws';
import Redis from 'ioredis';
import { ProxyAgent } from 'undici';
import type { DiscordEvents } from './discordEvents.js';
import { Env } from './env.js';

const env = new Env();

const redisClient = new Redis(env.redisUrl);
const broker = new PubSubRedisBroker<DiscordEvents>({
	redisClient,
});

const restOptions: Partial<RESTOptions> = {};
if (env.discordProxyURL) {
	restOptions.api = `${env.discordProxyURL}/api`;
}

const rest = new REST(restOptions).setToken(env.discordToken);
if (env.discordProxyURL) {
	rest.setAgent(new ProxyAgent(env.discordProxyURL));
}

const gatewayOptions: Partial<OptionalWebSocketManagerOptions> & RequiredWebSocketManagerOptions = {
	token: env.discordToken,
	rest,
	intents: env.intents,
	compression: CompressionMethod.ZlibStream,
	shardCount: env.shardCount,
	shardIds: env.shardIds,
};
if (env.shardsPerWorker) {
	gatewayOptions.buildStrategy = (manager) =>
		new WorkerShardingStrategy(manager, { shardsPerWorker: env.shardsPerWorker! });
}

const gateway = new WebSocketManager(gatewayOptions);

gateway
	.on(WebSocketShardEvents.Debug, ({ message, shardId }) => console.log(`[WS Shard ${shardId}] [DEBUG]`, message))
	.on(WebSocketShardEvents.Hello, ({ shardId }) => console.log(`[WS Shard ${shardId}] [HELLO]`))
	.on(WebSocketShardEvents.Ready, ({ shardId }) => console.log(`[WS Shard ${shardId}] [READY]`))
	.on(WebSocketShardEvents.Resumed, ({ shardId }) => console.log(`[WS Shard ${shardId}] [RESUMED]`))
	.on(WebSocketShardEvents.Dispatch, ({ data }) => void broker.publish(data.t, data.d));

broker.on('gateway_send', async ({ data, ack }) => {
	for (const shardId of await gateway.getShardIds()) {
		await gateway.send(shardId, data);
	}

	await ack();
});

// we use a random group name because we don't want work-balancing,
// we need this to be fanned out so all shards get the payload
await broker.subscribe(randomBytes(16).toString('hex'), ['gateway_send']);
await gateway.connect();
