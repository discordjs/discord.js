'use client';

import { Scrollbars } from './Scrollbars';
import type { TableOfContentsSerialized } from './TableOfContentItems';
import { TableOfContentItems } from './TableOfContentItems';

export function Outline({ members }: { members: TableOfContentsSerialized[] }) {
	return (
		<aside className="dark:bg-dark-600 dark:border-dark-100 border-light-800 fixed bottom-0 right-0 top-[50px] z-20 hidden h-[calc(100vh_-_65px)] w-64 border-l bg-white pr-2 xl:block">
			<Scrollbars
				autoHide
				hideTracksWhenNotNeeded
				renderThumbVertical={(props) => <div {...props} className="dark:bg-dark-100 bg-light-900 z-30 rounded" />}
				renderTrackVertical={(props) => (
					<div {...props} className="absolute bottom-0.5 right-0.5 top-0.5 z-30 w-1.5 rounded" />
				)}
				universal
			>
				<TableOfContentItems serializedMembers={members} />
			</Scrollbars>
		</aside>
	);
}
