'use client';

import { useOutline } from '~/contexts/outline';
import { Scrollbars } from './Scrollbars';
import { TableOfContentItems } from './TableOfContentItems';

export function Outline() {
	const { members } = useOutline();

	if (!members) {
		return null;
	}

	return (
		<div className="lg:sticky lg:top-23 lg:h-[calc(100vh_-_105px)]">
			<aside className="fixed bottom-4 left-4 right-4 top-22 z-20 mx-auto hidden max-w-5xl border border-light-900 rounded-md bg-white/75 shadow backdrop-blur-md lg:sticky lg:block lg:h-full lg:max-w-xs lg:min-w-xs lg:w-full dark:border-dark-100 dark:bg-dark-600/75">
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
					<TableOfContentItems serializedMembers={members} />
				</Scrollbars>
			</aside>
		</div>
	);
}
