import { sql } from '@vercel/postgres';

export async function fetchVersions(packageName: string) {
	try {
		const { rows } = await sql<{
			version: string;
		}>`select version from documentation where name = ${packageName} order by version desc`;

		return rows;
	} catch {
		return [];
	}
}
