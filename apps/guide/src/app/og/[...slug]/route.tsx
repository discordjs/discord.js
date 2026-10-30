import { generateOGImage } from 'fumadocs-ui/og';
import { notFound } from 'next/navigation';
import pRetry, { AbortError } from 'p-retry';
import { source } from '@/lib/source';

export function generateStaticParams() {
	return source.generateParams().map((page) => ({
		...page,
		slug: [...page.slug, 'image.png'],
	}));
}

async function loadGoogleFont(font: string, text: string) {
	return pRetry(
		async () => {
			const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
			const css = await (await fetch(url)).text();
			// eslint-disable-next-line prefer-named-capture-group
			const resource = /src: url\((.+)\) format\('(opentype|truetype)'\)/.exec(css);

			if (resource) {
				const response = await fetch(resource[1]!);
				if (response.status === 200) {
					return response.arrayBuffer();
				}
			}

			throw new AbortError('failed to load font data');
		},
		{
			retries: 3,
		},
	);
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
	const { slug } = await params;
	const page = source.getPage(slug.slice(0, -1));

	if (!page) {
		notFound();
	}

	return generateOGImage({
		title: page.data.title,
		description: page.data.description,
		site: 'discord.js Guide',
		fonts: [
			{
				name: 'Geist',
				data: await loadGoogleFont('Geist:wght@400', page.data.title),
				weight: 400,
				style: 'normal',
			},
		],
	});
}
