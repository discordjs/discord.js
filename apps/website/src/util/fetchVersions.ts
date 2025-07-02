import Cloudflare from 'cloudflare';
import { ENV } from './env';

const client = new Cloudflare({
	apiToken: process.env.CF_D1_DOCS_API_KEY,
});

export async function fetchVersions(packageName: string) {
	if (ENV.IS_LOCAL_DEV) {
		return [{ version: 'main' }];
	}

	try {
		const { result } = await client.d1.database.query(process.env.CF_D1_DOCS_ID!, {
			account_id: process.env.CF_ACCOUNT_ID!,
			sql: `select version from documentation where name = ? order by version desc;`,
			params: [packageName],
		});

		return (result[0]?.results as { version: string }[] | undefined) ?? [];
	} catch {
		return [];
	}
}
