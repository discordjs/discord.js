import { allContents } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { Mdx } from '~/components/Mdx';

export async function generateStaticParams() {
	return allContents.map((content) => ({ slug: [content.slug] }));
}

export default function Page({ params }: { params: { slug: string[] } }) {
	const content = allContents.find((content) => content.slug === params.slug?.join('/'));
	if (!content) {
		notFound();
	}

	// TODO Render headings in table of contents
	// const headings = serializeHeadings(content.headings);

	return (
		<article className="max-w-none px-5 prose">
			<Mdx code={content?.body.code ?? ''} />
		</article>
	);
}
