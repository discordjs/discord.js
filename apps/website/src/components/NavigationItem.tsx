'use client';

import { useSetAtom } from 'jotai';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { isDrawerOpenAtom } from '@/stores/drawer';
import { cx } from '@/styles/cva';

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
			className={cx(
				'dark:hover:text-base-neutral-40 truncate rounded-lg p-2 font-mono transition-colors hover:bg-neutral-200 md:py-1 dark:text-[#83838b] dark:hover:bg-[#1d1d1e] dark:active:bg-[#27272b]',
				pathname === href &&
					'dark:text-base-neutral-40 bg-neutral-200 font-medium dark:bg-[#323235] dark:hover:bg-[#323235]',
			)}
			href={href}
			onClick={() => setDrawerOpen(false)}
			title={node.name}
		>
			{children}
		</Link>
	);
}
