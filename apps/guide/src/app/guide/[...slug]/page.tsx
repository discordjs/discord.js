import { CgChevronLeft } from '@react-icons/all-files/cg/CgChevronLeft';
import { CgChevronRight } from '@react-icons/all-files/cg/CgChevronRight';
import { allContents } from 'contentlayer/generated';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Mdx } from '~/components/Mdx';

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
			<div className="mt-5 flex flex-col justify-between md:w-full md:flex-row space-y-2">
				{previous ? (
					<Link
						className="flex flex-row items-center rounded-lg bg-gray-200 px-3 py-2 text-black space-x-2 dark:bg-dark-200 hover-bg-gray-300 dark:text-white dark:hover:bg-dark-100"
						href={`/guide/${previous.slug}`}
					>
						<CgChevronLeft size={28} />
						<div className="flex flex-col">
							<p className="m-0 text-left text-lg font-bold">Previous Page</p>
							<p className="m-0 text-gray-5 dark:text-gray-4">{previous.title}</p>
						</div>
					</Link>
				) : (
					<div /> // Note we use an empty div here to keep the spacing correct
				)}
				{next && (
					<Link
						className="flex flex-row items-center justify-end rounded-lg bg-gray-200 px-3 py-2 text-black space-x-2 dark:bg-dark-200 hover:bg-gray-300 dark:text-white dark:hover:bg-dark-100"
						href={`/guide/${next.slug}`}
					>
						<div className="flex flex-col">
							<p className="m-0 text-right text-lg font-bold">Next Page</p>
							<p className="m-0 text-right text-gray-5 dark:text-gray-4">{next.title}</p>
						</div>
						<CgChevronRight size={28} />
					</Link>
				)}
			</div>
		</article>
	);
}
