import { allContents } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import { Mdx } from '~/components/Mdx';
import { PageButton } from '~/components/PageButton';

export async function generateStaticParams() {
	return allContents.map((content) => ({ slug: [content.slug] }));
}

export default function Page({ params }: { params: { slug: string[] } }) {
	const content = allContents.find((content) => content.slug === params.slug?.join('/'));
	const next = content ? allContents[(allContents.indexOf(content) as number) + 1] : null;
	const previous = content ? allContents[(allContents.indexOf(content) as number) - 1] : null;

	if (!content) {
		notFound();
	}

	return (
		<article className="max-w-none prose">
			<Mdx code={content?.body.code ?? ''} />
			<div className="mt-10 flex flex-col justify-between md:w-full md:flex-row sm:space-y-2">
				{previous ? (
					<PageButton direction="prev" href={`/guide/${previous.slug}`} title={previous.title} />
				) : (
					<div /> // Note we use an empty div here to keep the spacing correct
				)}
				{next ? <PageButton direction="next" href={`/guide/${next.slug}`} title={next.title} /> : null}
			</div>
		</article>
	);
}
