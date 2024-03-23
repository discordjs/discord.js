import { sql } from '@vercel/postgres';
import { ENV } from './env';

export async function fetchVersions(packageName: string) {
	if (ENV.IS_LOCAL_DEV) {
		return [{ version: 'main' }];
	}

	try {
		const { rows } = await sql<{
			version: string;
		}>`select version from documentation where name = ${packageName} order by version desc`;

		return rows;
	} catch {
		return [];
	}
}
