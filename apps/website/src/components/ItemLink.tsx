'use client';

import type { LinkProps } from 'next/link';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';

export interface ItemLinkProps
	extends Omit<LinkProps, 'href'>,
		React.RefAttributes<HTMLAnchorElement>,
		Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
	className?: string;

	/**
	 * The URI of the api item to link to. (e.g. `/RestManager`)
	 */
	itemURI: string;
}

/**
 * A component that renders a link to an api item.
 *
 * @remarks
 * This component only needs the relative path to the item, and will automatically
 * generate the full path to the item client-side.
 */
export function ItemLink(props: PropsWithChildren<ItemLinkProps>) {
	const path = usePathname();

	if (!path) {
		throw new Error('ItemLink must be used inside a Next.js page. (e.g. /docs/packages/foo/main)');
	}

	// Check if the item is already in the current path, if so keep the current path
	const end = path?.split('/')?.length < 6 ? path?.length : -1;

	const pathPrefix = path?.split('/').slice(0, end).join('/');

	const { itemURI, ...linkProps } = props;

	return <Link href={`${pathPrefix}${itemURI}`} {...linkProps} />;
}
