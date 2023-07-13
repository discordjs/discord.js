import type {
	ApiDeclaredItem,
	ApiItemContainerMixin,
	ApiMethod,
	ApiMethodSignature,
} from '@microsoft/api-extractor-model';
import { InheritanceText } from '../../InheritanceText';
import { ParameterTable } from '../../ParameterTable';
import { TSDoc } from '../../documentation/tsdoc/TSDoc';

export interface MethodDocumentationProps {
	inheritedFrom?: (ApiDeclaredItem & ApiItemContainerMixin) | undefined;
	method: ApiMethod | ApiMethodSignature;
}

export function MethodDocumentation({ method, inheritedFrom }: MethodDocumentationProps) {
	const parent = method.parent as ApiDeclaredItem;

	if (!(method.tsdocComment?.summarySection || method.parameters.length > 0)) {
		return null;
	}

	return (
		<div className="mb-4 flex flex-col gap-4">
			{method.tsdocComment ? <TSDoc item={method} tsdoc={method.tsdocComment} /> : null}
			{method.parameters.length ? <ParameterTable item={method} /> : null}
			{inheritedFrom && parent ? <InheritanceText parent={inheritedFrom} /> : null}
		</div>
	);
}
