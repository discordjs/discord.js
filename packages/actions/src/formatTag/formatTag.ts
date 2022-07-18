export function formatTag(tag: string) {
	const parsed = /(^@.*\/(?<package>.*)@v?)?(?<semver>\d+.\d+.\d+)-?.*/.exec(tag);

	if (parsed?.groups) {
		return {
			package: parsed.groups.package ?? 'discord.js',
			semver: parsed.groups.semver,
		};
	}

	return null;
}
