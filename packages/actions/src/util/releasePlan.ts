export interface ReleaseChange {
	folder: string;
	name: string;
	nextVersion: string | null;
	previousTag: string | null;
	version: string;
}

export interface ReleasePlan {
	branch: string;
	head: string;
	mode: 'auto' | 'manual';
	packages: ReleaseChange[];
}

export interface ReleaseManifest {
	plan: ReleasePlan;
	pullRequestNumber: number;
	releaseBranch: string;
	releaseCommit: string;
	repository: string;
	runAttempt: number;
	runId: string;
	schemaVersion: 1;
}

export function releaseTitle(plan: ReleasePlan) {
	const packages = plan.packages
		.filter((pkg) => pkg.nextVersion !== null)
		.sort((first, second) => {
			if (first.name === second.name) return 0;
			if (first.name === 'discord.js') return -1;
			if (second.name === 'discord.js') return 1;
			return first.name.localeCompare(second.name);
		});
	if (!packages.length) throw new Error('A release title requires at least one package');
	const versions = packages.map((pkg) => `${pkg.name}@${pkg.nextVersion}`);
	let subject = `release ${versions.join(', ')}`;
	if (subject.length > 72)
		subject = `release ${versions[0]} and ${versions.length - 1} other ${versions.length === 2 ? 'package' : 'packages'}`;
	if (subject.length > 72) subject = `release ${versions.length} packages`;
	return `chore: ${subject}`;
}
