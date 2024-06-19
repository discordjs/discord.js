import { warning } from '@actions/core';
import { $, file } from 'bun';

const nonNodePackages = new Set(['@discordjs/proxy-container']);

interface pnpmTreeDependency {
	from: string;
	path: string;
	version: string;
}

interface pnpmTree {
	dependencies?: Record<string, pnpmTreeDependency>;
	name?: string;
	path: string;
	private?: boolean;
	unsavedDependencies?: Record<string, pnpmTreeDependency>;
	version?: string;
}

export interface ReleaseEntry {
	changelog?: string;
	dependsOn?: string[];
	name: string;
	version: string;
}

async function getReleaseEntries() {
	const releaseEntries: ReleaseEntry[] = [];
	const packageList: pnpmTree[] =
		await $`pnpm list --recursive --only-projects --filter {packages/\*} --prod --json`.json();

	for (const pkg of packageList) {
		// Don't release private packages ever (npm will error anyways)
		if (pkg.private) continue;
		// Just in case
		if (!pkg.version || !pkg.name) continue;
		if (nonNodePackages.has(pkg.name)) continue;

		const release: ReleaseEntry = {
			name: pkg.name,
			version: pkg.version,
		};

		try {
			// Find and parse changelog to post in github release
			const changelogFile = await file(`${pkg.path}/CHANGELOG.md`).text();

			let changelogLines: string[] = [];
			let foundChangelog = false;

			for (const line of changelogFile.split('\n')) {
				if (line.startsWith('# [')) {
					if (foundChangelog) {
						if (changelogLines.at(-1) === '') {
							changelogLines = changelogLines.slice(2, -1);
						}

						break;
					}

					foundChangelog = true;
				}

				if (foundChangelog) {
					changelogLines.push(line);
				}
			}

			release.changelog = changelogLines.join('\n');
		} catch (error) {
			// Probably just no changelog file but log just in case
			warning(`Error parsing changelog for ${pkg.name}, will use auto generated: ${error}`);
		}

		if (pkg.dependencies) {
			release.dependsOn = Object.keys(pkg.dependencies);
		}

		releaseEntries.push(release);
	}

	return releaseEntries;
}

export async function generateReleaseTree(packageName?: string, exclude?: string[]) {
	let releaseEntries = await getReleaseEntries();
	// Try to early return if the package doesn't have deps
	if (packageName) {
		const releaseEntry = releaseEntries.find((entry) => entry.name === packageName);
		if (!releaseEntry) {
			throw new Error(`Package ${packageName} not releaseable`);
		}

		if (!releaseEntry.dependsOn) {
			return [[releaseEntry]];
		}
	}

	// Generate the whole tree first, then prune if specified
	const releaseTree: ReleaseEntry[][] = [];
	const didRelease = new Set<string>();

	while (releaseEntries.length) {
		const nextBranch: ReleaseEntry[] = [];
		const unreleased: ReleaseEntry[] = [];
		for (const entry of releaseEntries) {
			if (!entry.dependsOn) {
				nextBranch.push(entry);
				continue;
			}

			const allDepsReleased = entry.dependsOn.every((dep) => didRelease.has(dep));
			if (allDepsReleased) {
				nextBranch.push(entry);
			} else {
				unreleased.push(entry);
			}
		}

		// Update didRelease in a second loop to avoid loop order issues
		for (const release of nextBranch) {
			didRelease.add(release.name);
		}

		if (releaseEntries.length === unreleased.length) {
			throw new Error(
				`One or more packages have dependents that can't be released: ${unreleased.map((entry) => entry.name).join(',')}`,
			);
		}

		releaseTree.push(nextBranch);
		releaseEntries = unreleased;
	}

	// Prune exclusions
	if (Array.isArray(exclude) && exclude.length) {
		const neededPackages = new Set<string>();
		const excludedReleaseTree: ReleaseEntry[][] = [];

		for (const releaseBranch of releaseTree.reverse()) {
			const newThisBranch: ReleaseEntry[] = [];

			for (const entry of releaseBranch) {
				if (exclude.includes(entry.name) && !neededPackages.has(entry.name)) {
					continue;
				}

				newThisBranch.push(entry);
				for (const dep of entry.dependsOn ?? []) {
					neededPackages.add(dep);
				}
			}

			if (newThisBranch.length) excludedReleaseTree.unshift(newThisBranch);
		}

		return excludedReleaseTree;
	}

	if (!packageName) {
		return releaseTree;
	}

	// Prune the tree for the specified package
	const neededPackages = new Set<string>([packageName]);
	const packageReleaseTree: ReleaseEntry[][] = [];

	for (const releaseBranch of releaseTree.reverse()) {
		const newThisBranch: ReleaseEntry[] = [];

		for (const entry of releaseBranch) {
			if (neededPackages.has(entry.name)) {
				newThisBranch.push(entry);
				for (const dep of entry.dependsOn ?? []) {
					neededPackages.add(dep);
				}
			}
		}

		if (newThisBranch.length) packageReleaseTree.unshift(newThisBranch);
	}

	return packageReleaseTree;
}
