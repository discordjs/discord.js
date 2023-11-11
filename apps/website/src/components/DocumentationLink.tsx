import type { PropsWithChildren } from 'react';

export function DocumentationLink({ children, href }: PropsWithChildren<{ readonly href: string }>) {
	return (
		<a className="text-blurple" href={href} rel="external noreferrer noopener" target="_blank">
			{children}
		</a>
	);
}
