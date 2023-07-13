'use client';

import { Scrollbars } from './Scrollbars';
import type { TableOfContentsSerialized } from './TableOfContentItems';
import { TableOfContentItems } from './TableOfContentItems';

export function Outline({ members }: { members: TableOfContentsSerialized[] }) {
	return (
		<aside className="fixed bottom-0 right-0 top-[50px] z-20 hidden h-[calc(100vh_-_65px)] w-64 border-l border-light-800 bg-white pr-2 xl:block dark:border-dark-100 dark:bg-dark-600">
			<Scrollbars
				autoHide
				hideTracksWhenNotNeeded
				renderThumbVertical={(props) => <div {...props} className="z-30 rounded bg-light-900 dark:bg-dark-100" />}
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
