import type {
	ApiDeclaredItem,
	ApiItem,
	ApiItemContainerMixin,
	ApiMethod,
	ApiMethodSignature,
} from '@microsoft/api-extractor-model';
import { ApiItemKind } from '@microsoft/api-extractor-model';
import { Fragment, useMemo } from 'react';
import { Method } from './model/method/Method';
import { resolveMembers } from '~/util/members';

function isMethodLike(item: ApiItem): item is ApiMethod | ApiMethodSignature {
	return (
		item.kind === ApiItemKind.Method ||
		(item.kind === ApiItemKind.MethodSignature && (item as ApiMethod).overloadIndex <= 1)
	);
}

export function MethodList({ item }: { item: ApiItemContainerMixin }) {
	const members = resolveMembers(item, isMethodLike);

	const methodItems = useMemo(
		() =>
			members.map(({ item: method, inherited }) => {
				return (
					<Fragment
						key={`${method.displayName}${
							method.overloadIndex && method.overloadIndex > 1 ? `:${(method as ApiMethod).overloadIndex}` : ''
						}`}
					>
						<Method inheritedFrom={inherited as ApiDeclaredItem & ApiItemContainerMixin} method={method} />
						<div className="border-light-900 dark:border-dark-100 -mx-8 border-t-2" />
					</Fragment>
				);
			}),
		[members],
	);

	return <div className="flex flex-col gap-4">{methodItems}</div>;
}
