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
} from '@microsoft/api-extractor-model';
import { generateTypeParamData } from './TypeParameterMixin';
import { Visibility } from './Visibility';
import { createCommentNode } from './comment';
import type { DocBlockJSON } from './comment/CommentBlock';
import type { AnyDocNodeJSON } from './comment/CommentNode';
import { DocNodeContainerJSON, nodeContainer } from './comment/CommentNodeContainer';
import { genParameter, genReference, genToken, resolveName, TokenDocumentation } from '~/util/parse.server';

export interface ReferenceData {
	name: string;
	path: string;
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

export interface ApiPropertyItemJSON extends ApiItemJSON {
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

export interface ApiMethodSignatureJSON extends ApiItemJSON, ApiTypeParameterListJSON {
	parameters: ApiParameterJSON[];
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

export interface ApiFunctionJSON extends ApiItemJSON, ApiTypeParameterListJSON {
	parameters: ApiParameterJSON[];
	returnTypeTokens: TokenDocumentation[];
	overloadIndex: number;
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ApiNodeJSONEncoder {
	public static encode(model: ApiModel, node: ApiItem) {
		if (!(node instanceof ApiDeclaredItem)) {
			throw new Error(`Cannot serialize node of type ${node.kind}`);
		}

		switch (node.kind) {
			case ApiItemKind.Class:
				return this.encodeClass(model, node as ApiClass);
			case ApiItemKind.Function:
				return this.encodeFunction(model, node as ApiFunction);
			case ApiItemKind.Interface:
				return this.encodeInterface(model, node as ApiInterface);
			case ApiItemKind.Method:
				return this.encodeMethod(model, node as ApiMethod);
			case ApiItemKind.MethodSignature:
				return this.encodeMethodSignature(model, node as ApiMethodSignature);
			case ApiItemKind.PropertySignature:
			case ApiItemKind.Property:
				return this.encodeProperty(model, node as ApiPropertyItem);
			case ApiItemKind.TypeAlias:
				return this.encodeTypeAlias(model, node as ApiTypeAlias);
			case ApiItemKind.Enum:
				return this.encodeEnum(model, node as ApiEnum);
			case ApiItemKind.Variable:
				return this.encodeVariable(model, node as ApiVariable);
			default:
				throw new Error(`Unknown API item kind: ${node.kind}`);
		}
	}

	public static encodeItem(model: ApiModel, item: ApiDeclaredItem): ApiItemJSON {
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
			referenceData: genReference(item),
			excerpt: item.excerpt.text,
			excerptTokens: item.excerpt.spannedTokens.map((token) => genToken(model, token)),
			remarks: item.tsdocComment?.remarksBlock
				? (createCommentNode(item.tsdocComment.remarksBlock, model, item.parent) as DocNodeContainerJSON)
				: null,
			summary: item.tsdocComment?.summarySection
				? (createCommentNode(item.tsdocComment.summarySection, model, item.parent) as DocNodeContainerJSON)
				: null,
			deprecated: item.tsdocComment?.deprecatedBlock
				? (createCommentNode(item.tsdocComment.deprecatedBlock, model, item.parent) as DocNodeContainerJSON)
				: null,
			path,
			containerKey: item.containerKey,
			comment: item.tsdocComment ? createCommentNode(item.tsdocComment, model, item.parent) : null,
		};
	}

	public static encodeParameterList(
		model: ApiModel,
		item: ApiParameterListMixin & ApiDeclaredItem,
	): { parameters: ApiParameterJSON[] } {
		return {
			parameters: item.parameters.map((param) => genParameter(model, param)),
		};
	}

	public static encodeTypeParameterList(model: ApiModel, item: ApiTypeParameterListMixin & ApiDeclaredItem) {
		return {
			typeParameters: item.typeParameters.map((param) => generateTypeParamData(model, param, item.parent)),
		};
	}

	public static encodeProperty(model: ApiModel, item: ApiPropertyItem): ApiPropertyItemJSON {
		return {
			...this.encodeItem(model, item),
			propertyTypeTokens: item.propertyTypeExcerpt.spannedTokens.map((token) => genToken(model, token)),
			readonly: item.isReadonly,
			optional: item.isOptional,
		};
	}

	public static encodeFunction(model: ApiModel, item: ApiFunction) {
		return {
			...this.encodeItem(model, item),
			...this.encodeParameterList(model, item),
			...this.encodeTypeParameterList(model, item),
			returnTypeTokens: item.returnTypeExcerpt.spannedTokens.map((token) => genToken(model, token)),
			overloadIndex: item.overloadIndex,
		};
	}

	public static encodeMethodSignature(model: ApiModel, item: ApiMethodSignature): ApiMethodSignatureJSON {
		return {
			...this.encodeFunction(model, item),
			optional: item.isOptional,
		};
	}

	public static encodeMethod(model: ApiModel, item: ApiMethod): ApiMethodJSON {
		return {
			...this.encodeMethodSignature(model, item),
			static: item.isStatic,
			visibility: item.isProtected ? Visibility.Protected : Visibility.Public,
		};
	}

	public static encodeClass(model: ApiModel, item: ApiClass): ApiClassJSON {
		const extendsExcerpt = item.extendsType?.excerpt;

		const methods: ApiMethodJSON[] = [];
		const properties: ApiPropertyItemJSON[] = [];

		for (const member of item.members) {
			switch (member.kind) {
				case ApiItemKind.Method:
					methods.push(this.encodeMethod(model, member as ApiMethod));
					break;
				case ApiItemKind.Property:
					properties.push(this.encodeProperty(model, member as ApiPropertyItem));
					break;
				default:
					break;
			}
		}

		return {
			...this.encodeItem(model, item),
			...this.encodeTypeParameterList(model, item),
			extendsTokens: extendsExcerpt ? extendsExcerpt.spannedTokens.map((token) => genToken(model, token)) : [],
			implementsTokens: item.implementsTypes.map((excerpt) =>
				excerpt.excerpt.spannedTokens.map((token) => genToken(model, token)),
			),
			methods,
			properties,
		};
	}

	public static encodeTypeAlias(model: ApiModel, item: ApiTypeAlias): ApiTypeAliasJSON {
		return {
			...this.encodeItem(model, item),
			...this.encodeTypeParameterList(model, item),
			typeTokens: item.typeExcerpt.spannedTokens.map((token) => genToken(model, token)),
		};
	}

	public static encodeEnum(model: ApiModel, item: ApiEnum): ApiEnumJSON {
		return {
			...this.encodeItem(model, item),
			members: item.members.map((member) => ({
				name: member.name,
				initializerTokens: member.initializerExcerpt?.spannedTokens.map((token) => genToken(model, token)) ?? [],
				summary: member.tsdocComment ? nodeContainer(member.tsdocComment.summarySection, model, member) : null,
			})),
		};
	}

	public static encodeInterface(model: ApiModel, item: ApiInterface): ApiInterfaceJSON {
		const methods: ApiMethodSignatureJSON[] = [];
		const properties: ApiPropertyItemJSON[] = [];

		for (const member of item.members) {
			switch (member.kind) {
				case ApiItemKind.MethodSignature:
					methods.push(this.encodeMethodSignature(model, member as ApiMethodSignature));
					break;
				case ApiItemKind.PropertySignature:
					properties.push(this.encodeProperty(model, member as ApiPropertySignature));
					break;
				default:
					break;
			}
		}

		return {
			...this.encodeItem(model, item),
			...this.encodeTypeParameterList(model, item),
			extendsTokens: item.extendsTypes.map((excerpt) =>
				excerpt.excerpt.spannedTokens.map((token) => genToken(model, token)),
			),
			methods,
			properties,
		};
	}

	public static encodeVariable(model: ApiModel, item: ApiVariable): ApiVariableJSON {
		return {
			...this.encodeItem(model, item),
			typeTokens: item.variableTypeExcerpt.spannedTokens.map((token) => genToken(model, token)),
			readonly: item.isReadonly,
		};
	}
}
