import type { ReactNode } from 'react';
import { Anchor } from './Anchor';
import { SourceLink } from './documentation/SourceLink';

export interface CodeListingProps {
	/**
	 * The value of this heading.
	 */
	readonly children: ReactNode;
	/**
	 * Additional class names to apply to the root element.
	 */
	readonly className?: string | undefined;
	/**
	 * The href of this heading.
	 */
	readonly href?: string | undefined;
	/**
	 * The line in the source code where this part is declared
	 */
	readonly sourceLine?: number | undefined;
	/**
	 * The URL of the source code of this code part
	 */
	readonly sourceURL?: string | undefined;
}

export function CodeHeading({ href, className, children, sourceURL, sourceLine }: CodeListingProps) {
	return (
		<div className="flex flex-row place-items-center justify-between gap-1">
			<div
				className={`flex flex-row flex-wrap place-items-center gap-1 break-all font-mono text-lg font-bold ${className}`}
			>
				{href ? <Anchor href={href} /> : null}
				{children}
			</div>
			{sourceURL ? <SourceLink className="text-2xl" sourceLine={sourceLine} sourceURL={sourceURL} /> : null}
		</div>
	);
}
