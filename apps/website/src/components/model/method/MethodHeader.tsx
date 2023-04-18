import type { ApiMethod, ApiMethodSignature } from '@microsoft/api-extractor-model';
import { ApiItemKind } from '@microsoft/api-extractor-model';
import { useMemo } from 'react';
import { CodeHeading } from '~/components/CodeHeading';
import { ExcerptText } from '~/components/ExcerptText';
import { resolveParameters } from '~/util/model';

function getShorthandName(method: ApiMethod | ApiMethodSignature) {
	const params = resolveParameters(method);

	return `${method.name}${method.isOptional ? '?' : ''}(${params.reduce((prev, cur, index) => {
		if (index === 0) {
			return `${prev}${cur.isOptional ? `${cur.name}?` : cur.name}`;
		}

		return `${prev}, ${cur.isOptional ? `${cur.name}?` : cur.name}`;
	}, '')})`;
}

export function MethodHeader({ method }: { method: ApiMethod | ApiMethodSignature }) {
	const isDeprecated = Boolean(method.tsdocComment?.deprecatedBlock);

	const key = useMemo(
		() => `${method.displayName}${method.overloadIndex && method.overloadIndex > 1 ? `:${method.overloadIndex}` : ''}`,
		[method.displayName, method.overloadIndex],
	);

	return (
		<div className="flex flex-col scroll-mt-30" id={key}>
			<div className="flex flex-col gap-2 md:-ml-9">
				{isDeprecated ||
				(method.kind === ApiItemKind.Method && (method as ApiMethod).isProtected) ||
				(method.kind === ApiItemKind.Method && (method as ApiMethod).isStatic) ? (
					<div className="flex flex-row gap-1 md:ml-7">
						{isDeprecated ? (
							<div className="h-5 flex flex-row place-content-center place-items-center rounded-full bg-red-500 px-3 text-center text-xs font-semibold uppercase text-white">
								Deprecated
							</div>
						) : null}
						{method.kind === ApiItemKind.Method && (method as ApiMethod).isProtected ? (
							<div className="h-5 flex flex-row place-content-center place-items-center rounded-full bg-blurple px-3 text-center text-xs font-semibold uppercase text-white">
								Protected
							</div>
						) : null}
						{method.kind === ApiItemKind.Method && (method as ApiMethod).isStatic ? (
							<div className="h-5 flex flex-row place-content-center place-items-center rounded-full bg-blurple px-3 text-center text-xs font-semibold uppercase text-white">
								Static
							</div>
						) : null}
					</div>
				) : null}
				<CodeHeading href={`#${key}`}>
					{getShorthandName(method)}
					<span>:</span>
					<ExcerptText excerpt={method.returnTypeExcerpt} model={method.getAssociatedModel()!} />
				</CodeHeading>
			</div>
		</div>
	);
}
