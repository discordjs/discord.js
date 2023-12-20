import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { fetchVersions } from '~/app/docAPI';

export async function GET(_: NextRequest, params: { package: string }) {
	return NextResponse.json(await fetchVersions(params.package));
}
