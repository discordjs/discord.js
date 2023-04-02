import { get } from '@vercel/edge-config';
import { NextResponse } from 'next/server';
import type { ServerRuntime } from 'next/types';

export const runtime: ServerRuntime = 'edge';

export async function GET() {
	try {
		const url = await get<string>('DISCORD_WEBHOOK_URL');
		const imageUrl = await get<string>('IT_IS_WEDNESDAY_MY_DUDES');
		if (url && imageUrl) {
			await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: 'It is wednesday, my dudes',
					embeds: [
						{
							image: {
								url: imageUrl,
							},
						},
					],
				}),
			});
		}
	} catch {}

	return NextResponse.json({ message: 'It is wednesday, my dudes' });
}
