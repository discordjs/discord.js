import { NextResponse, type NextRequest } from 'next/server';

export default async function middleware(request: NextRequest) {
	return NextResponse.redirect(new URL('/guide/home/introduction', request.url));
}

export const config = {
	matcher: ['/', '/guide'],
};
