import { connect } from '@planetscale/database';
import { get } from '@vercel/edge-config';
import { NextResponse, type NextRequest } from 'next/server';
import { PACKAGES } from './util/constants';

const sql = connect({
	url: process.env.DATABASE_URL!,
	async fetch(url, init) {
		delete init?.cache;
		return fetch(url, { ...init, next: { revalidate: 3_600 } });
	},
});

async function fetchLatestVersion(packageName: string): Promise<string> {
	if (process.env.NEXT_PUBLIC_LOCAL_DEV || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
		return 'main';
	}

	const { rows } = await sql.execute('select version from documentation where name = ? order by version desc', [
		packageName,
	]);

	// @ts-expect-error: https://github.com/planetscale/database-js/issues/71
	return rows.map((row) => row.version).at(1) ?? 'main';
}

export default async function middleware(request: NextRequest) {
	if (request.nextUrl.pathname === '/docs') {
		try {
			const skip = await get<boolean>('SKIP_PACKAGE_VERSION_SELECTION');
			if (skip) {
				const latestVersion = await fetchLatestVersion('discord.js');
				return NextResponse.redirect(new URL(`/docs/packages/discord.js/${latestVersion}`, request.url));
			}
		} catch {}
	}

	if (PACKAGES.some((pkg) => request.nextUrl.pathname.includes(pkg))) {
		// eslint-disable-next-line prefer-named-capture-group
		const packageName = /\/docs\/packages\/([^/]+)\/.*/.exec(request.nextUrl.pathname)?.[1] ?? 'discord.js';
		const latestVersion = await fetchLatestVersion(packageName);
		return NextResponse.redirect(new URL(request.nextUrl.pathname.replace('stable', latestVersion), request.url));
	}

	return NextResponse.redirect(new URL('/docs/packages', request.url));
}

export const config = {
	matcher: ['/docs', '/docs/packages/:package/stable/:member*'],
};
