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

async function fetchLatestVersion(packageName: string) {
	if (process.env.NEXT_PUBLIC_LOCAL_DEV || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
		return 'main';
	}

	const { rows } = await sql.execute('select version from documentation where name = ? order by version desc', [
		packageName,
	]);

	// @ts-expect-error: https://github.com/planetscale/database-js/issues/71
	return rows.map((row) => row.version).at(1);
}

export default async function middleware(request: NextRequest) {
	if (request.nextUrl.pathname === '/docs') {
		try {
			const skip = await get<boolean>('SKIP_PACKAGE_VERSION_SELECTION');
			if (skip) {
				const latestVersion = await fetchLatestVersion('core');
				return NextResponse.redirect(new URL(`/docs/packages/core/${latestVersion}`, request.url));
			}
		} catch {}
	}

	/* if (request.nextUrl.pathname.includes('discord.js')) {
		return NextResponse.redirect('https://old.discordjs.dev/#/docs/discord.js');
	} */

	if (PACKAGES.some((pkg) => request.nextUrl.pathname.includes(pkg))) {
		// eslint-disable-next-line prefer-named-capture-group
		const packageName = /\/docs\/packages\/([^/]+)\/.*/.exec(request.nextUrl.pathname)?.[1] ?? 'core';
		const latestVersion = await fetchLatestVersion(packageName);
		return NextResponse.redirect(
			new URL(request.nextUrl.pathname.replace('stable', latestVersion ?? 'main'), request.url),
		);
	}

	return NextResponse.redirect(new URL('/docs/packages', request.url));
}

export const config = {
	matcher: ['/docs', /* '/docs/packages/discord.js(.*)?',*/ '/docs/packages/:package/stable/:member*'],
};
