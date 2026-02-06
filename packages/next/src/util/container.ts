import type { Client } from '../Client';

// @ts-expect-error client property gets set later
export const container: ContainerEntries = {};

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
	readonly client: Client;
}
