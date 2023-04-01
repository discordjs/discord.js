import type { PropsWithChildren } from 'react';

export function Panel({ children }: PropsWithChildren) {
	return (
		<>
			{children}
			<div className="border-light-900 dark:border-dark-100 border-t-2" />
		</>
	);
}
