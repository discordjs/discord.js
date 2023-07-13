export function formatTag(tag: string) {
	// eslint-disable-next-line unicorn/no-unsafe-regex
	const parsed = /(?:^@.*\/(?<package>.*)@v?)?(?<semver>\d+.\d+.\d+)-?.*/.exec(tag);
	const parsedPackage = /(?<package>.*)@v?-?.*/.exec(tag);

	if (parsed?.groups) {
		const isSubpackage = typeof parsed.groups.package === 'string';
		const pkg = isSubpackage ? parsed.groups.package : parsedPackage?.groups?.package ?? 'discord.js';
		const semver = parsed.groups.semver;

		return {
			isSubpackage,
			package: pkg,
			semver,
		};
	}

	return null;
}
