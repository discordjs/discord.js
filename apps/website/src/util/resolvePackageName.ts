export function resolvePackageName(packageName: string) {
	return packageName === 'discord.js' ? packageName : `@discordjs/${packageName}`;
}
