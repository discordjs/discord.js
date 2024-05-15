import type { RESTPostAPIApplicationCommandsJSONBody, CommandInteraction } from 'npm:discord.js@^14.14.1';
import { z } from 'npm:zod@^3.22.4';
import type { StructurePredicate } from '../util/loaders.ts';

/**
 * Defines the structure of a command
 */
export type Command = {
	/**
	 * The data for the command
	 */
	data: RESTPostAPIApplicationCommandsJSONBody;
	/**
	 * The function to execute when the command is called
	 *
	 * @param interaction - The interaction of the command
	 */
	execute(interaction: CommandInteraction): Promise<void> | void;
};

/**
 * Defines the schema for a command
 */
export const schema = z.object({
	data: z.record(z.any()),
	execute: z.function(),
});

/**
 * Defines the predicate to check if an object is a valid Command type.
 */
export const predicate: StructurePredicate<Command> = (structure): structure is Command =>
	schema.safeParse(structure).success;
