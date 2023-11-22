import { ApiItemKind, Meaning } from '@discordjs/api-extractor-model';
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
	ApiPackage,
} from '@discordjs/api-extractor-model';
import type { DocDeclarationReference } from '@microsoft/tsdoc';
import { SelectorKind } from '@microsoft/tsdoc';
import type { DeclarationReference } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference';
import { METHOD_SEPARATOR, OVERLOAD_SEPARATOR } from '~/util/constants';
import { resolveMembers } from '~/util/members';
import { resolveParameters } from '~/util/model';
import type { TableOfContentsSerialized } from '../TableOfContentItems';

export interface ApiItemLike {
	containerKey?: string;
	displayName: string;
	kind: string;
	members?: readonly ApiItemLike[];
	parent?: ApiItemLike | undefined;
}

interface ResolvedCanonicalReference {
	item: ApiItemLike;
	package: string | undefined;
	version: string | undefined;
}

const kindToMeaning = new Map([
	[ApiItemKind.CallSignature, Meaning.CallSignature],
	[ApiItemKind.Class, Meaning.Class],
	[ApiItemKind.ConstructSignature, Meaning.ConstructSignature],
	[ApiItemKind.Constructor, Meaning.Constructor],
	[ApiItemKind.Enum, Meaning.Enum],
	[ApiItemKind.Event, Meaning.Event],
	[ApiItemKind.Function, Meaning.Function],
	[ApiItemKind.IndexSignature, Meaning.IndexSignature],
	[ApiItemKind.Interface, Meaning.Interface],
	[ApiItemKind.Property, Meaning.Member],
	[ApiItemKind.Namespace, Meaning.Namespace],
	[ApiItemKind.None, Meaning.ComplexType],
	[ApiItemKind.TypeAlias, Meaning.TypeAlias],
	[ApiItemKind.Variable, Meaning.Variable],
]);

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

export function resolveItemURI(item: ApiItemLike): string {
	return !item.parent || item.parent.kind === ApiItemKind.EntryPoint
		? `${item.displayName}${OVERLOAD_SEPARATOR}${item.kind}`
		: `${item.parent.displayName}${OVERLOAD_SEPARATOR}${item.parent.kind}${METHOD_SEPARATOR}${item.displayName}`;
}

export function resolveCanonicalReference(
	canonicalReference: DeclarationReference | DocDeclarationReference,
	apiPackage: ApiPackage | undefined,
): ResolvedCanonicalReference | null {
	if (
		'source' in canonicalReference &&
		canonicalReference.source &&
		'packageName' in canonicalReference.source &&
		canonicalReference.symbol?.componentPath &&
		canonicalReference.symbol.meaning
	)
		return {
			package: canonicalReference.source.unscopedPackageName,
			item: {
				kind: mapMeaningToKind(canonicalReference.symbol.meaning as unknown as Meaning),
				displayName: canonicalReference.symbol.componentPath.component.toString(),
				containerKey: `|${
					canonicalReference.symbol.meaning
				}|${canonicalReference.symbol.componentPath.component.toString()}`,
			},
			// eslint-disable-next-line unicorn/better-regex
			version: apiPackage?.dependencies?.[canonicalReference.source.packageName]?.replace(/[~^]/, ''),
		};
	else if (
		'memberReferences' in canonicalReference &&
		canonicalReference.memberReferences.length &&
		canonicalReference.memberReferences[0]?.memberIdentifier &&
		canonicalReference.memberReferences[0]?.selector?.selectorKind === SelectorKind.System
	) {
		const member = canonicalReference.memberReferences[0]!;
		return {
			package: canonicalReference.packageName?.replace('@discordjs/', ''),
			item: {
				kind: member.selector!.selector,
				displayName: member.memberIdentifier!.identifier,
				containerKey: `|${member.selector!.selector}|${member.memberIdentifier!.identifier}`,
				members: canonicalReference.memberReferences
					.slice(1)
					.map((member) => ({ kind: member.kind, displayName: member.memberIdentifier!.identifier! })),
			},
			// eslint-disable-next-line unicorn/better-regex
			version: apiPackage?.dependencies?.[canonicalReference.packageName ?? '']?.replace(/[~^]/, ''),
		};
	}

	return null;
}

export function mapMeaningToKind(meaning: Meaning): ApiItemKind {
	return [...kindToMeaning.entries()].find((mapping) => mapping[1] === meaning)?.[0] ?? ApiItemKind.None;
}

export function mapKindToMeaning(kind: ApiItemKind): Meaning {
	return kindToMeaning.get(kind) ?? Meaning.Variable;
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
