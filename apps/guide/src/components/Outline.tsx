import type { MarkdownHeading } from 'astro';
import { useEffect, useMemo, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { VscListSelection } from 'react-icons/vsc';
import { useLocation } from 'react-use';

const LINK_HEIGHT = 30;
const INDICATOR_SIZE = 10;
const INDICATOR_OFFSET = (LINK_HEIGHT - INDICATOR_SIZE) / 2;

export function Outline({ headings }: { headings: MarkdownHeading[] }) {
	const state = useLocation();
	const [active, setActive] = useState(0);

	const headingItems = useMemo(
		() =>
			headings.map((heading, idx) => (
				<a
					className={`dark:border-dark-100 border-light-800 pl-6.5 focus:ring-width-2 focus:ring-blurple ml-[10px] border-l p-[5px] text-sm outline-0 focus:rounded focus:border-0 focus:ring ${
						idx === active
							? 'bg-blurple text-white'
							: 'dark:hover:bg-dark-200 dark:active:bg-dark-100 hover:bg-light-700 active:bg-light-800'
					}`}
					href={`#${heading.slug}`}
					key={heading.slug}
					style={{ paddingLeft: `${heading.depth * 14}px` }}
					title={heading.text}
				>
					<span className="line-clamp-1">{heading.text}</span>
				</a>
			)),
		[headings, active],
	);

	useEffect(() => {
		const idx = headings.findIndex((heading) => heading.slug === state.hash?.slice(1));
		if (idx >= 0) {
			setActive(idx);
		}
	}, [state, headings]);

	return (
		<Scrollbars
			autoHide
			hideTracksWhenNotNeeded
			renderThumbVertical={(props) => <div {...props} className="dark:bg-dark-100 bg-light-900 z-30 rounded" />}
			renderTrackVertical={(props) => (
				<div {...props} className="absolute top-0.5 right-0.5 bottom-0.5 z-30 w-1.5 rounded" />
			)}
			universal
		>
			<div className="flex flex-col break-all p-3 pb-8">
				<div className="mt-4 ml-2 flex flex-row gap-2">
					<VscListSelection size={25} />
					<span className="font-semibold">Contents</span>
				</div>
				<div className="mt-4 ml-2 flex flex-col gap-2">
					<div className="relative flex flex-col">
						<div
							className="bg-blurple absolute h-[10px] w-[10px] rounded-full border-2 border-black dark:border-white"
							style={{
								left: INDICATOR_SIZE / 2 + 0.5,
								transform: `translateY(${active * LINK_HEIGHT + INDICATOR_OFFSET}px)`,
							}}
						/>
						{headingItems}
					</div>
				</div>
			</div>
		</Scrollbars>
	);
}
