import { sql } from '@vercel/postgres';
import { NextResponse, type NextRequest } from 'next/server';
import { PACKAGES } from './util/constants';
import { ENV } from './util/env';

async function fetchLatestVersion(packageName: string): Promise<string> {
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

export default async function middleware(request: NextRequest) {
	if (request.nextUrl.pathname === '/docs') {
		const latestVersion = await fetchLatestVersion('discord.js');
		return NextResponse.redirect(new URL(`/docs/packages/discord.js/${latestVersion}`, request.url));
	}

	if (PACKAGES.some((pkg) => request.nextUrl.pathname.includes(pkg.name))) {
		// eslint-disable-next-line prefer-named-capture-group
		const packageName = /\/docs\/packages\/([^/]+)\/.*/.exec(request.nextUrl.pathname)?.[1] ?? 'discord.js';
		const latestVersion = await fetchLatestVersion(packageName);
		return NextResponse.redirect(new URL(request.nextUrl.pathname.replace('stable', latestVersion), request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/docs', '/docs/packages/:package/stable/:member*'],
};
