import type Cloudflare from 'cloudflare';
import { ENV } from './env';

export async function fetchVersions(packageName: string) {
	if (ENV.IS_LOCAL_DEV) {
		return [{ version: 'main' }];
	}

	try {
		const response = await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/d1/database/${process.env.CF_D1_DOCS_ID}/query`,
			{
				headers: {
					Authorization: `Bearer ${process.env.CF_D1_DOCS_API_KEY}`,
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({
					sql: `WITH parsed AS (
								SELECT
										version,
										CASE 
												WHEN version = 'main' THEN NULL 
												ELSE CAST(substr(version, 1, instr(version, '.') - 1) AS INTEGER)
										END AS major,
										CASE 
												WHEN version = 'main' THEN NULL 
												ELSE substr(version, instr(version, '.') + 1)
										END AS rest
								FROM documentation
								WHERE name = ?
								),
								parsed2 AS (
										SELECT
												version,
												major,
												CASE 
														WHEN version = 'main' THEN NULL 
														ELSE CAST(substr(rest, 1, instr(rest, '.') - 1) AS INTEGER)
												END AS minor,
												CASE 
														WHEN version = 'main' THEN NULL 
														ELSE CAST(substr(rest, instr(rest, '.') + 1) AS INTEGER)
												END AS patch
										FROM parsed
								)
								SELECT version
								FROM parsed2
								ORDER BY 
										CASE WHEN version = 'main' THEN 0 ELSE 1 END,
										major DESC, 
										minor DESC, 
										patch DESC;`,
					params: [packageName],
				}),
			},
		);

		const data = (await response.json()) as Cloudflare.D1Resource.Database.QueryResultsSinglePage;
		return (data.result[0]?.results ?? []) as { version: string }[];
	} catch {
		return [];
	}
}
