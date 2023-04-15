'use client';

import { allContents } from 'contentlayer/generated';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Section } from './Section';
import { useNav } from '~/contexts/nav';

const items = allContents.map((content) => ({
	title: content.title,
	category: content.category,
	slug: content.slug,
	href: content.url,
}));

function transformItemsByCategory(allContents: typeof items) {
	return allContents.reduce<Record<string, typeof items>>((accumulator: any, content) => {
		if (!accumulator[content.category]) {
			accumulator[content.category] = [];
		}

		accumulator[content.category].push(content);
		return accumulator;
	}, {});
}

const itemsByCategory = transformItemsByCategory(items);

export function Sidebar() {
	const pathname = usePathname();
	const { setOpened } = useNav();

	return (
		<div className="flex flex-col gap-3 p-3">
			{Object.keys(itemsByCategory).map((category, idx) => (
				<Section
					buttonClassName="bg-light-600 hover:bg-light-700 active:bg-light-800 dark:bg-dark-400 dark:hover:bg-dark-300 dark:active:bg-dark-400 focus:ring-width-2 focus:ring-blurple rounded p-3 outline-0 focus:ring"
					key={`${category}-${idx}`}
					title={category}
				>
					{itemsByCategory[category]?.map((member, index) => (
						<Link
							className={`dark:border-dark-100 border-light-800 focus:ring-width-2 focus:ring-blurple ml-5 flex flex-col border-l p-[5px] pl-6 outline-0 focus:rounded focus:border-0 focus:ring ${
								decodeURIComponent(pathname ?? '') === member.href
									? 'bg-blurple text-white'
									: 'dark:hover:bg-dark-200 dark:active:bg-dark-100 hover:bg-light-700 active:bg-light-800'
							}`}
							href={member.href}
							key={`${member.title}-${index}`}
							onClick={() => setOpened(false)}
							title={member.title}
						>
							<div className="flex flex-row place-items-center gap-2 lg:text-sm">
								<span className="truncate">{member.title}</span>
							</div>
						</Link>
					))}
				</Section>
			))}
		</div>
	);
}
