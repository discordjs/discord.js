import type { LocaleString } from 'discord-api-types/v10';

export function flattenLocaleMap(
	localeMap: Map<LocaleString, string> | Partial<Record<LocaleString, string>>,
): [LocaleString, string][] {
	return localeMap instanceof Map
		? [...localeMap.entries()]
		: ([...Object.entries(localeMap)] as [LocaleString, string][]);
}
