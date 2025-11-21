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
