export function formatTag(tag: string) {
	const parsed = /(^@.*\/(?<package>.*)@v?)?(?<semver>\d+.\d+.\d+)-?.*/.exec(tag);

	if (parsed?.groups) {
		return parsed.groups;
	}

	return null;
}
