export function extendTemplate<SuperTemplate extends Record<string, unknown>>(
	superTemplate: SuperTemplate,
	additions: Record<string, unknown>,
): Record<string, unknown> & SuperTemplate {
	return Object.defineProperties(additions, Object.getOwnPropertyDescriptors(superTemplate)) as Record<
		string,
		unknown
	> &
		SuperTemplate;
}

export function dateToDiscordISOTimestamp(date: Date) {
	return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCDate().toString().padStart(2, '0')}T${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}:${date.getUTCSeconds().toString().padStart(2, '0')}.${date.getUTCMilliseconds().toString().padEnd(6, '0')}+00:00`;
}
