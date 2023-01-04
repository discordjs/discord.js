'use server';

import type { ApiItem, ApiItemContainerMixin, ApiMethod, ApiMethodSignature } from '@microsoft/api-extractor-model';
import { ApiItemKind } from '@microsoft/api-extractor-model';
import { Fragment, useMemo } from 'react';
import { Method } from './model/method/Method';

function isMethodLike(item: ApiItem): item is ApiMethod | ApiMethodSignature {
	return (
		item.kind === ApiItemKind.Method ||
		(item.kind === ApiItemKind.MethodSignature && (item as ApiMethod).overloadIndex <= 1)
	);
}

export function MethodList({ item, version }: { item: ApiItemContainerMixin; version: string }) {
	const methodItems = useMemo(
		() =>
			item.members.filter(isMethodLike).map((method) => (
				<Fragment
					key={`${method.displayName}${
						method.overloadIndex && method.overloadIndex > 1 ? `:${(method as ApiMethod).overloadIndex}` : ''
					}`}
				>
					<Method method={method} version={version} />
					<div className="border-light-900 dark:border-dark-100 -mx-8 border-t-2" />
				</Fragment>
			)),
		[item.members, version],
	);

	return <div className="flex flex-col gap-4">{methodItems}</div>;
}
