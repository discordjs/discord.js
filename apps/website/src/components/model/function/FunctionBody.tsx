import type { ApiFunction } from '@microsoft/api-extractor-model';
import { SyntaxHighlighter } from '~/components/SyntaxHighlighter';
import { Documentation } from '~/components/documentation/Documentation';
import { ParameterSection } from '~/components/documentation/section/ParametersSection';
import { SummarySection } from '~/components/documentation/section/SummarySection';
import { TypeParameterSection } from '~/components/documentation/section/TypeParametersSection';

export interface FunctionBodyProps {
	mergedSiblingCount: number;
	overloadDocumentation: React.ReactNode[];
}

export function FunctionBody({ item }: { item: ApiFunction }) {
	return (
		<Documentation>
			<SyntaxHighlighter code={item.excerpt.text} />
			<SummarySection item={item} />
			{item.typeParameters.length ? <TypeParameterSection item={item} /> : null}
			<ParameterSection item={item} />
		</Documentation>
	);
}
