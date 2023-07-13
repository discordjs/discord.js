'use client';

import { Scrollbars } from 'react-custom-scrollbars-2';
import { Sidebar } from './Sidebar';
import { useNav } from '~/contexts/nav';

export function Nav() {
	const { opened } = useNav();

	return (
		<nav
			className={`dark:bg-dark-600/75 dark:border-dark-100 border-light-900 top-22 fixed bottom-4 left-4 right-4 z-20 mx-auto max-w-5xl rounded-md border bg-white/75 shadow backdrop-blur-md ${
				opened ? 'block' : 'hidden'
			} lg:min-w-xs lg:sticky lg:block lg:h-full lg:w-full lg:max-w-xs`}
		>
			<Scrollbars
				autoHide
				className="[&>div]:overscroll-none"
				hideTracksWhenNotNeeded
				renderThumbVertical={(props) => <div {...props} className="z-30 rounded bg-light-900 dark:bg-dark-100" />}
				renderTrackVertical={(props) => (
					<div {...props} className="absolute bottom-0.5 right-0.5 top-0.5 z-30 w-1.5 rounded" />
				)}
				universal
			>
				<Sidebar />
			</Scrollbars>
		</nav>
	);
}
