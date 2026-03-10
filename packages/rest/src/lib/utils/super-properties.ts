/**
 * Super properties sent as X-Super-Properties header (base64 JSON)
 * and in the gateway IDENTIFY payload's `properties` field.
 * Must be internally consistent (Chrome version in UA = browser_version).
 *
 * Reference: discord.py-self/discord/utils.py (Headers class)
 */

import { Buffer } from 'node:buffer';

const DEFAULT_CHROME_VERSION = '136.0.0.0';
const DEFAULT_BUILD_NUMBER = 9_999;
const BUILD_NUMBER_API = 'https://cordapi.dolfi.es/api/v2/properties/web';

export interface SuperPropertiesData {
	browser: string;
	browser_user_agent: string;
	browser_version: string;
	client_build_number: number;
	client_event_source: null;
	device: string;
	has_client_mods: boolean;
	os: string;
	os_version: string;
	referrer: string;
	referrer_current: string;
	referring_domain: string;
	referring_domain_current: string;
	release_channel: string;
	system_locale: string;
}

export class SuperProperties {
	private readonly data: SuperPropertiesData;

	private encodedCache: string | null = null;

	public constructor(options?: Partial<SuperPropertiesData>) {
		const chromeVersion = options?.browser_version ?? DEFAULT_CHROME_VERSION;
		const ua = `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Safari/537.36`;

		this.data = {
			os: 'Windows',
			browser: 'Chrome',
			device: '',
			system_locale: 'en-US',
			browser_user_agent: ua,
			browser_version: chromeVersion,
			os_version: '10',
			referrer: '',
			referring_domain: '',
			referrer_current: '',
			referring_domain_current: '',
			release_channel: 'stable',
			client_build_number: DEFAULT_BUILD_NUMBER,
			client_event_source: null,
			has_client_mods: false,
			...options,
		};
	}

	/**
	 * Raw properties object for gateway IDENTIFY `properties` field
	 */
	public get properties(): SuperPropertiesData {
		return { ...this.data };
	}

	/**
	 * Browser User-Agent string
	 */
	public get userAgent(): string {
		return this.data.browser_user_agent;
	}

	/**
	 * Chrome major version (e.g. "136")
	 */
	public get browserVersion(): string {
		return this.data.browser_version;
	}

	/**
	 * Base64-encoded JSON for X-Super-Properties header
	 */
	public encode(): string {
		this.encodedCache ??= Buffer.from(JSON.stringify(this.data)).toString('base64');
		return this.encodedCache;
	}

	/**
	 * Update build number; invalidates encoded cache
	 */
	public setBuildNumber(buildNumber: number): void {
		this.data.client_build_number = buildNumber;
		this.encodedCache = null;
	}

	/**
	 * Fetch build number from cordapi.dolfi.es API (same as discord.py-self).
	 * Returns hardcoded fallback on failure.
	 */
	public static async fetchBuildNumber(fallback = DEFAULT_BUILD_NUMBER): Promise<number> {
		try {
			const res = await fetch(BUILD_NUMBER_API);
			const json = (await res.json()) as { client?: { build_number?: number } };
			const bn = json.client?.build_number;
			if (typeof bn === 'number' && bn > 0) return bn;
		} catch {
			// Silently fall back
		}

		return fallback;
	}
}
