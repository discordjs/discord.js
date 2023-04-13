import type { ApiMethod, ApiMethodSignature } from '@microsoft/api-extractor-model';
import { ApiItemKind } from '@microsoft/api-extractor-model';
import { useCallback, useMemo } from 'react';
import { Anchor } from '~/components/Anchor';
import { ExcerptText } from '~/components/ExcerptText';

export function MethodHeader({ method }: { method: ApiMethod | ApiMethodSignature }) {
	const isDeprecated = Boolean(method.tsdocComment?.deprecatedBlock);

	const key = useMemo(
		() => `${method.displayName}${method.overloadIndex && method.overloadIndex > 1 ? `:${method.overloadIndex}` : ''}`,
		[method.displayName, method.overloadIndex],
	);

	const getShorthandName = useCallback(
		(method: ApiMethod | ApiMethodSignature) =>
			`${method.name}${method.isOptional ? '?' : ''}(${method.parameters.reduce((prev, cur, index) => {
				if (index === 0) {
					return `${prev}${cur.isOptional ? `${cur.name}?` : cur.name}`;
				}

				return `${prev}, ${cur.isOptional ? `${cur.name}?` : cur.name}`;
			}, '')})`,
		[],
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
				<div className="flex flex-row flex-wrap place-items-center gap-1">
					<Anchor href={`#${key}`} />
					<h4 className="break-all font-mono text-lg font-bold">{getShorthandName(method)}</h4>
					<h4 className="font-mono text-lg font-bold">:</h4>
					<h4 className="break-all font-mono text-lg font-bold">
						<ExcerptText excerpt={method.returnTypeExcerpt} model={method.getAssociatedModel()!} />
					</h4>
				</div>
			</div>
		</div>
	);
}
