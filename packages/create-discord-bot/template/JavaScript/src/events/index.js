import { z } from 'zod';

/**
 * Defines the structure of an event.
 *
 * @template {keyof import('discord.js').ClientEvents} [T=keyof import('discord.js').ClientEvents]
 * @typedef {object} Event
 * @property {(...parameters: import('discord.js').ClientEvents[T]) => Promise<void> | void} execute The function to execute the command
 * @property {T} name The name of the event to listen to
 * @property {boolean} [once] Whether or not the event should only be listened to once
 */

/**
 * Defines the schema for an event.
 *
 */
export const schema = z.object({
	name: z.string(),
	once: z.boolean().optional().default(false),
	execute: z.function(),
});

/**
 * Defines the predicate to check if an object is a valid Event type.
 *
 * @type {import('../util/loaders.js').StructurePredicate<Event>}
 * @returns {structure is Event}
 */
export const predicate = (structure) => schema.safeParse(structure).success;
