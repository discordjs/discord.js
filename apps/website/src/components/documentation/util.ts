import { ApiItemKind } from '@discordjs/api-extractor-model';
import type {
	ApiItem,
	ApiItemContainerMixin,
	ApiMethod,
	ApiMethodSignature,
	ApiProperty,
	ApiPropertySignature,
	ApiDocumentedItem,
	ApiParameterListMixin,
	ApiEvent,
} from '@discordjs/api-extractor-model';
import { METHOD_SEPARATOR, OVERLOAD_SEPARATOR } from '~/util/constants';
import { resolveMembers } from '~/util/members';
import { resolveParameters } from '~/util/model';
import type { TableOfContentsSerialized } from '../TableOfContentItems';

export function hasProperties(item: ApiItemContainerMixin) {
	return resolveMembers(item, memberPredicate).some(
		({ item: member }) => member.kind === ApiItemKind.Property || member.kind === ApiItemKind.PropertySignature,
	);
}

export function hasMethods(item: ApiItemContainerMixin) {
	return resolveMembers(item, memberPredicate).some(
		({ item: member }) => member.kind === ApiItemKind.Method || member.kind === ApiItemKind.MethodSignature,
	);
}

export function hasEvents(item: ApiItemContainerMixin) {
	return resolveMembers(item, memberPredicate).some(({ item: member }) => member.kind === ApiItemKind.Event);
}

export function resolveItemURI(item: ApiItem): string {
	return !item.parent || item.parent.kind === ApiItemKind.EntryPoint
		? `${item.displayName}${OVERLOAD_SEPARATOR}${item.kind}`
		: `${item.parent.displayName}${OVERLOAD_SEPARATOR}${item.parent.kind}${METHOD_SEPARATOR}${item.displayName}`;
}

export function memberPredicate(
	item: ApiItem,
): item is ApiEvent | ApiMethod | ApiMethodSignature | ApiProperty | ApiPropertySignature {
	return (
		item.kind === ApiItemKind.Property ||
		item.kind === ApiItemKind.PropertySignature ||
		item.kind === ApiItemKind.Method ||
		item.kind === ApiItemKind.MethodSignature ||
		item.kind === ApiItemKind.Event
	);
}

export function serializeMembers(clazz: ApiItemContainerMixin): TableOfContentsSerialized[] {
	return resolveMembers(clazz, memberPredicate).map(({ item: member }) => {
		if (member.kind === 'Method' || member.kind === 'MethodSignature') {
			return {
				kind: member.kind as 'Method' | 'MethodSignature',
				name: member.displayName,
			};
		} else if (member.kind === 'Event') {
			return {
				kind: member.kind as 'Event',
				name: member.displayName,
			};
		} else {
			return {
				kind: member.kind as 'Property' | 'PropertySignature',
				name: member.displayName,
				overloadIndex: (member as ApiMethod | ApiMethodSignature).overloadIndex,
			};
		}
	});
}

export function parametersString(item: ApiDocumentedItem & ApiParameterListMixin) {
	return resolveParameters(item).reduce((prev, cur, index) => {
		if (index === 0) {
			return `${prev}${cur.isRest ? '...' : ''}${cur.isOptional ? `${cur.name}?` : cur.name}`;
		}

		return `${prev}, ${cur.isRest ? '...' : ''}${cur.isOptional ? `${cur.name}?` : cur.name}`;
	}, '');
}
