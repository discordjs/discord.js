import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { fetchVersions } from '~/app/docAPI';

export async function GET(req: NextRequest) {
	const packageName = req.nextUrl.pathname.split('/').slice(2, 3)[0] ?? 'discord.js';
	return NextResponse.json(await fetchVersions(packageName));
}
