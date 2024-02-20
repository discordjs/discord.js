'use client';

import type { LinkProps } from 'next/link';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';
import { useCurrentPathMeta } from '~/hooks/useCurrentPathMeta';

export interface ItemLinkProps<Route extends string> extends Omit<LinkProps<Route>, 'href'> {
	readonly className?: string;
	/**
	 * The URI of the api item to link to. (e.g. `/RestManager`)
	 */
	readonly itemURI: string;

	/**
	 * The name of the package the item belongs to.
	 */
	readonly packageName?: string | undefined;

	// TODO: This needs to be properly typed above but monkey-patching it for now.
	readonly title?: string | undefined;

	/**
	 * The version of the package the item belongs to.
	 */
	readonly version?: string | undefined;
}

/**
 * A component that renders a link to an api item.
 *
 * @remarks
 * This component only needs the relative path to the item, and will automatically
 * generate the full path to the item client-side.
 */
export function ItemLink<Route extends string>(props: PropsWithChildren<ItemLinkProps<Route>>) {
	const pathname = usePathname();
	const { packageName, version } = useCurrentPathMeta();

	if (!pathname) {
		throw new Error('ItemLink must be used inside a Next.js page. (e.g. /docs/packages/foo/main)');
	}

	const { itemURI, packageName: pkgName, version: pkgVersion, ...linkProps } = props;

	return <Link {...linkProps} href={`/docs/packages/${pkgName ?? packageName}/${pkgVersion ?? version}/${itemURI}`} />;
}
