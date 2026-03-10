/**
 * Generate browser-like headers for REST requests.
 * Matches what the real Discord web client sends.
 *
 * Reference: selfbotsdk-discordjs/src/rest/APIRequest.js
 */

import type { SuperProperties } from './super-properties.js';

export interface BrowserHeaders {
	Accept: string;
	'Accept-Language': string;
	'Accept-Encoding': string;
	Origin: string;
	Referer: string;
	'Sec-CH-UA': string;
	'Sec-CH-UA-Mobile': string;
	'Sec-CH-UA-Platform': string;
	'Sec-Fetch-Dest': string;
	'Sec-Fetch-Mode': string;
	'Sec-Fetch-Site': string;
	'X-Discord-Locale': string;
	'X-Discord-Timezone': string;
	'X-Super-Properties': string;
}

export function generateBrowserHeaders(superProps: SuperProperties): BrowserHeaders {
	const majorVersion = superProps.browserVersion.split('.')[0];

	return {
		'Accept': '*/*',
		'Accept-Language': 'en-US,en;q=0.9',
		'Accept-Encoding': 'gzip, deflate, br, zstd',
		'Origin': 'https://discord.com',
		'Referer': 'https://discord.com/channels/@me',
		'Sec-CH-UA': `"Not_A Brand";v="8", "Chromium";v="${majorVersion}"`,
		'Sec-CH-UA-Mobile': '?0',
		'Sec-CH-UA-Platform': '"Windows"',
		'Sec-Fetch-Dest': 'empty',
		'Sec-Fetch-Mode': 'cors',
		'Sec-Fetch-Site': 'same-origin',
		'X-Discord-Locale': 'en-US',
		'X-Discord-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
		'X-Super-Properties': superProps.encode(),
	};
}
