import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	// TODO: Remove this eventually
	if (request.nextUrl.pathname.startsWith('/guide/')) {
		const newUrl = request.nextUrl.clone();
		newUrl.pathname = newUrl.pathname.replace('/guide/', '/');
		return NextResponse.redirect(new URL(newUrl.pathname, request.url));
	}

	return NextResponse.redirect(new URL('/legacy', request.url));
}

export const config = {
	matcher: ['/', '/guide/:path*'],
};
