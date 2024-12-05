import { sql } from '@vercel/postgres';
import { ENV } from './env';

export async function fetchLatestVersion(packageName: string): Promise<string> {
	if (ENV.IS_LOCAL_DEV) {
		return 'main';
	}

	try {
		const { rows } = await sql`select version from documentation where name = ${packageName} order by version desc`;

		return rows.map((row) => row.version).at(1) ?? 'main';
	} catch {
		return '';
	}
}
