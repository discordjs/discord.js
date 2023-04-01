'use client';

import type { LinkProps } from 'next/link';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { useCurrentPathMeta } from '~/hooks/useCurrentPathMeta';

export interface ItemLinkProps
	extends Omit<LinkProps, 'href'>,
		React.RefAttributes<HTMLAnchorElement>,
		Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
	className?: string;

	/**
	 * The URI of the api item to link to. (e.g. `/RestManager`)
	 */
	itemURI: string;

	/**
	 * The name of the package the item belongs to.
	 */
	packageName?: string | undefined;
}

/**
 * A component that renders a link to an api item.
 *
 * @remarks
 * This component only needs the relative path to the item, and will automatically
 * generate the full path to the item client-side.
 */
export function ItemLink(props: PropsWithChildren<ItemLinkProps>) {
	const pathname = usePathname();
	const { packageName, version } = useCurrentPathMeta();

	if (!pathname) {
		throw new Error('ItemLink must be used inside a Next.js page. (e.g. /docs/packages/foo/main)');
	}

	const { itemURI, packageName: pkgName, ...linkProps } = props;

	return <Link href={`/docs/packages/${pkgName ?? packageName}/${version}/${itemURI}`} {...linkProps} />;
}
