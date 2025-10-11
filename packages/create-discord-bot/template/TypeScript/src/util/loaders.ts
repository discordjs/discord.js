import type { PathLike } from 'node:fs';
import { glob, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Command } from '../commands/index.[REPLACE_IMPORT_EXT]';
import { predicate as commandPredicate } from '../commands/index.[REPLACE_IMPORT_EXT]';
import type { Event } from '../events/index.[REPLACE_IMPORT_EXT]';
import { predicate as eventPredicate } from '../events/index.[REPLACE_IMPORT_EXT]';

/**
 * A predicate to check if the structure is valid
 */
export type StructurePredicate<Structure> = (structure: unknown) => structure is Structure;

/**
 * Loads all the structures in the provided directory
 *
 * @param dir - The directory to load the structures from
 * @param predicate - The predicate to check if the structure is valid
 * @param recursive - Whether to recursively load the structures in the directory
 * @returns
 */
export async function loadStructures<Structure>(
	dir: PathLike,
	predicate: StructurePredicate<Structure>,
	recursive = true,
): Promise<Structure[]> {
	// Get the stats of the directory
	const statDir = await stat(dir);

	// If the provided directory path is not a directory, throw an error
	if (!statDir.isDirectory()) {
		throw new Error(`The directory '${dir}' is not a directory.`);
	}

	// Create an empty array to store the structures
	const structures: Structure[] = [];

	// Create a glob pattern to match the .[REPLACE_IMPORT_EXT] files
	const basePath = dir instanceof URL ? fileURLToPath(dir) : dir.toString();
	const pattern = resolve(basePath, recursive ? '**/*.[REPLACE_IMPORT_EXT]' : '*.[REPLACE_IMPORT_EXT]');

	// Loop through all the matching files in the directory
	for await (const file of glob(pattern)) {
		// If the file is index.[REPLACE_IMPORT_EXT], skip the file
		if (file.endsWith('/index.[REPLACE_IMPORT_EXT]')) {
			continue;
		}

		// Import the structure dynamically from the file
		const { default: structure } = await import(file);

		// If the default export is a valid structure, add it
		if (predicate(structure)) {
			structures.push(structure);
		}
	}

	return structures;
}

export async function loadCommands(dir: PathLike, recursive = true): Promise<Map<string, Command>> {
	return (await loadStructures(dir, commandPredicate, recursive)).reduce(
		(acc, cur) => acc.set(cur.data.name, cur),
		new Map<string, Command>(),
	);
}

export async function loadEvents(dir: PathLike, recursive = true): Promise<Event[]> {
	return loadStructures(dir, eventPredicate, recursive);
}
