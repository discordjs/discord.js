export * from '../api/index.js';
export * from '../util/index.js';

export * from 'discord-api-types/v10';

/**
 * The {@link https://github.com/discordjs/discord.js/blob/main/packages/core/#readme | @discordjs/core} version
 * that you are currently using.
 */
// This needs to explicitly be `string` so it is not typed as a "const string" that gets injected by esbuild
export const version = '[VI]{{inject}}[/VI]' as string;
