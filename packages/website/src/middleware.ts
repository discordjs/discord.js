import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
	return NextResponse.rewrite(new URL('/docs/main/packages/builders', request.url));
}

export const config = {
	matcher: ['/docs', '/docs/:branch', '/docs/:branch/packages'],
};
