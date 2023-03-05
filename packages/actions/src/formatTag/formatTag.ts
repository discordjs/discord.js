export function formatTag(tag: string) {
	// eslint-disable-next-line unicorn/no-unsafe-regex, prefer-named-capture-group
	const parsed = /(^@.*\/(?<package>.*)@v?)?(?<semver>\d+.\d+.\d+)-?.*/.exec(tag);

	if (parsed?.groups) {
		return {
			isSubpackage: typeof parsed.groups.package === 'string',
			package: parsed.groups.package ?? 'discord.js',
			semver: parsed.groups.semver,
		};
	}

	return null;
}
