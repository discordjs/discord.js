import { Collection } from '@discordjs/collection';
import type { Client } from '../Client';

export class Container extends Collection<ContainerKey, ContainerValue> {}

export const container = new Container();

export interface Container {
	get<Key extends ContainerKey>(key: Key): ContainerEntries[Key];
	get(key: string): undefined;
	has(key: ContainerKey): true;
	has(key: string): false;
}

/**
 * A type utility to get the keys of {@link ContainerEntries}.
 */
export type ContainerKey = keyof ContainerEntries;

/**
 * A type utility to get the values of {@link ContainerEntries}.
 */
export type ContainerValue = ContainerEntries[ContainerKey];

/**
 * The {@link Container}'s registry, use module augmentation against this interface when adding new entries.
 */
export interface ContainerEntries {
	client: Client;
}
