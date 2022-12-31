import { genToken } from '@discordjs/api-extractor-utils';
import type { ApiItemContainerMixin, ApiModel, ExcerptToken } from '@microsoft/api-extractor-model';
import { ApiItemKind } from '@microsoft/api-extractor-model';

export function tokenize(model: ApiModel, tokens: readonly ExcerptToken[]) {
	return tokens.map((token) => genToken(model, token, ' '));
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
