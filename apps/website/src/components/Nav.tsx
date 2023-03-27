'use client';

import dynamic from 'next/dynamic';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { Sidebar } from './Sidebar';
import type { SidebarSectionItemData } from './Sidebar';
import { useNav } from '~/contexts/nav';

const PackageSelect = dynamic(async () => import('./PackageSelect'));
const VersionSelect = dynamic(async () => import('./VersionSelect'));

export function Nav({ members }: { members: SidebarSectionItemData[] }) {
	const { opened } = useNav();

	return (
		<nav
			className={`dark:bg-dark-600 dark:border-dark-100 border-light-800 fixed top-[65px] left-0 bottom-0 z-20 h-[calc(100vh_-_65px)] w-full border-r bg-white ${
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
				<div className="flex flex-col gap-3 px-3 pt-3">
					<PackageSelect />
					<VersionSelect />
				</div>
				<Sidebar members={members} />
			</Scrollbars>
		</nav>
	);
}
