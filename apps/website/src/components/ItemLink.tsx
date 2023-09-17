'use client';

import type { LinkProps } from 'next/link';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { useCurrentPathMeta } from '~/hooks/useCurrentPathMeta';

export interface ItemLinkProps<T extends string> extends Omit<LinkProps<T>, 'href'> {
	readonly className?: string;
	/**
	 * The URI of the api item to link to. (e.g. `/RestManager`)
	 */
	readonly itemURI: string;

	/**
	 * The name of the package the item belongs to.
	 */
	readonly packageName?: string | undefined;
}

/**
 * A component that renders a link to an api item.
 *
 * @remarks
 * This component only needs the relative path to the item, and will automatically
 * generate the full path to the item client-side.
 */
export function ItemLink<T extends string>(props: PropsWithChildren<ItemLinkProps<T>>) {
	const pathname = usePathname();
	const { packageName, version } = useCurrentPathMeta();

	if (!pathname) {
		throw new Error('ItemLink must be used inside a Next.js page. (e.g. /docs/packages/foo/main)');
	}

	const { itemURI, packageName: pkgName, ...linkProps } = props;

	return <Link {...linkProps} href={`/docs/packages/${pkgName ?? packageName}/${version}/${itemURI}`} />;
}
