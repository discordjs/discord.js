import { Scrollbars } from 'react-custom-scrollbars-2';
import type { MDXPage } from './SidebarItems.jsx';

export function Sidebar({ pages, opened }: { opened: boolean; pages?: MDXPage[] | undefined }) {
	return (
		<nav
			className={`h-[calc(100vh - 65px)] dark:bg-dark-600 dark:border-dark-100 border-light-800 fixed top-[65px] left-0 bottom-0 z-20 w-full border-r bg-white ${
				opened ? 'block' : 'hidden'
			} lg:w-76 lg:max-w-76 lg:block`}
		>
			<Scrollbars
				autoHide
				hideTracksWhenNotNeeded
				renderThumbVertical={(props) => <div {...props} className="dark:bg-dark-100 bg-light-900 z-30 rounded" />}
				renderTrackVertical={(props) => (
					<div {...props} className="absolute top-0.5 right-0.5 bottom-0.5 z-30 w-1.5 rounded" />
				)}
				universal
			>
				{pages ?? null}
			</Scrollbars>
		</nav>
	);
}
