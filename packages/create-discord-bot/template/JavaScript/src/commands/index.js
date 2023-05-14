/**
 * @typedef {object} Command
 * Defines the structure of a command.
 * @property {import('discord.js').RESTPostAPIApplicationCommandsJSONBody} data The data for the command.
 * @property {(interaction: import('discord.js').CommandInteraction) => Promise<void> | void} execute The function to execute when the command is called.
 */

/**
 * Defines the predicate to check if an object is a valid Command type.
 *
 * @param {import('../util/loaders.js').StructurePredicate<Command>} structure
 * @returns {structure is Command}
 */
export const predicate = (structure) =>
	Boolean(structure) &&
	structure !== null &&
	typeof structure === 'object' &&
	'data' in structure &&
	'execute' in structure &&
	typeof structure.data === 'object' &&
	typeof structure.execute === 'function';
