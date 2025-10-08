import { generateOGImage } from 'fumadocs-ui/og';
import { notFound } from 'next/navigation';
import { source } from '@/lib/source';

export function generateStaticParams() {
	return source.generateParams().map((page) => ({
		...page,
		slug: [...page.slug, 'image.png'],
	}));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
	const { slug } = await params;
	const page = source.getPage(slug.slice(0, -1));
	// const fontData = await fetch(new URL('../../assets/Geist-Regular.ttf', import.meta.url), {
	// next: { revalidate: 604_800 },
	// }).then(async (res) => res.arrayBuffer());

	if (!page) {
		notFound();
	}

	return generateOGImage({
		title: page.data.title,
		description: page.data.description,
		site: 'discord.js Guide',
		// fonts: [
		// 	{
		// 		name: 'Geist',
		// 		data: fontData,
		// 		weight: 900,
		// 		style: 'normal',
		// 	},
		// ],
	});
}
