'use client';

import { useAtom } from 'jotai';
import { ChevronUp } from 'lucide-react';
import { useEffect, type PropsWithChildren } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { Drawer as Vaul } from 'vaul';
import { isDrawerOpenAtom } from '~/stores/drawer';

export function Drawer({ children }: PropsWithChildren) {
	const [open, setOpen] = useAtom(isDrawerOpenAtom);
	const isMedium = useMediaQuery('(min-width: 768px)');

	useEffect(() => {
		if (isMedium) {
			setOpen(false);
		}
	}, [isMedium, setOpen]);

	return (
		<Vaul.Root open={open} onOpenChange={setOpen}>
			<Vaul.Trigger
				aria-label="Open navigation"
				className="flex h-12 w-full place-content-center place-items-center rounded-t-lg border-t border-neutral-300 bg-neutral-100 p-2 dark:border-neutral-700 dark:bg-neutral-900"
			>
				<ChevronUp aria-hidden size={28} />
			</Vaul.Trigger>
			<Vaul.Portal>
				<Vaul.Overlay className="fixed inset-0 bg-black/40" />
				<Vaul.Content className="fixed bottom-0 left-0 right-0 flex max-h-[86%] flex-col rounded-t-lg bg-neutral-100 p-4 dark:bg-neutral-900">
					<div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-neutral-400" />
					{children}
				</Vaul.Content>
			</Vaul.Portal>
		</Vaul.Root>
	);
}
