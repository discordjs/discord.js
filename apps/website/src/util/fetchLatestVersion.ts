import { sql } from '@vercel/postgres';

export async function fetchLatestVersion(packageName: string): Promise<string> {
	const { rows } = await sql`select version from documentation where name = ${packageName} order by version desc`;

	return rows.map((row) => row.version).at(1) ?? 'main';
}
