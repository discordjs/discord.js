'use client';

import { VscChevronLeft } from '@react-icons/all-files/vsc/VscChevronLeft';
import { Button } from 'ariakit/button';
import { useNav } from '~/contexts/nav';
import { useOutline } from '~/contexts/outline';
import { Scrollbars } from './Scrollbars';
import { TableOfContentItems } from './TableOfContentItems';

export function Outline() {
	const { members, opened, setOpened: setOutlineOpened } = useOutline();
	const { opened: navOpened, setOpened } = useNav();

	if (!members) {
		return null;
	}

	return (
		<div className="lg:sticky lg:top-23 lg:h-[calc(100vh_-_105px)]">
			<aside
				className={`fixed block bottom-4 top-22 z-20 mx-auto max-w-5xl border border-light-900 rounded-md bg-white/75 shadow backdrop-blur-md transition-all duration-300 ${
					opened ? 'left-4 right-4 ' : 'left-full -right-[calc(100vw_-_32px)]'
				} lg:sticky lg:h-full lg:max-w-xs lg:min-w-xs lg:w-full dark:border-dark-100 dark:bg-dark-600/75`}
			>
				<Button
					aria-label="Menu"
					className={`absolute top-1/2 z-1 h-8 w-6 flex transition-all duration-300 flex-row transform-gpu cursor-pointer select-none appearance-none place-items-center border-0 rounded bg-transparent p-0 text-sm font-semibold leading-none no-underline outline-none ${
						opened ? 'left-1 rotate-180' : navOpened ? 'left-1' : '-left-6'
					} active:translate-y-px lg:hidden`}
					onClick={() => {
						setOpened(false);
						setOutlineOpened((open) => !open);
					}}
				>
					<VscChevronLeft viewBox="0 0 16 16" size={24} />
				</Button>
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
