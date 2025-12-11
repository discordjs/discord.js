import { NextResponse, type NextRequest } from 'next/server';
import { fetchSitemap } from '@/util/fetchSitemap';

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const packageName = searchParams.get('packageName');
	const version = searchParams.get('version');
	const entryPoint = searchParams.get('entryPoint');

	if (!packageName || !version) {
		return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
	}

	const response = await fetchSitemap({
		entryPoint,
		packageName,
		version,
	});

	return NextResponse.json(response);
}
