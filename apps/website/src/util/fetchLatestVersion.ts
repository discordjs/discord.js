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
		const data = await client.d1.database.query(process.env.CF_D1_DOCS_ID!, {
			account_id: process.env.CF_ACCOUNT_ID!,
			sql: `WITH parsed AS (
						SELECT
							version,
							CAST(substr(version, 1, instr(version, '.') - 1) AS INTEGER) AS major,
							substr(version, instr(version, '.') + 1) AS rest
						FROM documentation
						WHERE name = ? AND version != 'main'
						),
						parsed2 AS (
							SELECT
								version,
								major,
								CAST(substr(rest, 1, instr(rest, '.') - 1) AS INTEGER) AS minor,
								CAST(substr(rest, instr(rest, '.') + 1) AS INTEGER) AS patch
							FROM parsed
						)
						SELECT version
						FROM parsed2
						ORDER BY major DESC, minor DESC, patch DESC
						LIMIT 1;`,
			params: [packageName],
		});

		return `${((data.result[0]?.results ?? []) as { version: string }[])[0]?.version ?? 'main'}${hasEntryPoints ? ['', ...DEFAULT_ENTRY_POINT].join('/') : ''}`;
	} catch {
		return '';
	}
}
