'use client';

import { useSetAtom } from 'jotai';
import { Command, Search } from 'lucide-react';
import { isCmdKOpenAtom } from '~/stores/cmdk';

export function SearchButton() {
	const setIsOpen = useSetAtom(isCmdKOpenAtom);

	return (
		<button
			aria-label="Open search"
			className="flex place-content-between place-items-center rounded-md bg-neutral-200 p-2 dark:bg-neutral-800"
			type="button"
			onClick={() => setIsOpen(true)}
		>
			<span className="flex place-items-center gap-2">
				<Search aria-hidden size={20} />
				Search...
			</span>
			<span className="hidden place-items-center gap-1 md:flex">
				<Command aria-hidden size={20} /> K
			</span>
		</button>
	);
}
