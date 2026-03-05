'use client';

import { useSetAtom } from 'jotai';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
	const router = useRouter();
	const pathname = usePathname();
	const setDrawerOpen = useSetAtom(isDrawerOpenAtom);

	const href = `/docs/packages/${packageName}/${version}/${node.href}`;

	return (
		<Link
			className={cx(
				'dark:hover:text-base-neutral-40 hover:text-base-neutral-900 truncate rounded-lg p-2 font-mono text-[#676771] transition-colors hover:bg-[#e7e7e9] active:bg-[#e4e4e7] md:py-1 dark:text-[#83838b] dark:hover:bg-[#1d1d1e] dark:active:bg-[#27272b]',
				pathname === href &&
					'dark:text-base-neutral-40 text-base-neutral-900 bg-[#d9d9dc] font-medium dark:bg-[#323235] dark:hover:bg-[#323235]',
			)}
			href={href}
			onClick={() => setDrawerOpen(false)}
			onMouseEnter={() => router.prefetch(href)}
			onTouchStart={() => router.prefetch(href)}
			prefetch={false}
			title={node.name}
			// @ts-expect-error - unstable_dynamicOnHover is not part of the public types
			unstable_dynamicOnHover
		>
			{children}
		</Link>
	);
}
