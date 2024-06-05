import { create } from '@actions/glob';

const nonNodePackages = new Set(['@discordjs/proxy-container']);
const globber = await create(`packages/*/package.json`);

interface PackageJSON {
	dependencies?: Record<string, string>;
	name?: string;
	private?: boolean;
	version?: string;
}

export interface ReleaseEntry {
	dependsOn?: string[];
	name: string;
	version: string;
}

async function getReleaseEntries() {
	const releaseEntries: ReleaseEntry[] = [];
	for await (const packageJsonPath of globber.globGenerator()) {
		const { default: packageJson }: { default: PackageJSON } = await import(`file://${packageJsonPath}`, {
			with: { type: 'json' },
		});
		// Don't release private packages ever (npm will error anyways)
		if (packageJson.private) continue;

		// Just in case
		if (!packageJson.version || !packageJson.name) continue;

		if (nonNodePackages.has(packageJson.name)) continue;

		const release: ReleaseEntry = {
			name: packageJson.name,
			version: packageJson.version,
		};

		for (const [dep, depVersion] of Object.entries(packageJson.dependencies ?? {})) {
			if (depVersion.startsWith('workspace')) {
				release.dependsOn ??= [];
				release.dependsOn.push(dep);
			}
		}

		releaseEntries.push(release);
	}

	return releaseEntries;
}

export async function generateReleaseTree(packageName?: string) {
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
