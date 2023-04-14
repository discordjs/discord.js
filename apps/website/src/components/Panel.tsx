import type { PropsWithChildren } from 'react';

export function Panel({ children }: PropsWithChildren) {
	return (
		<>
			{children}
			<div className="border-t-2 border-light-900 dark:border-dark-100" />
		</>
	);
}
