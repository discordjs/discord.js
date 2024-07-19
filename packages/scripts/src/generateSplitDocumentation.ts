import { mkdir, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import type {
	ApiClass,
	ApiConstructor,
	ApiDeclaredItem,
	ApiDocumentedItem,
	ApiEntryPoint,
	ApiEnum,
	ApiEnumMember,
	ApiEvent,
	ApiInterface,
	ApiItem,
	ApiItemContainerMixin,
	ApiMethod,
	ApiMethodSignature,
	ApiProperty,
	ApiPropertySignature,
	ApiTypeAlias,
	ApiTypeParameterListMixin,
	ApiVariable,
} from '@discordjs/api-extractor-model';
import {
	Excerpt,
	Meaning,
	ApiAbstractMixin,
	ApiFunction,
	ApiItemKind,
	ApiModel,
	ApiPackage,
	ApiParameterListMixin,
	ApiProtectedMixin,
	ApiReadonlyMixin,
	ApiStaticMixin,
	ExcerptTokenKind,
	ExcerptToken,
	ApiOptionalMixin,
} from '@discordjs/api-extractor-model';
import { DocNodeKind, SelectorKind, StandardTags } from '@microsoft/tsdoc';
import type {
	DocNode,
	DocNodeContainer,
	DocDeclarationReference,
	DocPlainText,
	DocLinkTag,
	DocFencedCode,
	DocComment,
} from '@microsoft/tsdoc';
import type { DeclarationReference } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import { PACKAGES, fetchVersionDocs, fetchVersions } from './shared.js';

function resolvePackageName(packageName: string) {
	return packageName === 'discord.js' ? packageName : `@discordjs/${packageName}`;
}

function findMemberByKey(model: ApiModel, packageName: string, containerKey: string) {
	const pkg = model.tryGetPackageByName(resolvePackageName(packageName))!;
	return (pkg.members[0] as ApiEntryPoint).tryGetMemberByKey(containerKey);
}

function findMember(model: ApiModel, packageName: string, memberName: string | undefined) {
	if (!memberName) {
		return undefined;
	}

	const pkg = model.tryGetPackageByName(resolvePackageName(packageName))!;
	return pkg.entryPoints[0]?.findMembersByName(memberName)[0];
}

/**
 * Resolves all inherited members (including merged members) of a given parent.
 *
 * @param parent - The parent to resolve the inherited members of.
 * @param predicate - A predicate to filter the members by.
 */
export function resolveMembers<WantedItem extends ApiItem>(
	parent: ApiItemContainerMixin,
	predicate: (item: ApiItem) => item is WantedItem,
) {
	const seenItems = new Set<string>();
	const inheritedMembers = parent.findMembersWithInheritance().items.reduce((acc, item) => {
		if (predicate(item) && !seenItems.has(item.displayName)) {
			acc.push({
				item,
				inherited:
					item.parent?.containerKey === parent.containerKey
						? undefined
						: (item.parent as ApiItemContainerMixin | undefined),
			});

			seenItems.add(item.displayName);
		}

		return acc;
	}, new Array<{ inherited?: ApiItemContainerMixin | undefined; item: WantedItem }>());

	const mergedMembers = parent
		.getMergedSiblings()
		.filter((sibling) => sibling.containerKey !== parent.containerKey)
		.flatMap((sibling) => (sibling as ApiItemContainerMixin).findMembersWithInheritance().items)
		.filter((item) => predicate(item) && !seenItems.has(item.containerKey))
		.map((item) => ({
			item: item as WantedItem,
			inherited: item.parent ? (item.parent as ApiItemContainerMixin) : undefined,
		}));

	return [...inheritedMembers, ...mergedMembers];
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

function mapMeaningToKind(meaning: Meaning): ApiItemKind {
	return [...kindToMeaning.entries()].find((mapping) => mapping[1] === meaning)?.[0] ?? ApiItemKind.None;
}

// function mapKindToMeaning(kind: ApiItemKind): Meaning {
// 	return kindToMeaning.get(kind) ?? Meaning.Variable;
// }

function resolveCanonicalReference(
	canonicalReference: DeclarationReference | DocDeclarationReference,
	apiPackage: ApiPackage | undefined,
) {
	if (
		'source' in canonicalReference &&
		canonicalReference.source &&
		'packageName' in canonicalReference.source &&
		canonicalReference.symbol?.componentPath &&
		canonicalReference.symbol.meaning
	)
		return {
			package: canonicalReference.source.packageName,
			unscopedPackage: canonicalReference.source.unscopedPackageName,
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

interface ApiItemLike {
	containerKey?: string;
	displayName: string;
	kind: string;
	members?: readonly ApiItemLike[];
	parent?: ApiItemLike | undefined;
}

function resolveItemURI(item: ApiItemLike): string {
	return !item.parent || item.parent.kind === ApiItemKind.EntryPoint
		? `${item.displayName}:${item.kind}`
		: `${item.parent.displayName}:${item.parent.kind}#${item.displayName}`;
}

function itemExcerptText(excerpt: Excerpt, apiPackage: ApiPackage) {
	const DISCORD_API_TYPES_VERSION = 'v10';
	const DISCORD_API_TYPES_DOCS_URL = `https://discord-api-types.dev/api/discord-api-types-${DISCORD_API_TYPES_VERSION}`;

	return excerpt.spannedTokens.map((token) => {
		if (token.kind === ExcerptTokenKind.Reference) {
			const source = token.canonicalReference?.source;
			const symbol = token.canonicalReference?.symbol;

			if (source && 'packageName' in source && source.packageName === 'discord-api-types' && symbol) {
				const { meaning, componentPath: path } = symbol;
				let href = DISCORD_API_TYPES_DOCS_URL;

				// dapi-types doesn't have routes for class members
				// so we can assume this member is for an enum
				if (meaning === 'member' && path && 'parent' in path) {
					// unless it's a variable like FormattingPatterns.Role
					if (path.parent.toString() === '__type') {
						href += `#${token.text.split('.')[0]}`;
					} else {
						href += `/enum/${path.parent}#${path.component}`;
					}
				} else if (meaning === 'type' || meaning === 'var') {
					href += `#${token.text}`;
				} else {
					href += `/${meaning}/${token.text}`;
				}

				return {
					text: token.text,
					href,
				};
			}

			if (token.canonicalReference) {
				const resolved = resolveCanonicalReference(token.canonicalReference, apiPackage);

				if (!resolved) {
					return {
						text: token.text,
					};
				}

				const declarationReference = apiPackage
					.getAssociatedModel()
					?.resolveDeclarationReference(token.canonicalReference, apiPackage);
				const foundItem = declarationReference?.resolvedApiItem ?? resolved.item;

				return {
					text: token.text,
					resolvedItem: {
						kind: foundItem.kind,
						displayName: foundItem.displayName,
						containerKey: foundItem.containerKey,
						uri: resolveItemURI(foundItem),
						packageName: resolved.package?.replace('@discordjs/', ''),
						version: resolved.version,
					},
				};
			}

			return {
				text: token.text,
			};
		}

		return {
			text: token.text.replace(/import\("discord-api-types(?:\/v\d+)?"\)\./, ''),
		};
	});
}

function itemTsDoc(item: DocNode, apiItem: ApiItem) {
	const DISCORD_API_TYPES_VERSION = 'v10';
	const DISCORD_API_TYPES_DOCS_URL = `https://discord-api-types.dev/api/discord-api-types-${DISCORD_API_TYPES_VERSION}`;

	const createNode = (node: DocNode): any => {
		switch (node.kind) {
			case DocNodeKind.PlainText:
				return {
					kind: DocNodeKind.PlainText,
					text: (node as DocPlainText).text,
				};
			case DocNodeKind.Section:
			case DocNodeKind.Paragraph:
				return (node as DocNodeContainer).nodes.map((node) => createNode(node));
			case DocNodeKind.SoftBreak:
				return {
					kind: DocNodeKind.SoftBreak,
					text: null,
				};
			case DocNodeKind.LinkTag: {
				const { codeDestination, urlDestination, linkText } = node as DocLinkTag;

				if (codeDestination) {
					// if (
					// 	!codeDestination.importPath &&
					// 	!codeDestination.packageName &&
					// 	codeDestination.memberReferences.length === 1 &&
					// 	codeDestination.memberReferences[0]!.memberIdentifier
					// ) {
					// 	const typeName = codeDestination.memberReferences[0]!.memberIdentifier.identifier;

					// 	return {
					// 		kind: DocNodeKind.LinkTag,
					// 		text: typeName,
					// 	};
					// }

					const declarationReference = apiItem
						.getAssociatedModel()
						?.resolveDeclarationReference(codeDestination, apiItem);
					const foundItem = declarationReference?.resolvedApiItem;
					const resolved = resolveCanonicalReference(codeDestination, apiItem.getAssociatedPackage());

					if (!foundItem && !resolved) {
						return {
							kind: DocNodeKind.LinkTag,
							text: codeDestination.memberReferences[0]?.memberIdentifier?.identifier ?? null,
						};
					}

					if (resolved && resolved.package === 'discord-api-types') {
						const { displayName, kind, members, containerKey } = resolved.item;
						let href = DISCORD_API_TYPES_DOCS_URL;

						// dapi-types doesn't have routes for class members
						// so we can assume this member is for an enum
						if (kind === 'enum' && members?.[0]) {
							href += `/enum/${displayName}#${members[0].displayName}`;
						} else if (kind === 'type' || kind === 'var') {
							href += `#${displayName}`;
						} else {
							href += `/${kind}/${displayName}`;
						}

						return {
							kind: DocNodeKind.LinkTag,
							text: displayName,
							containerKey,
							uri: href,
							members: members?.map((member) => `.${member.displayName}`).join('') ?? '',
						};
					}

					return {
						kind: DocNodeKind.LinkTag,
						text: linkText ?? foundItem?.displayName ?? resolved!.item.displayName,
						uri: resolveItemURI(foundItem ?? resolved!.item),
						resolvedPackage: {
							packageName: resolved?.package ?? apiItem.getAssociatedPackage()?.displayName.replace('@discordjs/', ''),
							version: resolved?.package
								? apiItem.getAssociatedPackage()?.dependencies?.[resolved.package] ?? null
								: null,
						},
					};
				}

				if (urlDestination) {
					return {
						kind: DocNodeKind.LinkTag,
						text: linkText ?? urlDestination,
						uri: urlDestination,
					};
				}

				return {
					kind: DocNodeKind.LinkTag,
					text: null,
				};
			}

			case DocNodeKind.CodeSpan: {
				const { code } = node as DocFencedCode;

				return {
					kind: DocNodeKind.CodeSpan,
					text: code,
				};
			}

			case DocNodeKind.FencedCode: {
				const { language, code } = node as DocFencedCode;

				return {
					kind: DocNodeKind.FencedCode,
					text: code,
					language,
				};
			}

			case DocNodeKind.Comment: {
				const comment = node as DocComment;

				const exampleBlocks = comment.customBlocks.filter(
					(block) => block.blockTag.tagName.toUpperCase() === StandardTags.example.tagNameWithUpperCase,
				);

				const defaultValueBlock = comment.customBlocks.find(
					(block) => block.blockTag.tagName.toUpperCase() === StandardTags.defaultValue.tagNameWithUpperCase,
				);

				return {
					kind: DocNodeKind.Comment,
					deprecatedBlock: comment.deprecatedBlock
						? createNode(comment.deprecatedBlock.content)
								.flat(1)
								.filter((val: any) => val.kind !== DocNodeKind.SoftBreak)
						: [],
					summarySection: comment.summarySection
						? createNode(comment.summarySection)
								.flat(1)
								.filter((val: any) => val.kind !== DocNodeKind.SoftBreak)
						: [],
					remarksBlock: comment.remarksBlock
						? createNode(comment.remarksBlock.content)
								.flat(1)
								.filter((val: any) => val.kind !== DocNodeKind.SoftBreak)
						: [],
					defaultValueBlock: defaultValueBlock
						? createNode(defaultValueBlock.content)
								.flat(1)
								.filter((val: any) => val.kind !== DocNodeKind.SoftBreak)
						: [],
					returnsBlock: comment.returnsBlock
						? createNode(comment.returnsBlock.content)
								.flat(1)
								.filter((val: any) => val.kind !== DocNodeKind.SoftBreak)
						: [],
					exampleBlocks: exampleBlocks
						.flatMap((block) => createNode(block.content).flat(1))
						.filter((val: any) => val.kind !== DocNodeKind.SoftBreak),
					seeBlocks: comment.seeBlocks
						.flatMap((block) => createNode(block.content).flat(1))
						.filter((val: any) => val.kind !== DocNodeKind.SoftBreak),
				};
			}

			default:
				return {};
		}
	};

	return item.kind === DocNodeKind.Paragraph || item.kind === DocNodeKind.Section
		? (item as DocNodeContainer).nodes
				.flatMap((node) => createNode(node))
				.filter((val: any) => val.kind !== DocNodeKind.SoftBreak)
		: createNode(item);
}

function itemInfo(item: ApiDeclaredItem) {
	const sourceExcerpt = item.excerpt.text.trim();

	const isStatic = ApiStaticMixin.isBaseClassOf(item) && item.isStatic;
	const isProtected = ApiProtectedMixin.isBaseClassOf(item) && item.isProtected;
	const isReadonly = ApiReadonlyMixin.isBaseClassOf(item) && item.isReadonly;
	const isAbstract = ApiAbstractMixin.isBaseClassOf(item) && item.isAbstract;
	const isOptional = ApiOptionalMixin.isBaseClassOf(item) && item.isOptional;
	const isDeprecated = Boolean(item.tsdocComment?.deprecatedBlock);

	const hasSummary = Boolean(item.tsdocComment?.summarySection);

	return {
		kind: item.kind,
		displayName: item.displayName,
		sourceURL: item.sourceLocation.fileUrl,
		sourceLine: item.sourceLocation.fileLine,
		sourceExcerpt,
		summary: hasSummary ? itemTsDoc(item.tsdocComment!, item) : null,
		isStatic,
		isProtected,
		isReadonly,
		isAbstract,
		isDeprecated,
		isOptional,
	};
}

/**
 * This takes an api item with a parameter list and resolves the names and descriptions of all the parameters.
 *
 * @remarks
 * This is different from accessing `Parameter#name` or `Parameter.tsdocBlockComment` as this method cross-references the associated tsdoc
 * parameter names and descriptions and uses them as a higher precedence to the source code.
 * @param item - The api item to resolve parameter data for
 * @returns An array of parameters
 */
function resolveParameters(item: ApiDocumentedItem & ApiParameterListMixin) {
	return item.parameters.map((param, idx) => {
		const tsdocAnalog =
			item.tsdocComment?.params.blocks[idx] ??
			item
				.getMergedSiblings()
				.find(
					(paramList): paramList is ApiDocumentedItem & ApiParameterListMixin =>
						ApiParameterListMixin.isBaseClassOf(paramList) && paramList.overloadIndex === 1,
				)?.tsdocComment?.params.blocks[idx];

		return {
			name: param.tsdocParamBlock?.parameterName ?? tsdocAnalog?.parameterName ?? param.name,
			description: param.tsdocParamBlock?.content ?? tsdocAnalog?.content,
			isOptional: param.isOptional,
			isRest: param.isRest,
			parameterTypeExcerpt: param.parameterTypeExcerpt,
		};
	});
}

function itemTypeParameters(item: ApiTypeParameterListMixin) {
	// {
	//     Name: typeParam.name,
	//     Constraints: <ExcerptText excerpt={typeParam.constraintExcerpt} apiPackage={item.getAssociatedPackage()!} />,
	//     Optional: typeParam.isOptional ? 'Yes' : 'No',
	//     Default: <ExcerptText excerpt={typeParam.defaultTypeExcerpt} apiPackage={item.getAssociatedPackage()!} />,
	//     Description: typeParam.tsdocTypeParamBlock ? (
	//         <TSDoc item={item} tsdoc={typeParam.tsdocTypeParamBlock.content} />
	//     ) : (
	//         'None'
	//     ),
	// }

	return item.typeParameters.map((typeParam) => ({
		name: typeParam.name,
		constraintsExcerpt: itemExcerptText(typeParam.constraintExcerpt, item.getAssociatedPackage()!),
		isOptional: typeParam.isOptional,
		defaultExcerpt: itemExcerptText(typeParam.defaultTypeExcerpt, item.getAssociatedPackage()!),
		description: typeParam.tsdocTypeParamBlock ? itemTsDoc(typeParam.tsdocTypeParamBlock.content, item) : null,
	}));
}

function itemParameters(item: ApiDocumentedItem & ApiParameterListMixin) {
	const params = resolveParameters(item);

	// {
	//     Name: param.isRest ? `...${param.name}` : param.name,
	//     Type: <ExcerptText excerpt={param.parameterTypeExcerpt} apiPackage={item.getAssociatedPackage()!} />,
	//     Optional: param.isOptional ? 'Yes' : 'No',
	//     Description: param.description ? <TSDoc item={item} tsdoc={param.description} /> : 'None',
	// }

	return params.map((param) => ({
		name: param.isRest ? `...${param.name}` : param.name,
		typeExcerpt: itemExcerptText(param.parameterTypeExcerpt, item.getAssociatedPackage()!),
		isOptional: param.isOptional,
		description: param.description ? itemTsDoc(param.description, item) : null,
	}));
}

function itemConstructor(item: ApiConstructor) {
	return {
		kind: item.kind,
		name: item.displayName,
		sourceURL: item.sourceLocation.fileUrl,
		sourceLine: item.sourceLocation.fileLine,
		parametersString: parametersString(item),
		summary: item.tsdocComment ? itemTsDoc(item.tsdocComment, item) : null,
		parameters: itemParameters(item),
	};
}

function isEventLike(item: ApiItem): item is ApiEvent {
	return item.kind === ApiItemKind.Event;
}

function itemEvent(item: ApiItemContainerMixin) {
	const members = resolveMembers(item, isEventLike);

	return members.map((event) => {
		const hasSummary = Boolean(event.item.tsdocComment?.summarySection);

		return {
			...itemInfo(event.item),
			inheritedFrom: event.inherited ? resolveItemURI(event.inherited) : null,
			summary: hasSummary ? itemTsDoc(event.item.tsdocComment!, event.item) : null,
			parameters: itemParameters(event.item),
		};
	});
}

function isPropertyLike(item: ApiItem): item is ApiProperty | ApiPropertySignature {
	return item.kind === ApiItemKind.Property || item.kind === ApiItemKind.PropertySignature;
}

function itemProperty(item: ApiItemContainerMixin) {
	const members = resolveMembers(item, isPropertyLike);

	return members.map((property) => {
		const hasSummary = Boolean(property.item.tsdocComment?.summarySection);

		return {
			...itemInfo(property.item),
			inheritedFrom: property.inherited ? resolveItemURI(property.inherited) : null,
			typeExcerpt: itemExcerptText(property.item.propertyTypeExcerpt, property.item.getAssociatedPackage()!),
			summary: hasSummary ? itemTsDoc(property.item.tsdocComment!, property.item) : null,
		};
	});
}

function parametersString(item: ApiDocumentedItem & ApiParameterListMixin) {
	return resolveParameters(item).reduce((prev, cur, index) => {
		if (index === 0) {
			return `${prev}${cur.isRest ? '...' : ''}${cur.isOptional ? `${cur.name}?` : cur.name}`;
		}

		return `${prev}, ${cur.isRest ? '...' : ''}${cur.isOptional ? `${cur.name}?` : cur.name}`;
	}, '');
}

function isMethodLike(item: ApiItem): item is ApiMethod | ApiMethodSignature {
	return (
		item.kind === ApiItemKind.Method ||
		(item.kind === ApiItemKind.MethodSignature && (item as ApiMethod).overloadIndex <= 1)
	);
}

function itemMethod(item: ApiItemContainerMixin) {
	const members = resolveMembers(item, isMethodLike);

	const methodItem = (method: {
		inherited?: ApiItemContainerMixin | undefined;
		item: ApiMethod | ApiMethodSignature;
	}) => {
		const hasSummary = Boolean(method.item.tsdocComment?.summarySection);

		return {
			...itemInfo(method.item),
			overloadIndex: method.item.overloadIndex,
			parametersString: parametersString(method.item),
			returnTypeExcerpt: itemExcerptText(method.item.returnTypeExcerpt, method.item.getAssociatedPackage()!),
			inheritedFrom: method.inherited ? resolveItemURI(method.inherited) : null,
			typeParameters: itemTypeParameters(method.item),
			parameters: itemParameters(method.item),
			summary: hasSummary ? itemTsDoc(method.item.tsdocComment!, method.item) : null,
		};
	};

	return members.map((method) => {
		// const parent = method.item.parent as ApiDeclaredItem;
		const hasOverload =
			method.item
				.getMergedSiblings()
				.filter((sibling) => sibling.kind === ApiItemKind.Method || sibling.kind === ApiItemKind.MethodSignature)
				.length > 1;

		const overloads = method.item
			.getMergedSiblings()
			.filter((sibling) => sibling.kind === ApiItemKind.Method || sibling.kind === ApiItemKind.MethodSignature)
			.map((sibling) => methodItem({ item: sibling as ApiMethod | ApiMethodSignature }));

		return {
			...methodItem(method),
			overloads: hasOverload ? overloads : [],
		};
	});
}

function itemMembers(item: ApiDeclaredItem & ApiItemContainerMixin) {
	const events = hasEvents(item) ? itemEvent(item) : [];
	const properties = hasProperties(item) ? itemProperty(item) : [];
	const methods = hasMethods(item) ? itemMethod(item) : [];

	return {
		events,
		properties,
		methods,
	};
}

export function itemHierarchyText({
	item,
	type,
}: {
	readonly item: ApiClass | ApiInterface;
	readonly type: 'Extends' | 'Implements';
}) {
	if (
		(item.kind === ApiItemKind.Class &&
			(item as ApiClass).extendsType === undefined &&
			(item as ApiClass).implementsTypes.length === 0) ||
		(item.kind === ApiItemKind.Interface && !(item as ApiInterface).extendsTypes)
	) {
		return null;
	}

	let excerpts: Excerpt[];

	if (item.kind === ApiItemKind.Class) {
		if (type === 'Implements') {
			if ((item as ApiClass).implementsTypes.length === 0) {
				return null;
			}

			excerpts = (item as ApiClass).implementsTypes.map((typeExcerpt) => typeExcerpt.excerpt);
		} else {
			if (!(item as ApiClass).extendsType) {
				return null;
			}

			excerpts = [(item as ApiClass).extendsType!.excerpt];
		}
	} else {
		if ((item as ApiInterface).extendsTypes.length === 0) {
			return null;
		}

		excerpts = (item as ApiInterface).extendsTypes.map((typeExcerpt) => typeExcerpt.excerpt);
	}

	// return (
	// 	<div className="flex flex-col gap-4">
	// 		{excerpts.map((excerpt, idx) => (
	// 			<div className="flex flex-row place-items-center gap-4" key={`${type}-${idx}`}>
	// 				<h3 className="text-xl font-bold">{type}</h3>
	// 				<span className="break-all font-mono space-y-2">
	// 					<ExcerptText excerpt={excerpt} apiPackage={item.getAssociatedPackage()!} />
	// 				</span>
	// 			</div>
	// 		))}
	// 	</div>
	// );

	return excerpts.map((excerpt) => {
		return {
			type,
			excerpts: itemExcerptText(excerpt, item.getAssociatedPackage()!),
		};
	});
}

function itemClass(item: ApiClass) {
	const constructor = item.members.find((member) => member.kind === ApiItemKind.Constructor) as
		| ApiConstructor
		| undefined;

	return {
		...itemInfo(item),
		extends: itemHierarchyText({ item, type: 'Extends' }),
		implements: itemHierarchyText({ item, type: 'Implements' }),
		typeParameters: itemTypeParameters(item),
		constructor: constructor ? itemConstructor(constructor) : null,
		members: itemMembers(item),
	};
}

function itemFunction(item: ApiFunction) {
	const functionItem = (item: ApiFunction) => {
		return {
			...itemInfo(item),
			overloadIndex: item.overloadIndex,
			typeParameters: itemTypeParameters(item),
			parameters: itemParameters(item),
		};
	};

	const hasOverloads = item.getMergedSiblings().length > 1;
	const overloads = item.getMergedSiblings().map((sibling) => functionItem(sibling as ApiFunction));

	return {
		...functionItem(item),
		overloads: hasOverloads ? overloads : [],
	};
}

function itemInterface(item: ApiInterface) {
	return {
		...itemInfo(item),
		extends: itemHierarchyText({ item, type: 'Extends' }),
		typeParameters: itemTypeParameters(item),
		members: itemMembers(item),
	};
}

function itemUnion(item: ApiTypeAlias) {
	const union: ExcerptToken[][] = [];
	let currentUnionMember: ExcerptToken[] = [];
	let depth = 0;
	for (const token of item.typeExcerpt.spannedTokens) {
		if (token.text.includes('?')) {
			return [item.typeExcerpt.spannedTokens];
		}

		depth += token.text.split('<').length - token.text.split('>').length;

		if (token.text.trim() === '|' && depth === 0) {
			if (currentUnionMember.length) {
				union.push(currentUnionMember);
				currentUnionMember = [];
			}
		} else if (depth === 0 && token.kind === ExcerptTokenKind.Content && token.text.includes('|')) {
			for (const [idx, tokenpart] of token.text.split('|').entries()) {
				if (currentUnionMember.length && depth === 0 && idx === 0) {
					currentUnionMember.push(new ExcerptToken(ExcerptTokenKind.Content, tokenpart));
					union.push(currentUnionMember);
					currentUnionMember = [];
				} else if (currentUnionMember.length && depth === 0) {
					union.push(currentUnionMember);
					currentUnionMember = [new ExcerptToken(ExcerptTokenKind.Content, tokenpart)];
				} else if (tokenpart.length) {
					currentUnionMember.push(new ExcerptToken(ExcerptTokenKind.Content, tokenpart));
				}
			}
		} else {
			currentUnionMember.push(token);
		}
	}

	if (currentUnionMember.length) {
		union.push(currentUnionMember);
	}

	return union;
}

function itemTypeAlias(item: ApiTypeAlias) {
	return {
		...itemInfo(item),
		typeParameters: itemTypeParameters(item),
		unionMembers: itemUnion(item).map((member) =>
			itemExcerptText(new Excerpt(member, { startIndex: 0, endIndex: member.length }), item.getAssociatedPackage()!),
		),
	};
}

function itemVariable(item: ApiVariable) {
	return {
		...itemInfo(item),
	};
}

function itemEnumMember(item: ApiEnumMember) {
	return {
		...itemInfo(item),
		name: item.name,
		initializerExcerpt: item.initializerExcerpt
			? itemExcerptText(item.initializerExcerpt, item.getAssociatedPackage()!)
			: null,
	};
}

function itemEnum(item: ApiEnum) {
	return {
		...itemInfo(item),
		members: item.members.map((member) => itemEnumMember(member)),
	};
}

function memberKind(member: ApiItem | null) {
	switch (member?.kind) {
		case 'Class': {
			const classMember = member as ApiClass;
			return itemClass(classMember);
		}

		case 'Function': {
			const functionMember = member as ApiFunction;
			return itemFunction(functionMember);
		}

		case 'Interface': {
			const interfaceMember = member as ApiInterface;
			return itemInterface(interfaceMember);
		}

		case 'TypeAlias': {
			const typeAliasMember = member as ApiTypeAlias;
			return itemTypeAlias(typeAliasMember);
		}

		case 'Variable': {
			const variableMember = member as ApiVariable;
			return itemVariable(variableMember);
		}

		case 'Enum': {
			const enumMember = member as ApiEnum;
			return itemEnum(enumMember);
		}

		default:
			return null;
	}
}

async function writeSplitDocsToFileSystem({
	member,
	packageName,
	tag = 'main',
	overrideName,
}: {
	member: Record<string, any>;
	overrideName?: string;
	packageName: string;
	tag: string;
}) {
	const dir = 'split';

	try {
		(await stat(join(cwd(), 'docs', packageName, dir))).isDirectory();
	} catch {
		await mkdir(join(cwd(), 'docs', packageName, dir), { recursive: true });
	}

	await writeFile(
		join(
			cwd(),
			'docs',
			packageName,
			dir,
			`${tag}.${overrideName ?? `${member.displayName.toLowerCase()}.${member.kind.toLowerCase()}`}.api.json`,
		),
		JSON.stringify(member),
	);
}

export async function generateSplitDocumentation({
	fetchPackageVersions = fetchVersions,
	fetchPackageVersionDocs = fetchVersionDocs,
} = {}) {
	for (const pkgName of PACKAGES) {
		const versions = await fetchPackageVersions(pkgName);

		for (const version of versions) {
			const data = await fetchPackageVersionDocs(pkgName, version);
			const model = new ApiModel();
			model.addMember(ApiPackage.loadFromJson(data));
			const pkg = model.tryGetPackageByName(pkgName);
			const entry = pkg?.entryPoints[0];

			if (!entry) {
				continue;
			}

			await writeSplitDocsToFileSystem({
				member: pkg.dependencies ?? [],
				packageName: pkgName,
				tag: version,
				overrideName: 'dependencies',
			});

			const members = entry.members
				.filter((item) => {
					switch (item.kind) {
						case ApiItemKind.Function:
							return (item as ApiFunction).overloadIndex === 1;
						case ApiItemKind.Interface:
							return !entry.members.some(
								(innerItem) => innerItem.kind === ApiItemKind.Class && innerItem.displayName === item.displayName,
							);
						default:
							return true;
					}
				})
				.map((item) => ({
					kind: item.kind,
					name: item.displayName,
					href: resolveItemURI(item),
				}));

			await writeSplitDocsToFileSystem({
				member: members,
				packageName: pkgName,
				tag: version,
				overrideName: 'sitemap',
			});

			for (const member of members) {
				const item = `${member.name}:${member.kind}`;
				const [memberName, overloadIndex] = decodeURIComponent(item).split(':');

				// eslint-disable-next-line prefer-const
				let { containerKey, displayName: name } = findMember(model, pkgName, memberName) ?? {};
				if (name && overloadIndex && !Number.isNaN(Number.parseInt(overloadIndex, 10))) {
					containerKey = ApiFunction.getContainerKey(name, Number.parseInt(overloadIndex, 10));
				}

				const foundMember = memberName && containerKey ? findMemberByKey(model, pkgName, containerKey) ?? null : null;

				const returnValue = memberKind(foundMember);

				if (!returnValue) {
					continue;
				}

				await writeSplitDocsToFileSystem({ member: returnValue, packageName: pkgName, tag: version });
			}
		}
	}
}
