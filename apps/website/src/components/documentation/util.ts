import { genToken } from '@discordjs/api-extractor-utils';
import type {
	ApiItem,
	ApiItemContainerMixin,
	ApiMethod,
	ApiMethodSignature,
	ApiModel,
	ExcerptToken,
} from '@microsoft/api-extractor-model';
import { ApiItemKind } from '@microsoft/api-extractor-model';
import type { TableOfContentsSerialized } from '../TableOfContentItems';

export function tokenize(model: ApiModel, tokens: readonly ExcerptToken[], version: string) {
	return tokens.map((token) => genToken(model, token, version));
}

export function hasProperties(item: ApiItemContainerMixin) {
	return item.members.some(
		(member) => member.kind === ApiItemKind.Property || member.kind === ApiItemKind.PropertySignature,
	);
}

export function hasMethods(item: ApiItemContainerMixin) {
	return item.members.some(
		(member) => member.kind === ApiItemKind.Method || member.kind === ApiItemKind.MethodSignature,
	);
}

export function resolveItemURI(item: ApiItem): string {
	return `/${item.displayName}:${item.kind}`;
}

export function serializeMembers(clazz: ApiItemContainerMixin): TableOfContentsSerialized[] {
	return clazz.members.map((member) => {
		if (member.kind === 'Method' || member.kind === 'MethodSignature') {
			return {
				kind: member.kind as 'Method' | 'MethodSignature',
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
