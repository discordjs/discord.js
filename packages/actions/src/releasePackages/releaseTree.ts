import type { ReleaseVersions } from '../util/releaseManifest.js';

export interface ReleaseEntry {
	changelog?: string;
	dependsOn?: string[];
	name: string;
	version: string;
}

export function buildReleaseTree(entries: ReleaseEntry[]) {
	let pending = entries;
	const released = new Set<string>();
	const tree: ReleaseEntry[][] = [];
	while (pending.length) {
		const ready = pending.filter((entry) => entry.dependsOn?.every((dep) => released.has(dep)) ?? true);
		if (!ready.length)
			throw new Error(
				`One or more packages have dependents that can't be released: ${pending.map((entry) => entry.name).join(',')}`,
			);
		for (const entry of ready) released.add(entry.name);
		tree.push(ready);
		pending = pending.filter((entry) => !released.has(entry.name));
	}

	return tree;
}

/**
 * Selects artifact packages and their normal workspace dependency closure, retaining release order.
 */
export function selectReleaseTree(entries: ReleaseEntry[], versions: ReleaseVersions) {
	for (const [name, version] of Object.entries(versions)) {
		const entry = entries.find((pkg) => pkg.name === name);
		if (entry?.version !== version)
			throw new Error(`Release package ${name}@${version} does not match the checked-out repository`);
	}

	const needed = new Set(Object.keys(versions));
	const tree = buildReleaseTree(entries);
	const selected: ReleaseEntry[][] = [];
	for (const branch of tree.toReversed()) {
		const releases = branch.filter((entry) => needed.has(entry.name));
		for (const entry of releases) for (const dependency of entry.dependsOn ?? []) needed.add(dependency);
		if (releases.length) selected.unshift(releases);
	}

	return selected;
}
