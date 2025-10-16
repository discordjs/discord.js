import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	// TODO: Remove this eventually
	if (request.nextUrl.pathname.startsWith('/guide/')) {
		const newUrl = request.nextUrl.clone();
		newUrl.pathname = newUrl.pathname.replace('/guide/', '/');
		return NextResponse.redirect(new URL(newUrl.pathname, request.url));
	}

	// Redirect old urls to /legacy
	if (!request.nextUrl.pathname.startsWith('/legacy') && !request.nextUrl.pathname.startsWith('/voice')) {
		const newUrl = request.nextUrl.clone();
		newUrl.pathname = `/legacy${newUrl.pathname}`;
		return NextResponse.redirect(new URL(newUrl.pathname, request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next|api|og|.*\\..*|_static).*)'],
};
