import {
	ApiModel,
	ApiDeclaredItem,
	ApiPropertyItem,
	ApiMethod,
	ApiParameterListMixin,
	ApiTypeParameterListMixin,
	ApiClass,
	ApiFunction,
	ApiItemKind,
	ApiTypeAlias,
	ApiEnum,
	ApiInterface,
	ApiMethodSignature,
	ApiPropertySignature,
	ApiVariable,
	ApiItem,
	ApiConstructor,
	ApiItemContainerMixin,
} from '@microsoft/api-extractor-model';
import { generateTypeParamData } from './TypeParameterMixin';
import { Visibility } from './Visibility';
import { createCommentNode } from './comment';
import type { DocBlockJSON } from './comment/CommentBlock';
import type { AnyDocNodeJSON } from './comment/CommentNode';
import { DocNodeContainerJSON, nodeContainer } from './comment/CommentNodeContainer';
import {
	generatePath,
	genParameter,
	genReference,
	genToken,
	resolveName,
	TokenDocumentation,
} from '~/util/parse.server';

export interface ReferenceData {
	name: string;
	path: string;
}

export interface InheritanceData {
	parentName: string;
	path: string;
	parentKey: string;
}

export interface ApiInheritableJSON {
	inheritanceData: InheritanceData | null;
}

export interface ApiItemJSON {
	kind: string;
	name: string;
	referenceData: ReferenceData;
	excerpt: string;
	excerptTokens: TokenDocumentation[];
	remarks: DocNodeContainerJSON | null;
	summary: DocNodeContainerJSON | null;
	deprecated: DocNodeContainerJSON | null;
	comment: AnyDocNodeJSON | null;
	containerKey: string;
	path: string[];
}

export interface ApiPropertyItemJSON extends ApiItemJSON, ApiInheritableJSON {
	propertyTypeTokens: TokenDocumentation[];
	readonly: boolean;
	optional: boolean;
}

export interface ApiTypeParameterListJSON {
	typeParameters: ApiTypeParameterJSON[];
}

export interface ApiTypeParameterJSON {
	name: string;
	constraintTokens: TokenDocumentation[];
	defaultTokens: TokenDocumentation[];
	optional: boolean;
	commentBlock: DocBlockJSON | null;
}

export interface ApiParameterListJSON {
	parameters: ApiParameterJSON[];
}

export interface ApiMethodSignatureJSON
	extends ApiItemJSON,
		ApiTypeParameterListJSON,
		ApiParameterListJSON,
		ApiInheritableJSON {
	returnTypeTokens: TokenDocumentation[];
	optional: boolean;
	overloadIndex: number;
}

export interface ApiMethodJSON extends ApiMethodSignatureJSON {
	static: boolean;
	visibility: Visibility;
}

export interface ApiParameterJSON {
	name: string;
	isOptional: boolean;
	tokens: TokenDocumentation[];
	paramCommentBlock: DocBlockJSON | null;
}

export interface ApiClassJSON extends ApiItemJSON, ApiTypeParameterListJSON {
	constructor: ApiConstructorJSON | null;
	properties: ApiPropertyItemJSON[];
	methods: ApiMethodJSON[];
	extendsTokens: TokenDocumentation[];
	implementsTokens: TokenDocumentation[][];
}

export interface ApiTypeAliasJSON extends ApiItemJSON, ApiTypeParameterListJSON {
	typeTokens: TokenDocumentation[];
}

export interface EnumMemberData {
	name: string;
	initializerTokens: TokenDocumentation[];
	summary: DocNodeContainerJSON | null;
}

export interface ApiEnumJSON extends ApiItemJSON {
	members: EnumMemberData[];
}

export interface ApiInterfaceJSON extends ApiItemJSON, ApiTypeParameterListJSON {
	properties: ApiPropertyItemJSON[];
	methods: ApiMethodSignatureJSON[];
	extendsTokens: TokenDocumentation[][] | null;
}

export interface ApiVariableJSON extends ApiItemJSON {
	typeTokens: TokenDocumentation[];
	readonly: boolean;
}

export interface ApiFunctionJSON extends ApiItemJSON, ApiTypeParameterListJSON, ApiParameterListJSON {
	returnTypeTokens: TokenDocumentation[];
	overloadIndex: number;
}

export interface ApiConstructorJSON extends ApiItemJSON, ApiParameterListJSON {
	protected: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ApiNodeJSONEncoder {
	public static encode(model: ApiModel, node: ApiItem, version: string) {
		if (!(node instanceof ApiDeclaredItem)) {
			throw new Error(`Cannot serialize node of type ${node.kind}`);
		}

		switch (node.kind) {
			case ApiItemKind.Class:
				return this.encodeClass(model, node as ApiClass, version);
			case ApiItemKind.Function:
				return this.encodeFunction(model, node as ApiFunction, version);
			case ApiItemKind.Interface:
				return this.encodeInterface(model, node as ApiInterface, version);
			case ApiItemKind.TypeAlias:
				return this.encodeTypeAlias(model, node as ApiTypeAlias, version);
			case ApiItemKind.Enum:
				return this.encodeEnum(model, node as ApiEnum, version);
			case ApiItemKind.Variable:
				return this.encodeVariable(model, node as ApiVariable, version);
			default:
				throw new Error(`Unknown API item kind: ${node.kind}`);
		}
	}

	public static encodeItem(model: ApiModel, item: ApiDeclaredItem, version: string): ApiItemJSON {
		const path = [];
		for (const _item of item.getHierarchy()) {
			switch (_item.kind) {
				case 'None':
				case 'EntryPoint':
				case 'Model':
					break;
				default:
					path.push(resolveName(_item));
			}
		}

		return {
			kind: item.kind,
			name: resolveName(item),
			referenceData: genReference(item, version),
			excerpt: item.excerpt.text,
			excerptTokens: item.excerpt.spannedTokens.map((token) => genToken(model, token, version)),
			remarks: item.tsdocComment?.remarksBlock
				? (createCommentNode(item.tsdocComment.remarksBlock, model, version, item.parent) as DocNodeContainerJSON)
				: null,
			summary: item.tsdocComment?.summarySection
				? (createCommentNode(item.tsdocComment.summarySection, model, version, item.parent) as DocNodeContainerJSON)
				: null,
			deprecated: item.tsdocComment?.deprecatedBlock
				? (createCommentNode(item.tsdocComment.deprecatedBlock, model, version, item.parent) as DocNodeContainerJSON)
				: null,
			path,
			containerKey: item.containerKey,
			comment: item.tsdocComment ? createCommentNode(item.tsdocComment, model, version, item.parent) : null,
		};
	}

	public static encodeParameterList(
		model: ApiModel,
		item: ApiParameterListMixin & ApiDeclaredItem,
		version: string,
	): { parameters: ApiParameterJSON[] } {
		return {
			parameters: item.parameters.map((param) => genParameter(model, param, version)),
		};
	}

	public static encodeTypeParameterList(
		model: ApiModel,
		item: ApiTypeParameterListMixin & ApiDeclaredItem,
		version: string,
	) {
		return {
			typeParameters: item.typeParameters.map((param) => generateTypeParamData(model, param, version, item.parent)),
		};
	}

	public static encodeProperty(
		model: ApiModel,
		item: ApiPropertyItem,
		parent: ApiItemContainerMixin,
		version: string,
	): ApiPropertyItemJSON {
		return {
			...this.encodeItem(model, item, version),
			...this.encodeInheritanceData(item, parent, version),
			propertyTypeTokens: item.propertyTypeExcerpt.spannedTokens.map((token) => genToken(model, token, version)),
			readonly: item.isReadonly,
			optional: item.isOptional,
		};
	}

	public static encodeInheritanceData(
		item: ApiDeclaredItem,
		parent: ApiItemContainerMixin,
		version: string,
	): ApiInheritableJSON {
		return {
			inheritanceData:
				item.parent && item.parent.containerKey !== parent.containerKey
					? {
							parentKey: item.parent.containerKey,
							parentName: item.parent.displayName,
							path: generatePath(item.parent.getHierarchy(), version),
					  }
					: null,
		};
	}

	public static encodeFunction(model: ApiModel, item: ApiFunction, version: string) {
		return {
			...this.encodeItem(model, item, version),
			...this.encodeParameterList(model, item, version),
			...this.encodeTypeParameterList(model, item, version),
			returnTypeTokens: item.returnTypeExcerpt.spannedTokens.map((token) => genToken(model, token, version)),
			overloadIndex: item.overloadIndex,
		};
	}

	public static encodeMethodSignature(
		model: ApiModel,
		item: ApiMethodSignature,
		parent: ApiItemContainerMixin,
		version: string,
	): ApiMethodSignatureJSON {
		return {
			...this.encodeFunction(model, item, version),
			...this.encodeInheritanceData(item, parent, version),
			optional: item.isOptional,
		};
	}

	public static encodeMethod(
		model: ApiModel,
		item: ApiMethod,
		parent: ApiItemContainerMixin,
		version: string,
	): ApiMethodJSON {
		return {
			...this.encodeMethodSignature(model, item, parent, version),
			static: item.isStatic,
			visibility: item.isProtected ? Visibility.Protected : Visibility.Public,
		};
	}

	public static encodeClass(model: ApiModel, item: ApiClass, version: string): ApiClassJSON {
		const extendsExcerpt = item.extendsType?.excerpt;

		const methods: ApiMethodJSON[] = [];
		const properties: ApiPropertyItemJSON[] = [];

		let constructor: ApiConstructor | undefined;

		for (const member of item.findMembersWithInheritance().items) {
			switch (member.kind) {
				case ApiItemKind.Method:
					methods.push(this.encodeMethod(model, member as ApiMethod, item, version));
					break;
				case ApiItemKind.Property:
					properties.push(this.encodeProperty(model, member as ApiPropertyItem, item, version));
					break;
				case ApiItemKind.Constructor:
					constructor = member as ApiConstructor;
					break;
				default:
					break;
			}
		}

		return {
			...this.encodeItem(model, item, version),
			...this.encodeTypeParameterList(model, item, version),
			constructor: constructor ? this.encodeConstructor(model, constructor, version) : null,
			extendsTokens: extendsExcerpt ? extendsExcerpt.spannedTokens.map((token) => genToken(model, token, version)) : [],
			implementsTokens: item.implementsTypes.map((excerpt) =>
				excerpt.excerpt.spannedTokens.map((token) => genToken(model, token, version)),
			),
			methods,
			properties,
		};
	}

	public static encodeTypeAlias(model: ApiModel, item: ApiTypeAlias, version: string): ApiTypeAliasJSON {
		return {
			...this.encodeItem(model, item, version),
			...this.encodeTypeParameterList(model, item, version),
			typeTokens: item.typeExcerpt.spannedTokens.map((token) => genToken(model, token, version)),
		};
	}

	public static encodeEnum(model: ApiModel, item: ApiEnum, version: string): ApiEnumJSON {
		return {
			...this.encodeItem(model, item, version),
			members: item.members.map((member) => ({
				name: member.name,
				initializerTokens:
					member.initializerExcerpt?.spannedTokens.map((token) => genToken(model, token, version)) ?? [],
				summary: member.tsdocComment ? nodeContainer(member.tsdocComment.summarySection, model, version, member) : null,
			})),
		};
	}

	public static encodeInterface(model: ApiModel, item: ApiInterface, version: string): ApiInterfaceJSON {
		const methods: ApiMethodSignatureJSON[] = [];
		const properties: ApiPropertyItemJSON[] = [];

		for (const member of item.findMembersWithInheritance().items) {
			switch (member.kind) {
				case ApiItemKind.MethodSignature:
					methods.push(this.encodeMethodSignature(model, member as ApiMethodSignature, item, version));
					break;
				case ApiItemKind.PropertySignature:
					properties.push(this.encodeProperty(model, member as ApiPropertySignature, item, version));
					break;
				default:
					break;
			}
		}

		return {
			...this.encodeItem(model, item, version),
			...this.encodeTypeParameterList(model, item, version),
			extendsTokens: item.extendsTypes.map((excerpt) =>
				excerpt.excerpt.spannedTokens.map((token) => genToken(model, token, version)),
			),
			methods,
			properties,
		};
	}

	public static encodeVariable(model: ApiModel, item: ApiVariable, version: string): ApiVariableJSON {
		return {
			...this.encodeItem(model, item, version),
			typeTokens: item.variableTypeExcerpt.spannedTokens.map((token) => genToken(model, token, version)),
			readonly: item.isReadonly,
		};
	}

	public static encodeConstructor(model: ApiModel, item: ApiConstructor, version: string): ApiConstructorJSON {
		return {
			...this.encodeItem(model, item, version),
			...this.encodeParameterList(model, item, version),
			protected: item.isProtected,
		};
	}
}
