import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { sql } from '@vercel/postgres';

export const fetchVersions = async (packageName: string): Promise<string[]> => {
	if (process.env.NEXT_PUBLIC_LOCAL_DEV === 'true' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
		return ['main'];
	}

	try {
		const { rows } = await sql`select version from documentation where name = ${packageName} order by version desc`;

		return rows.map((row) => row.version);
	} catch {
		return [];
	}
};

export const fetchModelJSON = async (packageName: string, version: string) => {
	if (process.env.NEXT_PUBLIC_LOCAL_DEV === 'true') {
		try {
			const res = await readFile(
				join(process.cwd(), '..', '..', 'packages', packageName, 'docs', 'docs.api.json'),
				'utf8',
			);

			return JSON.parse(res);
		} catch {
			return null;
		}
	}

	if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
		try {
			const { rows } = await sql`select url from documentation where name = ${packageName} and version = ${'main'}`;
			const res = await fetch(rows[0]?.url ?? '');

			return await res.json();
		} catch {
			return null;
		}
	}

	try {
		const { rows } = await sql`select url from documentation where name = ${packageName} and version = ${version}`;
		const res = await fetch(rows[0]?.url ?? '');

		return await res.json();
	} catch {
		return null;
	}
};
