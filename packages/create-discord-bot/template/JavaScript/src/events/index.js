/**
 * Defines the structure of an event.
 *
 * @template {keyof import('discord.js').ClientEvents} [T=keyof import('discord.js').ClientEvents]
 * @typedef {object} Event
 * @property {(...parameters: import('discord.js').ClientEvents[T]) => Promise<void> | void} execute The function to execute the command
 * @property {T} name The name of the event to listen to
 * @property {boolean} [once] Whether or not the event should only be listened to once
 */

// Defines the predicate to check if an object is a valid Event type.
/** @type {import('../util/loaders').StructurePredicate<Event>} */
export const predicate = (structure) =>
	Boolean(structure) &&
	structure !== null &&
	typeof structure === 'object' &&
	'name' in structure &&
	'execute' in structure &&
	typeof structure.name === 'string' &&
	typeof structure.execute === 'function';
