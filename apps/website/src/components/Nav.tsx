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
			className={`dark:bg-dark/75 dark:border-dark-100 border-light-900 top-22 fixed bottom-4 left-4 right-4 z-20 mx-auto max-w-5xl rounded-md border bg-white/75 shadow backdrop-blur-md ${
				opened ? 'block' : 'hidden'
			} lg:min-w-xs lg:sticky lg:block lg:h-full lg:w-full lg:max-w-xs`}
		>
			<Scrollbars
				autoHide
				className="[&>div]:overscroll-none"
				hideTracksWhenNotNeeded
				renderThumbVertical={(props) => <div {...props} className="dark:bg-dark-100 bg-light-900 z-30 rounded" />}
				renderTrackVertical={(props) => (
					<div {...props} className="absolute bottom-0.5 right-0.5 top-0.5 z-30 w-1.5 rounded" />
				)}
				universal
			>
				<div className="flex flex-col gap-4 p-3">
					<PackageSelect />
					<VersionSelect />
				</div>
				<Sidebar members={members} />
			</Scrollbars>
		</nav>
	);
}
