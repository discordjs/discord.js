import type { ApiFunction } from '@microsoft/api-extractor-model';
import { SyntaxHighlighter } from '../../SyntaxHighlighter';
import { Documentation } from '../../documentation/Documentation';
import { ParameterSection } from '../../documentation/section/ParametersSection';
import { SummarySection } from '../../documentation/section/SummarySection';
import { TypeParameterSection } from '../../documentation/section/TypeParametersSection';

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
			{item.parameters.length ? <ParameterSection item={item} /> : null}
		</Documentation>
	);
}
