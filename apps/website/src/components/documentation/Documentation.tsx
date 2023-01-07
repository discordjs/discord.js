import type { PropsWithChildren } from 'react';

/**
 * Layout parent of documentation pages.
 */
export function Documentation({ children }: PropsWithChildren) {
	return <div className="w-full flex-col space-y-4">{children}</div>;
}
