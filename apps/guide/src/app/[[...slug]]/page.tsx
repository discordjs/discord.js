import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';

export async function generateStaticParams() {
	return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }): Promise<Metadata> {
	const params = await props.params;
	const page = source.getPage(params.slug);

	if (!page) {
		notFound();
	}

	const image = ['/og', ...(params.slug ?? []), 'image.png'].join('/');
	return {
		title: page.data.title,
		description: page.data.description,
		openGraph: {
			images: image,
		},
		twitter: {
			card: 'summary_large_image',
			images: image,
		},
	};
}

export default async function Page(props: { readonly params: Promise<{ slug?: string[] }> }) {
	const params = await props.params;
	const page = source.getPage(params.slug);

	if (!page) {
		notFound();
	}

	const MDX = page.data.body;

	return (
		<DocsPage full={page.data.full!} toc={page.data.toc}>
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription>{page.data.description}</DocsDescription>
			<DocsBody>
				{/* eslint-disable-next-line @stylistic/jsx-pascal-case */}
				<MDX components={getMDXComponents()} />
			</DocsBody>
		</DocsPage>
	);
}
