import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
	const packages = ['builders', 'collection', 'proxy', 'rest', 'voice'];
	if (packages.some((pkg) => request.nextUrl.pathname.includes(pkg))) {
		return NextResponse.redirect(new URL('/docs/packages/collection/Collection', request.url));
	}
	return NextResponse.next();
}
