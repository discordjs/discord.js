/* eslint-disable import/export */
// TODO figure out reexports better
export * from 'discord-api-types/v10';
export * from '@discordjs/builders';
export * from '@discordjs/collection';
export * from '@discordjs/core';
export * from '@discordjs/formatters';
export * from '@discordjs/rest';
export * from '@discordjs/util';
// TODO reexport ws once reexports are better (overlapping mismatched type)
// export * from '@discordjs/ws';

/**
 * The {@link https://github.com/discordjs/discord.js/blob/main/packages/discord.js-next/#readme | @discordjs/discord.js-next} version
 * that you are currently using.
 */
// This needs to explicitly be `string` so it is not typed as a "const string" that gets injected by esbuild
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const version: string = '[VI]{{inject}}[/VI]';
