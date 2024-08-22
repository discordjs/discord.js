export * from './handlers/proxyRequests.js';
export * from './util/responseHelpers.js';
export type { RequestHandler } from './util/util.js';

/**
 * The {@link https://github.com/discordjs/discord.js/blob/main/packages/proxy#readme | @discordjs/proxy} version
 * that you are currently using.
 *
 * @privateRemarks This needs to explicitly be `string` so it is not typed as a "const string" that gets injected by esbuild.
 */
export const version = '[VI]{{inject}}[/VI]' as string;
