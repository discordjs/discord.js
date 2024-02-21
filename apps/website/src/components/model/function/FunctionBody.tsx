import type { ApiFunction } from '@discordjs/api-extractor-model';
import { ParameterSection } from '../../documentation/section/ParametersSection';
import { TypeParameterSection } from '../../documentation/section/TypeParametersSection';

export interface FunctionBodyProps {
	mergedSiblingCount: number;
	overloadDocumentation: React.ReactNode[];
}

export function FunctionBody({ item }: { readonly item: ApiFunction }) {
	return (
		<>
			{item.typeParameters.length ? <TypeParameterSection item={item} /> : null}
			{item.parameters.length ? <ParameterSection item={item} /> : null}
		</>
	);
}
