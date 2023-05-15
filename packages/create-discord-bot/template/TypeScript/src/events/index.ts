import type { ClientEvents } from 'discord.js';
import type { StructurePredicate } from '../util/loaders.js';

/**
 * Defines the structure of an event.
 */
export type Event<T extends keyof ClientEvents = keyof ClientEvents> = {
	/**
	 * The function to execute when the event is emitted.
	 *
	 * @param parameters - The parameters of the event.
	 */
	execute(...parameters: ClientEvents[T]): Promise<void> | void;
	/**
	 * The name of the event to listen to.
	 */
	name: T;
	/**
	 * Whether or not the event should only be listened to once.
	 *
	 * @defaultValue false
	 */
	once?: boolean;
};

// Defines the predicate to check if an object is a valid Event type.
export const predicate: StructurePredicate<Event> = (structure): structure is Event =>
	Boolean(structure) &&
	typeof structure === 'object' &&
	'name' in structure! &&
	'execute' in structure &&
	typeof structure.name === 'string' &&
	typeof structure.execute === 'function';
