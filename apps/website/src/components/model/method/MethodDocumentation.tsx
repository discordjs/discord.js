import {
	ApiItemKind,
	type ApiDeclaredItem,
	type ApiItemContainerMixin,
	type ApiMethod,
	type ApiMethodSignature,
} from '@discordjs/api-extractor-model';
import { ParameterSection } from '~/components/documentation/section/ParametersSection';
import { TypeParameterSection } from '~/components/documentation/section/TypeParametersSection';
import { InheritanceText } from '../../InheritanceText';
import { TSDoc } from '../../documentation/tsdoc/TSDoc';

export interface MethodDocumentationProps {
	readonly inheritedFrom?: (ApiDeclaredItem & ApiItemContainerMixin) | undefined;
	readonly method: ApiMethod | ApiMethodSignature;
}

export function MethodDocumentation({ method, inheritedFrom }: MethodDocumentationProps) {
	const parent = method.parent as ApiDeclaredItem;
	const firstOverload = method
		.getMergedSiblings()
		.find((meth): meth is ApiMethod => meth.kind === ApiItemKind.Method && (meth as ApiMethod).overloadIndex === 1)
		?.tsdocComment;

	if (!(method.tsdocComment?.summarySection || firstOverload?.summarySection || method.parameters.length > 0)) {
		return null;
	}

	return (
		<div className="mb-4 w-full flex flex-col gap-4">
			{method.tsdocComment || firstOverload ? (
				<TSDoc item={method} tsdoc={method.tsdocComment ?? firstOverload!} />
			) : null}
			{method.typeParameters.length ? <TypeParameterSection item={method} /> : null}
			{method.parameters.length ? <ParameterSection item={method} /> : null}
			{inheritedFrom && parent ? <InheritanceText parent={inheritedFrom} /> : null}
		</div>
	);
}
