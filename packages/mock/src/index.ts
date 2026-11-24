export * from './createFakeDiscord.js';
export * from './gateway/index.js';
export * from './world/index.js';

/**
 * The {@link https://github.com/discordjs/discord.js/blob/main/packages/mock#readme | @discordjs/mock} version
 * that you are currently using.
 *
 * @privateRemarks This needs to explicitly be `string` so it is not typed as a "const string" that gets injected by esbuild.
 */
export const version = '[VI]{{inject}}[/VI]' as string;
