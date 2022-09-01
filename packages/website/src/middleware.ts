import { NextResponse, type NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
	return NextResponse.redirect(new URL('/docs/packages', request.url));
}

export const config = {
	matcher: ['/docs'],
};
