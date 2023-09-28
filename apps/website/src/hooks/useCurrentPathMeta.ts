'use client';

import { usePathname } from 'next/navigation';

export function useCurrentPathMeta() {
	const pathname = usePathname();

	if (!pathname) {
		return {};
	}

	const [, , , packageName, version, item] = pathname.split('/');

	return {
		packageName,
		version,
		item,
	};
}
