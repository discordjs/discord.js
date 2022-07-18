import type { ReactNode } from 'react';
import { HyperlinkedText } from './HyperlinkedText';
import type { TokenDocumentation } from '~/util/parse.server';

export enum CodeListingSeparatorType {
	Type = ':',
	Value = '=',
}

export interface CodeListingProps {
	name: string;
	summary?: string | null;
	typeTokens: TokenDocumentation[];
	separator?: CodeListingSeparatorType;
	children?: ReactNode;
	className?: string | undefined;
}

export function CodeListing({
	name,
	className,
	separator = CodeListingSeparatorType.Type,
	summary,
	typeTokens,
	children,
}: CodeListingProps) {
	return (
		<div className={className}>
			<div key={name} className="flex flex-col mb-2 ml-3">
				<div className="w-full flex flex-row">
					<h4 className="font-mono my-0">{`${name}`}</h4>
					<h4 className="mx-3 my-0">{separator}</h4>
					<h4 className="font-mono text-blue-800 dark:text-blue-400 my-0">
						<HyperlinkedText tokens={typeTokens} />
					</h4>
				</div>
				{summary && <p className="text-dark-100 mt-2">{summary}</p>}
				{children}
			</div>
		</div>
	);
}
