import { NextResponse, type NextRequest } from 'next/server';
import { fetchEntryPoints } from '@/util/fetchEntryPoints';

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const packageName = searchParams.get('packageName');
	const version = searchParams.get('version');

	if (!packageName || !version) {
		return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
	}

	const response = await fetchEntryPoints(packageName, version);

	return NextResponse.json(response);
}
