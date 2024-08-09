import { z } from 'zod';

/**
 * Defines the structure of a command.
 *
 * @typedef {object} Command
 * @property {import('discord.js').RESTPostAPIApplicationCommandsJSONBody} data The data for the command
 * @property {(interaction: import('discord.js').CommandInteraction) => Promise<void> | void} execute The function to execute when the command is called
 */

/**
 * Defines the schema for a command
 */
export const schema = z.object({
	data: z.record(z.any()),
	execute: z.function(),
});

/**
 * Defines the predicate to check if an object is a valid Command type.
 *
 * @type {import('../util/loaders.js').StructurePredicate<Command>}
 * @returns {structure is Command}
 */
export const predicate = (structure) => schema.safeParse(structure).success;
