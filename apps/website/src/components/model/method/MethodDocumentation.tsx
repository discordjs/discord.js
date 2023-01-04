import { generatePath } from '@discordjs/api-extractor-utils';
import type { ApiMethod, ApiMethodSignature } from '@microsoft/api-extractor-model';
import type { DocSection } from '@microsoft/tsdoc';
import { InheritanceText } from '~/components/InheritanceText';
import { ParameterTable } from '~/components/ParameterTable';
import { TSDoc } from '~/components/documentation/tsdoc/TSDoc';

export interface MethodDocumentationProps {
	fallbackSummary?: DocSection;
	method: ApiMethod | ApiMethodSignature;
	parentContainerKey?: string;
	version: string;
}

export function MethodDocumentation({
	method,
	fallbackSummary,
	parentContainerKey,
	version,
}: MethodDocumentationProps) {
	const isInherited = parentContainerKey && method.parent?.containerKey !== parentContainerKey;

	if (!(method.tsdocComment?.summarySection || method.parameters.length > 0)) {
		return null;
	}

	return (
		<div className="mb-4 flex flex-col gap-4">
			{method.tsdocComment ? <TSDoc item={method} tsdoc={method.tsdocComment} version={version} /> : null}
			{method.parameters.length ? <ParameterTable item={method} /> : null}
			{isInherited ? (
				<InheritanceText
					parentKey={method.parent!.containerKey}
					parentName={method.parent!.displayName}
					path={generatePath(method.getHierarchy(), version)}
				/>
			) : null}
		</div>
	);
}
