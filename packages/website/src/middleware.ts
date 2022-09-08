import { NextResponse, type NextRequest } from 'next/server';
import { PACKAGES } from './util/constants';

export default async function middleware(request: NextRequest) {
	if (PACKAGES.some((pkg) => request.nextUrl.pathname.includes(pkg))) {
		const packageName = /\/docs\/packages\/([^/]+)\/.*/.exec(request.nextUrl.pathname)?.[1] ?? 'builders';
		const res = await fetch(`https://docs.discordjs.dev/api/info?package=${packageName}`);
		const data: string[] = await res.json();

		const latestVersion = data.at(-2);
		return NextResponse.redirect(
			new URL(request.nextUrl.pathname.replace('stable', latestVersion ?? 'main'), request.url),
		);
	}

	return NextResponse.redirect(new URL('/docs/packages', request.url));
}

export const config = {
	matcher: ['/docs', '/docs/packages/:package/stable/:member*'],
};
