'use client';

import { useSetAtom } from 'jotai';
import { Command, Search } from 'lucide-react';
import { isCmdKOpenAtom } from '@/stores/cmdk';
import { useSidebar } from './ui/Sidebar';

export function SearchButton() {
	const { setOpenMobile } = useSidebar();
	const setIsOpen = useSetAtom(isCmdKOpenAtom);

	return (
		<button
			aria-label="Open search"
			className="bg-base-neutral-100 dark:bg-base-neutral-900 flex place-content-between place-items-center rounded-sm p-2"
			onClick={() => {
				setOpenMobile(false);
				setIsOpen(true);
			}}
			type="button"
		>
			<span className="flex place-items-center gap-2">
				<Search aria-hidden size={18} />
				Search...
			</span>
			<span className="hidden place-items-center gap-1 md:flex">
				<Command aria-hidden size={18} /> K
			</span>
		</button>
	);
}
