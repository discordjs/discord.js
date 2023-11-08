import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { connect } from '@planetscale/database';
import { cache } from 'react';
import { N_RECENT_VERSIONS } from '~/util/constants';

const sql = connect({
	url: process.env.DATABASE_URL!,
	async fetch(url, init) {
		delete init?.cache;
		return fetch(url, { ...init, next: { revalidate: 3_600 } });
	},
});

export const fetchVersions = cache(async (packageName: string): Promise<string[]> => {
	if (process.env.NEXT_PUBLIC_LOCAL_DEV || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
		return ['main'];
	}

	const { rows } = await sql.execute('select version from documentation where name = ? order by version desc', [
		packageName,
	]);

	// @ts-expect-error: https://github.com/planetscale/database-js/issues/71
	return rows.map((row) => row.version).slice(0, N_RECENT_VERSIONS);
});

export const fetchModelJSON = cache(async (packageName: string, version: string) => {
	if (process.env.NEXT_PUBLIC_LOCAL_DEV) {
		let res;

		try {
			res = await readFile(join(process.cwd(), '..', '..', 'packages', packageName, 'docs', 'docs.api.json'), 'utf8');

			return JSON.parse(res);
		} catch {
			console.log(res);
			return null;
		}
	}

	if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
		const { rows } = await sql.execute('select data from documentation where name = ? and version = ?', [
			packageName,
			'main',
		]);

		// @ts-expect-error: https://github.com/planetscale/database-js/issues/71
		return rows[0]?.data ?? null;
	}

	const { rows } = await sql.execute('select data from documentation where name = ? and version = ?', [
		packageName,
		version,
	]);

	// @ts-expect-error: https://github.com/planetscale/database-js/issues/71
	return rows[0]?.data ?? null;
});
