import { genToken } from '@discordjs/api-extractor-utils';
import type {
	ApiFunction,
	ApiItem,
	ApiItemContainerMixin,
	ApiModel,
	ExcerptToken,
} from '@microsoft/api-extractor-model';
import { ApiItemKind } from '@microsoft/api-extractor-model';

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

export function resolveURI(item: ApiItem, version: string): string {
	let path = '/docs/packages';
	const pkg = item.getAssociatedPackage();

	if (!pkg) {
		throw new Error('Item has no associated package');
	}

	path += `/${pkg.displayName}`;

	if (item.kind === ApiItemKind.Function) {
		const functionItem = item as ApiFunction;
		path += `/${functionItem.displayName}${
			functionItem.overloadIndex && functionItem.overloadIndex > 1 ? `:${functionItem.overloadIndex}` : ''
		}:${item.kind}`;
	} else if (
		[ApiItemKind.Property, ApiItemKind.Method, ApiItemKind.MethodSignature, ApiItemKind.PropertySignature].includes(
			item.kind,
		)
	) {
		path += `#${item.displayName}`;
	} else {
		path += `/${item.displayName}:${item.kind}`;
	}

	// eslint-disable-next-line prefer-named-capture-group, unicorn/no-unsafe-regex
	return path.replace(/@discordjs\/(.*)\/(.*)?/, `$1/${version}/$2`);
}
