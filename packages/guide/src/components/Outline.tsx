import type { MarkdownHeading } from 'astro';
import { useMemo } from 'react';
import { VscListSelection } from 'react-icons/vsc';

export function Outline({ headings }: { headings: MarkdownHeading[] }) {
	const headingItems = useMemo(
		() =>
			headings.map((heading) => (
				<a
					className="dark:border-dark-100 border-light-800 dark:hover:bg-dark-200 dark:active:bg-dark-100 hover:bg-light-700 active:bg-light-800 pl-6.5 focus:ring-width-2 focus:ring-blurple ml-[10px] border-l p-[5px] text-sm outline-0 focus:rounded focus:border-0 focus:ring"
					href={`#${heading.slug}`}
					key={heading.slug}
					style={{ paddingLeft: `${heading.depth * 14}px` }}
					title={heading.text}
				>
					<span className="line-clamp-1">{heading.text}</span>
				</a>
			)),
		[headings],
	);

	return (
		<div className="flex flex-col break-all p-3 pb-8">
			<div className="mt-4 ml-2 flex flex-row gap-2">
				<VscListSelection size={25} />
				<span className="font-semibold">Contents</span>
			</div>
			<div className="mt-4 ml-2 flex flex-col gap-2">
				<div className="flex flex-col">{headingItems}</div>
			</div>
		</div>
	);
}
