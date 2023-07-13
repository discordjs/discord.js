import type {
	ApiDeclaredItem,
	ApiItem,
	ApiItemContainerMixin,
	ApiMethod,
	ApiMethodSignature,
} from '@microsoft/api-extractor-model';
import { ApiItemKind } from '@microsoft/api-extractor-model';
import { VscSymbolMethod } from '@react-icons/all-files/vsc/VscSymbolMethod';
import { useMemo, Fragment } from 'react';
import { Method } from '../../model/method/Method';
import { DocumentationSection } from './DocumentationSection';
import { resolveMembers } from '~/util/members';

function isMethodLike(item: ApiItem): item is ApiMethod | ApiMethodSignature {
	return (
		item.kind === ApiItemKind.Method ||
		(item.kind === ApiItemKind.MethodSignature && (item as ApiMethod).overloadIndex <= 1)
	);
}

export function MethodsSection({ item }: { item: ApiItemContainerMixin }) {
	const members = resolveMembers(item, isMethodLike);

	const methodItems = useMemo(
		() =>
			members.map(({ item: method, inherited }) => (
				<Fragment
					key={`${method.displayName}${
						method.overloadIndex && method.overloadIndex > 1 ? `:${(method as ApiMethod).overloadIndex}` : ''
					}`}
				>
					<Method inheritedFrom={inherited as ApiDeclaredItem & ApiItemContainerMixin} method={method} />
					<div className="border-t-2 border-light-900 dark:border-dark-100" />
				</Fragment>
			)),
		[members],
	);

	return (
		<DocumentationSection icon={<VscSymbolMethod size={20} />} padded title="Methods">
			<div className="flex flex-col gap-4">{methodItems}</div>
		</DocumentationSection>
	);
}
