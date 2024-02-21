import type { PropsWithChildren } from 'react';

/**
 * Layout parent of documentation pages.
 */
export function Documentation({ children }: PropsWithChildren) {
	return <div className="w-full flex flex-col gap-4">{children}</div>;
}
