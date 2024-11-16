'use client';

import { useSetAtom } from 'jotai';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { isDrawerOpenAtom } from '~/stores/drawer';

export function NavigationItem({
	node,
	packageName,
	version,
	children,
}: PropsWithChildren<{
	readonly node: any;
	readonly packageName: string;
	readonly version: string;
}>) {
	const pathname = usePathname();
	const setDrawerOpen = useSetAtom(isDrawerOpenAtom);

	const href = `/docs/packages/${packageName}/${version}/${node.href}`;

	return (
		<Link
			className={`truncate rounded-md p-2 font-mono transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-800 md:px-1 md:py-1 ${pathname === href ? 'bg-neutral-200 font-medium text-blurple dark:bg-neutral-800' : ''}`}
			href={href}
			title={node.name}
			onClick={() => setDrawerOpen(false)}
		>
			{children}
		</Link>
	);
}
