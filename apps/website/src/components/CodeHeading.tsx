import type { ReactNode } from 'react';
import { Anchor } from './Anchor';

export interface CodeListingProps {
	/**
	 * The value of this heading.
	 */
	children: ReactNode;
	/**
	 * Additional class names to apply to the root element.
	 */
	className?: string | undefined;
	/**
	 * The href of this heading.
	 */
	href?: string | undefined;
}

export function CodeHeading({ href, className, children }: CodeListingProps) {
	return (
		<div
			className={`flex flex-row flex-wrap place-items-center gap-1 break-all font-mono text-lg font-bold ${className}`}
		>
			{href ? <Anchor href={href} /> : null}
			{children}
		</div>
	);
}
