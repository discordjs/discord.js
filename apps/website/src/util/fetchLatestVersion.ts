import { Cloudflare } from 'cloudflare';
import { PACKAGES_WITH_ENTRY_POINTS, DEFAULT_ENTRY_POINT } from '@/util/constants';
import { ENV } from '@/util/env';

const client = new Cloudflare({
	apiToken: process.env.CF_D1_DOCS_API_KEY,
});

export async function fetchLatestVersion(packageName: string): Promise<string> {
	const hasEntryPoints = PACKAGES_WITH_ENTRY_POINTS.includes(packageName);

	if (ENV.IS_LOCAL_DEV) {
		if (hasEntryPoints) {
			return ['main', ...DEFAULT_ENTRY_POINT].join('/');
		}

		return 'main';
	}

	try {
		const { result } = await client.d1.database.query(process.env.CF_D1_DOCS_ID!, {
			account_id: process.env.CF_ACCOUNT_ID!,
			sql: `select version from documentation where name = ? and version != 'main' order by version desc limit 1;`,
			params: [packageName],
		});

		return `${(result[0]?.results as { version: string }[] | undefined)?.[0]?.version ?? 'main'}${hasEntryPoints ? ['', ...DEFAULT_ENTRY_POINT].join('/') : ''}`;
	} catch {
		return '';
	}
}
