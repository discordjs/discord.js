import type { ClientEvents } from 'discord.js';

export interface Event<T extends keyof ClientEvents> {
	execute(...parameters: ClientEvents[T]): Promise<void> | void;
	name: T;
	once?: boolean;
}
