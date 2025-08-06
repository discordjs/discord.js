export * from './client.js';
export * from './constants.js';
export * from './ipc.js';
export * from './RPCEventError.js';
export * from './util.js';

/**
 * The {@link https://github.com/discordjs/RPC#readme | discord-rpc} version
 * that you are currently using.
 */
// This needs to explicitly be `string` so it is not typed as a "const string" that gets injected by esbuild
export const version = '[VI]{{inject}}[/VI]' as string;
