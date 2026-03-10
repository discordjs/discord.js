import { NextResponse, type NextRequest } from 'next/server';
import { PACKAGES } from '@/util/constants';
import { fetchLatestVersion } from '@/util/fetchLatestVersion';

export default async function middleware(request: NextRequest) {
	if (request.nextUrl.pathname === '/docs') {
		const latestVersion = await fetchLatestVersion('bot');
		return NextResponse.redirect(new URL(`/docs/packages/bot/${latestVersion}`, request.url));
	}

	if (PACKAGES.some((pkg) => request.nextUrl.pathname.includes(pkg.name))) {
		// eslint-disable-next-line prefer-named-capture-group
		const packageName = /\/docs\/packages\/([^/]+)\/.*/.exec(request.nextUrl.pathname)?.[1] ?? 'bot';
		const latestVersion = await fetchLatestVersion(packageName);
		return NextResponse.redirect(new URL(request.nextUrl.pathname.replace('stable', latestVersion), request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/docs', '/docs/packages/:package/stable/:member*'],
};
