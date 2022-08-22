import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
	return NextResponse.redirect(new URL('/docs/packages/builders/main', request.url));
}

export const config = {
	matcher: ['/docs'],
};
