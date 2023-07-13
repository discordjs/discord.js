import { get } from '@vercel/edge-config';
import { NextResponse, type NextRequest } from 'next/server';
import { PACKAGES } from './util/constants';

async function fetchLatestVersion(packageName: string) {
	const res = await fetch(`https://docs.discordjs.dev/api/info?package=${packageName}`, { cache: 'no-store' });
	const data: string[] = await res.json();

	return data.at(-2);
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

	if (request.nextUrl.pathname.includes('discord.js')) {
		return NextResponse.redirect('https://old.discordjs.dev/#/docs/discord.js');
	}

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
	matcher: ['/docs', '/docs/packages/discord.js(.*)?', '/docs/packages/:package/stable/:member*'],
};
