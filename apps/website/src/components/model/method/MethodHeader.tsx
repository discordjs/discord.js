import type { ApiMethod, ApiMethodSignature } from '@discordjs/api-extractor-model';
import { useMemo } from 'react';
import { Badges } from '~/components/Badges';
import { CodeHeading } from '~/components/CodeHeading';
import { ExcerptText } from '~/components/ExcerptText';
import { parametersString } from '~/components/documentation/util';

export function MethodHeader({ method }: { readonly method: ApiMethod | ApiMethodSignature }) {
	const key = useMemo(
		() => `${method.displayName}${method.overloadIndex && method.overloadIndex > 1 ? `:${method.overloadIndex}` : ''}`,
		[method.displayName, method.overloadIndex],
	);

	return (
		<div className="w-full flex flex-col scroll-mt-30" id={key}>
			<div className="flex flex-col gap-2 md:-ml-9">
				<Badges item={method} />
				<CodeHeading
					href={`#${key}`}
					sourceLine={method.sourceLocation.fileLine}
					sourceURL={method.sourceLocation.fileUrl}
				>
					{`${method.name}(${parametersString(method)})`}
					<span>:</span>
					<ExcerptText excerpt={method.returnTypeExcerpt} apiPackage={method.getAssociatedPackage()!} />
				</CodeHeading>
			</div>
		</div>
	);
}
