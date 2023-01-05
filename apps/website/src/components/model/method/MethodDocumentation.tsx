import type { ApiDeclaredItem, ApiMethod, ApiMethodSignature } from '@microsoft/api-extractor-model';
import type { DocSection } from '@microsoft/tsdoc';
import { InheritanceText } from '~/components/InheritanceText';
import { ParameterTable } from '~/components/ParameterTable';
import { TSDoc } from '~/components/documentation/tsdoc/TSDoc';

export interface MethodDocumentationProps {
	fallbackSummary?: DocSection;
	method: ApiMethod | ApiMethodSignature;
	parentContainerKey?: string;
}

export function MethodDocumentation({ method, fallbackSummary, parentContainerKey }: MethodDocumentationProps) {
	const parent = method.parent as ApiDeclaredItem;

	const isInherited = parentContainerKey && parent.containerKey !== parentContainerKey;

	if (!(method.tsdocComment?.summarySection || method.parameters.length > 0)) {
		return null;
	}

	return (
		<div className="mb-4 flex flex-col gap-4">
			{method.tsdocComment ? <TSDoc item={method} tsdoc={method.tsdocComment} /> : null}
			{method.parameters.length ? <ParameterTable item={method} /> : null}
			{isInherited ? <InheritanceText extendsExcerpt={parent.excerpt} model={method.getAssociatedModel()!} /> : null}
		</div>
	);
}
