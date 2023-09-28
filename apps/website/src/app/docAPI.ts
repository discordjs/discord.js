import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { connect } from '@planetscale/database';

const sql = connect({
	url: process.env.DATABASE_URL!,
	async fetch(url, init) {
		delete init?.cache;
		return fetch(url, { ...init, next: { revalidate: 3_600 } });
	},
});

export async function fetchVersions(packageName: string): Promise<string[]> {
	if (process.env.NEXT_PUBLIC_LOCAL_DEV || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
		return ['main'];
	}

	const response = await fetch(`https://docs.discordjs.dev/api/info?package=${packageName}`, {
		next: { revalidate: 3_600 },
	});

	return response.json();
}

export async function fetchModelJSON(packageName: string, version: string): Promise<unknown> {
	if (process.env.NEXT_PUBLIC_LOCAL_DEV) {
		const res = await readFile(
			join(process.cwd(), '..', '..', 'packages', packageName, 'docs', 'docs.api.json'),
			'utf8',
		);

		try {
			return JSON.parse(res);
		} catch {
			console.log(res);
			return {};
		}
	}

	if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
		const { rows } = await sql.execute('select data from documentation where name = ? and version = ?', [
			packageName,
			'main',
		]);

		// @ts-expect-error: https://github.com/planetscale/database-js/issues/71
		return rows[0].data;
	}

	const { rows } = await sql.execute('select data from documentation where name = ? and version = ?', [
		packageName,
		version,
	]);

	// @ts-expect-error: https://github.com/planetscale/database-js/issues/71
	return rows[0].data;
}
