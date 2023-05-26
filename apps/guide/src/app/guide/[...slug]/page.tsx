import { allContents } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { Mdx } from '~/components/Mdx';
import { serializeHeadings } from '~/util/heading-node';

export async function generateStaticParams() {
	return allContents.map((content) => ({ slug: [content.slug] }));
}

export default function Page({ params }: { params: { slug: string[] } }) {
	const content = allContents.find((content) => content.slug === params.slug?.join('/'));
	if (!content) {
		notFound();
	}

	const headings = serializeHeadings(content.headings);

	// TODO Render headings in table of contents

	return (
		<article className="max-w-none px-5 prose">
			<Mdx code={content?.body.code ?? ''} />
		</article>
	);
}
