export type * from './types.js';
export * from './functions/index.js';
export * from './JSONEncodable.js';
export type * from './RawFile.js';
export * from './Equatable.js';
export * from './gatewayRateLimitError.js';

/**
 * The {@link https://github.com/discordjs/discord.js/blob/main/packages/util#readme | @discordjs/util} version
 * that you are currently using.
 *
 * @privateRemarks This needs to explicitly be `string` so it is not typed as a "const string" that gets injected by esbuild.
 */
export const version = '[VI]{{inject}}[/VI]' as string;
