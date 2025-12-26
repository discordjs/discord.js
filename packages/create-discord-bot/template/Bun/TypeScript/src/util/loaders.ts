import type { PathLike } from 'node:fs';
import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { predicate as commandPredicate, type Command } from '../commands/index.ts';
import { predicate as eventPredicate, type Event } from '../events/index.ts';

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
	// Get the base path of the directory
	const basePath = dir instanceof URL ? fileURLToPath(dir) : dir.toString();

	// Check if the directory exists and is a directory
	const dirFile = Bun.file(basePath);
	const dirStat = await dirFile.stat();

	if (!dirStat?.isDirectory) {
		throw new Error(`The directory '${dir}' is not a directory.`);
	}

	// Create an empty array to store the structures
	const structures: Structure[] = [];

	// Create a glob pattern to match the .ts files
	const pattern = recursive ? '**/*.ts' : '*.ts';
	const glob = new Bun.Glob(pattern);

	// Loop through all the matching files in the directory
	for await (const file of glob.scan({ cwd: basePath, absolute: true })) {
		// If the file is index.ts, skip the file
		if (basename(file) === 'index.ts') {
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
