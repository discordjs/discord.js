import type { ClientEvents } from 'npm:discord.js@^14.14.1';
import { z } from 'npm:zod@^3.22.4';
import type { StructurePredicate } from '../util/loaders.ts';

/**
 * Defines the structure of an event.
 */
export type Event<T extends keyof ClientEvents = keyof ClientEvents> = {
	/**
	 * The function to execute when the event is emitted.
	 *
	 * @param parameters - The parameters of the event
	 */
	execute(...parameters: ClientEvents[T]): Promise<void> | void;
	/**
	 * The name of the event to listen to
	 */
	name: T;
	/**
	 * Whether or not the event should only be listened to once
	 *
	 * @defaultValue false
	 */
	once?: boolean;
};

/**
 * Defines the schema for an event.
 */
export const schema = z.object({
	name: z.string(),
	once: z.boolean().optional().default(false),
	execute: z.function(),
});

/**
 * Defines the predicate to check if an object is a valid Event type.
 */
export const predicate: StructurePredicate<Event> = (structure: unknown): structure is Event =>
	schema.safeParse(structure).success;
