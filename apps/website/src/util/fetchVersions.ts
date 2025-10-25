// import Cloudflare from 'cloudflare';
import { ENV } from './env';

// const client = new Cloudflare({
// 	apiToken: process.env.CF_D1_DOCS_API_KEY,
// });

export async function fetchVersions(packageName: string) {
	if (ENV.IS_LOCAL_DEV) {
		return [{ version: 'main' }];
	}

	try {
		// const { result } = await client.d1.database.query(process.env.CF_D1_DOCS_ID!, {
		// 	account_id: process.env.CF_ACCOUNT_ID!,
		// 	sql: `select version from documentation where name = ? order by version desc;`,
		// 	params: [packageName],
		// });

		// return (result[0]?.results as { version: string }[] | undefined) ?? [];

		const response = await fetch(
			`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/d1/database/${process.env.CF_D1_DOCS_ID}/query`,
			{
				headers: {
					Authorization: `Bearer ${process.env.CF_D1_DOCS_API_KEY}`,
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify({
					sql: `select version from documentation where name = ? order by version desc;`,
					params: [packageName],
				}),
			},
		);

		const data = await response.json();

		return data.result[0]?.results;
	} catch {
		return [];
	}
}
