import { get } from '@vercel/edge-config';
import { sql } from '@vercel/postgres';
import { NextResponse, type NextRequest } from 'next/server';
import { PACKAGES } from './util/constants';

async function fetchLatestVersion(packageName: string): Promise<string> {
	if (process.env.NEXT_PUBLIC_LOCAL_DEV === 'true' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
		return 'main';
	}

	const { rows } = await sql`select version from documentation where name = ${packageName} order by version desc`;

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
