import { allContents } from 'contentlayer/generated';
import { redirect } from 'next/navigation';
import { Mdx } from '~/components/Mdx';

export async function generateStaticParams() {
	return allContents.map((content) => ({ slug: [content.slug] }));
}

export default function Page({ params }: { params: { slug: string[] } }) {
	const content = allContents.find((content) => content.slug === params.slug?.join('/'));

	if (!content) {
		redirect('/guide/home/introduction');
	}

	return (
		<article className="prose max-w-none">
			<Mdx code={content?.body.code ?? ''} />
		</article>
	);
}
