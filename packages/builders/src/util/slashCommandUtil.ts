import type { LocaleString, LocalizationMap } from 'discord-api-types/v10';

export function flattenLocaleMap(localeMap: Map<LocaleString, string> | LocalizationMap): [LocaleString, string][] {
	return localeMap instanceof Map ? [...localeMap.entries()] : (Object.entries(localeMap) as [LocaleString, string][]);
}
