export * from './strategies/context/IContextFetchingStrategy.js';
export * from './strategies/context/SimpleContextFetchingStrategy.js';
export * from './strategies/context/WorkerContextFetchingStrategy.js';

export type * from './strategies/sharding/IShardingStrategy.js';
export * from './strategies/sharding/SimpleShardingStrategy.js';
export * from './strategies/sharding/WorkerShardingStrategy.js';

export type * from './throttling/IIdentifyThrottler.js';
export * from './throttling/SimpleIdentifyThrottler.js';

export * from './utils/constants.js';
export * from './utils/WorkerBootstrapper.js';

export * from './ws/WebSocketManager.js';
export * from './ws/WebSocketShard.js';

/**
 * The {@link https://github.com/discordjs/discord.js/blob/main/packages/ws#readme | @discordjs/ws} version
 * that you are currently using.
 */
// This needs to explicitly be `string` so it is not typed as a "const string" that gets injected by esbuild
export const version = '[VI]{{inject}}[/VI]' as string;
