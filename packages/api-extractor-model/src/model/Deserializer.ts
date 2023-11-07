// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { TSDocConfiguration } from '@microsoft/tsdoc';
import type { IExcerptToken } from '../index.js';
import { ExcerptTokenKind } from '../index.js';
import type { IApiDeclaredItemJson } from '../items/ApiDeclaredItem.js';
import type { IApiDocumentedItemJson } from '../items/ApiDocumentedItem.js';
import { type IApiItemJson, type IApiItemOptions, type ApiItem, ApiItemKind } from '../items/ApiItem.js';
import type { IApiPropertyItemJson } from '../items/ApiPropertyItem.js';
import type { IApiAbstractMixinJson } from '../mixins/ApiAbstractMixin.js';
import type { IApiItemContainerJson } from '../mixins/ApiItemContainerMixin.js';
import type { IApiNameMixinJson } from '../mixins/ApiNameMixin.js';
import type { IApiOptionalMixinJson } from '../mixins/ApiOptionalMixin.js';
import type { IApiParameterListJson, IApiParameterOptions } from '../mixins/ApiParameterListMixin.js';
import type { IApiProtectedMixinJson } from '../mixins/ApiProtectedMixin.js';
import type { IApiReadonlyMixinJson } from '../mixins/ApiReadonlyMixin.js';
import type { IApiReleaseTagMixinJson } from '../mixins/ApiReleaseTagMixin.js';
import type { IApiReturnTypeMixinJson } from '../mixins/ApiReturnTypeMixin.js';
import type { IApiStaticMixinJson } from '../mixins/ApiStaticMixin.js';
import type { IApiTypeParameterListMixinJson } from '../mixins/ApiTypeParameterListMixin.js';
import { ApiCallSignature, type IApiCallSignatureOptions } from './ApiCallSignature.js';
import { ApiClass, type IApiClassOptions, type IApiClassJson } from './ApiClass.js';
import { ApiConstructSignature, type IApiConstructSignatureOptions } from './ApiConstructSignature.js';
import { ApiConstructor, type IApiConstructorOptions } from './ApiConstructor.js';
import { ApiEntryPoint, type IApiEntryPointOptions } from './ApiEntryPoint.js';
import { ApiEnum, type IApiEnumOptions } from './ApiEnum.js';
import { ApiEnumMember, type IApiEnumMemberOptions } from './ApiEnumMember.js';
import type { IApiEventOptions } from './ApiEvent.js';
import { ApiEvent } from './ApiEvent.js';
import { ApiFunction, type IApiFunctionOptions } from './ApiFunction.js';
import { ApiIndexSignature, type IApiIndexSignatureOptions } from './ApiIndexSignature.js';
import { ApiInterface, type IApiInterfaceOptions, type IApiInterfaceJson } from './ApiInterface.js';
import { ApiMethod, type IApiMethodOptions } from './ApiMethod.js';
import { ApiMethodSignature, type IApiMethodSignatureOptions } from './ApiMethodSignature.js';
import { ApiModel } from './ApiModel.js';
import { ApiNamespace, type IApiNamespaceOptions } from './ApiNamespace.js';
import { ApiPackage, type IApiPackageOptions, type IApiPackageJson } from './ApiPackage.js';
import { ApiProperty, type IApiPropertyOptions } from './ApiProperty.js';
import { ApiPropertySignature, type IApiPropertySignatureOptions } from './ApiPropertySignature.js';
import { ApiTypeAlias, type IApiTypeAliasOptions, type IApiTypeAliasJson } from './ApiTypeAlias.js';
import { ApiVariable, type IApiVariableOptions, type IApiVariableJson } from './ApiVariable.js';
import { ApiJsonSchemaVersion, type DeserializerContext } from './DeserializerContext.js';

type DocgenAccess = 'private' | 'protected' | 'public';
type DocgenScope = 'global' | 'instance' | 'static';
type DocgenDeprecated = boolean | string;

interface DocgenMetaJson {
	file: string;
	line: number;
	path: string;
}

interface DocgenTypeJson {
	names?: string[] | undefined;
}

interface DocgenVarJson {
	description?: string;
	nullable?: boolean;
	types?: string[][][];
}
type DocgenVarTypeJson = DocgenVarJson | string[][][];
interface DocgenExceptionJson {
	description?: string;
	nullable?: boolean;
	type: DocgenTypeJson;
}

interface DocgenExternalJson {
	description: string;
	meta: DocgenMetaJson;
	name: string;
	see?: string[];
}

interface DocgenTypedefJson {
	access?: DocgenAccess;
	deprecated?: DocgenDeprecated;
	description: string;
	meta: DocgenMetaJson;
	name: string;
	params?: DocgenParamJson[];
	props?: DocgenParamJson[];
	returns?: DocgenVarTypeJson[];
	see?: string[];
	type: DocgenVarTypeJson;
}

interface DocgenEventJson {
	deprecated?: DocgenDeprecated;
	description: string;
	meta: DocgenMetaJson;
	name: string;
	params?: DocgenParamJson[];
	see?: string[];
}

interface DocgenParamJson {
	default?: string;
	description: string;
	name: string;
	nullable?: boolean;
	optional?: boolean;
	type: DocgenVarTypeJson;
	variable?: string;
}

interface DocgenConstructorJson {
	access?: DocgenAccess;
	description: string;
	name: string;
	params?: DocgenParamJson[];
	see?: string[];
}

interface DocgenMethodJson {
	abstract: boolean;
	access?: DocgenAccess;
	async?: boolean;
	deprecated?: DocgenDeprecated;
	description: string;
	emits?: string[];
	examples?: string[];
	generator?: boolean;
	implements?: string[];
	inherited?: boolean;
	inherits?: string;
	meta: DocgenMetaJson;
	name: string;
	params?: DocgenParamJson[];
	returns?: DocgenVarTypeJson[];
	scope: DocgenScope;
	see?: string[];
	throws?: DocgenExceptionJson[];
}

interface DocgenPropertyJson {
	abstract?: boolean;
	access?: DocgenAccess;
	default?: string;
	deprecated?: DocgenDeprecated;
	description: string;
	meta: DocgenMetaJson;
	name: string;
	nullable?: boolean;
	props?: DocgenPropertyJson[];
	readonly?: boolean;
	scope: DocgenScope;
	see?: string[];
	type: DocgenVarTypeJson;
}
interface DocgenClassJson {
	abstract?: boolean;
	access?: DocgenAccess;
	construct: DocgenConstructorJson;
	deprecated?: DocgenDeprecated | string;
	description: string;
	events?: DocgenEventJson[];
	extends?: DocgenVarTypeJson;
	implements?: DocgenVarTypeJson;
	meta: DocgenMetaJson;
	methods?: DocgenMethodJson[];
	name: string;
	props?: DocgenPropertyJson[];
	see?: string[];
}
type DocgenInterfaceJson = DocgenClassJson;

export interface DocgenJson {
	classes: DocgenClassJson[];
	externals: DocgenExternalJson[];
	functions: DocgenMethodJson[];
	interfaces: DocgenInterfaceJson[];
	meta: {
		date: number;
		format: number;
		generator: string;
	};
	typedefs: DocgenTypedefJson[];
}

function formatVarType(type: DocgenVarTypeJson): string {
	return (Array.isArray(type) ? type : type.types ?? []).map((t1) => t1.map((t2) => t2.join('')).join('')).join(' | ');
}

function getFirstType(type: DocgenVarTypeJson): string {
	return (Array.isArray(type) ? type[0]?.[0]?.[0] : type.types?.[0]?.[0]?.[0]) ?? 'unknown';
}

// function mapEvent(_event: DocgenEventJson, _package: string, _parent: DocgenClassJson): void {}

function mapVarType(type: DocgenVarTypeJson, _package: string): IExcerptToken[] {
	const mapper = Array.isArray(type) ? type : type.types ?? [];
	return mapper.flatMap((typ) =>
		typ.reduce<IExcerptToken[]>(
			(arr, [_class, symbol]) => [
				...arr,
				{
					kind: ExcerptTokenKind.Reference,
					text: _class ?? 'unknown',
					canonicalReference: `${_package}!${_class}:class`,
				},
				{ kind: ExcerptTokenKind.Content, text: symbol ?? '' },
			],
			[],
		),
	);
}

function mapProp(
	prop: DocgenPropertyJson,
	_package: string,
	parent: DocgenClassJson | DocgenInterfaceJson,
): IApiNameMixinJson & IApiOptionalMixinJson & IApiPropertyItemJson & IApiReadonlyMixinJson & IApiReleaseTagMixinJson {
	const mappedVarType = mapVarType(prop.type, _package);
	return {
		kind: ApiItemKind.Property,
		name: prop.name,
		isOptional: Boolean(prop.nullable),
		isReadonly: Boolean(prop.readonly),
		docComment: `/**\n * ${prop.description}\n${prop.see?.map((see) => ` * @see ${see}\n`).join('') ?? ''}${
			prop.readonly ? ' * @readonly\n' : ''
		} */`,
		excerptTokens: [
			{
				kind: ExcerptTokenKind.Content,
				text: `${prop.access} ${prop.scope === 'static' ? 'static ' : ''}${prop.readonly ? 'readonly ' : ''}${
					prop.name
				} :`,
			},
			...mappedVarType,
			{
				kind: ExcerptTokenKind.Reference,
				text: formatVarType(prop.type),
				canonicalReference: `${_package}!${getFirstType(prop.type)}:class`,
			},
			{ kind: ExcerptTokenKind.Content, text: ';' },
		],
		propertyTypeTokenRange: { startIndex: 1, endIndex: 1 + mappedVarType.length },
		canonicalReference: `${_package}!${parent.name}#${prop.name}:member`,
		releaseTag: prop.access === 'public' ? 'Public' : 'Internal',
		fileLine: prop.meta.line,
		fileUrlPath: `${prop.meta.path.slice(`packages/${_package}/`.length)}/${prop.meta.file}`,
	};
}

function mapParam(
	param: DocgenParamJson,
	index: number,
	_package: string,
	paramTokens: number[],
): IApiParameterOptions {
	return {
		parameterName: param.name.startsWith('...') ? param.name.slice(3) : param.name,
		isOptional: Boolean(param.optional),
		isRest: param.name.startsWith('...'),
		parameterTypeTokenRange: {
			startIndex: 1 + index + paramTokens.slice(0, index).reduce((akk, num) => akk + num, 0),
			endIndex: 1 + index + paramTokens.slice(0, index + 1).reduce((akk, num) => akk + num, 0),
		},
	};
}

interface IApiMethodJson
	extends IApiAbstractMixinJson,
		IApiDeclaredItemJson,
		IApiNameMixinJson,
		IApiOptionalMixinJson,
		IApiParameterListJson,
		IApiProtectedMixinJson,
		IApiReleaseTagMixinJson,
		IApiReturnTypeMixinJson,
		IApiStaticMixinJson,
		IApiTypeParameterListMixinJson {}

interface IApiConstructorJson
	extends IApiParameterListJson,
		IApiProtectedMixinJson,
		IApiReleaseTagMixinJson,
		IApiDeclaredItemJson {}

function mapMethod(method: DocgenMethodJson, _package: string, parent?: DocgenClassJson): IApiMethodJson {
	const excerptTokens: IExcerptToken[] = [];
	excerptTokens.push({
		kind: ExcerptTokenKind.Content,
		text: `${
			method.scope === 'global'
				? `export function ${method.name}(`
				: `${method.access}${method.scope === 'static' ? ' static' : ''} ${method.name}(`
		}${
			method.params?.length
				? `${method.params[0]!.name}${method.params[0]!.nullable || method.params[0]!.optional ? '?' : ''}`
				: '): '
		}`,
	});
	const paramTokens: number[] = [];
	for (let index = 0; index < (method.params?.length ?? 0) - 1; index++) {
		const newTokens = mapVarType(method.params![index]!.type, _package);
		paramTokens.push(newTokens.length);
		excerptTokens.push(...newTokens);
		excerptTokens.push({
			kind: ExcerptTokenKind.Content,
			text: `, ${method.params![index + 1]!.name}${
				method.params![index + 1]!.nullable || method.params![index + 1]!.optional ? '?' : ''
			}: `,
		});
	}

	if (method.params?.length) {
		const newTokens = mapVarType(method.params[method.params.length - 1]!.type, _package);
		paramTokens.push(newTokens.length);
		excerptTokens.push(...newTokens);
		excerptTokens.push({ kind: ExcerptTokenKind.Content, text: `): ` });
	}

	const returnTokens = mapVarType(method.returns?.[0] ?? [], _package);
	excerptTokens.push(...returnTokens);

	excerptTokens.push({ kind: ExcerptTokenKind.Content, text: ';' });

	return {
		kind: parent ? ApiItemKind.Method : ApiItemKind.Function,
		name: method.name,
		isAbstract: method.abstract,
		isOptional: false,
		isProtected: method.access === 'protected',
		isStatic: method.scope === 'static',
		canonicalReference: `${_package}!${parent ? `${parent.name}!${method.name}:member` : `${method.name}:function`}`,
		overloadIndex: 1,
		parameters: method.params?.map((param, index) => mapParam(param, index, _package, paramTokens)) ?? [],
		releaseTag: method.access === 'public' ? 'Public' : 'Internal',
		returnTypeTokenRange: method.returns?.length
			? method.params?.length
				? { startIndex: 2 + 2 * method.params.length, endIndex: 3 + 2 * method.params.length }
				: { startIndex: 1, endIndex: 2 }
			: { startIndex: 0, endIndex: 0 },
		typeParameters: [],
		docComment: `/**\n * ${method.description}\n${
			method.params?.map((param) => ` * @param ${param.name} - ${param.description}\n`).join('') ?? ''
		}${
			method.returns?.length && !Array.isArray(method.returns[0]) ? ` * @returns ${method.returns[0]!.description}` : ''
		} */`,
		excerptTokens,
		fileLine: method.meta.line,
		fileUrlPath: `${method.meta.path.slice(`packages/${_package}/`.length)}/${method.meta.file}`,
	};
}

export class Deserializer {
	public static deserialize(context: DeserializerContext, jsonObject: IApiItemJson): ApiItem {
		const options: Partial<IApiItemOptions> = {};

		switch (jsonObject.kind) {
			case ApiItemKind.Class:
				ApiClass.onDeserializeInto(options, context, jsonObject as IApiClassJson);
				return new ApiClass(options as IApiClassOptions);
			case ApiItemKind.CallSignature:
				ApiCallSignature.onDeserializeInto(options, context, jsonObject as IApiDeclaredItemJson);
				return new ApiCallSignature(options as IApiCallSignatureOptions);
			case ApiItemKind.Constructor:
				ApiConstructor.onDeserializeInto(options, context, jsonObject as IApiDeclaredItemJson);
				return new ApiConstructor(options as IApiConstructorOptions);
			case ApiItemKind.ConstructSignature:
				ApiConstructSignature.onDeserializeInto(options, context, jsonObject as IApiDeclaredItemJson);
				return new ApiConstructSignature(options as IApiConstructSignatureOptions);
			case ApiItemKind.EntryPoint:
				ApiEntryPoint.onDeserializeInto(options, context, jsonObject);
				return new ApiEntryPoint(options as IApiEntryPointOptions);
			case ApiItemKind.Enum:
				ApiEnum.onDeserializeInto(options, context, jsonObject as IApiDeclaredItemJson);
				return new ApiEnum(options as IApiEnumOptions);
			case ApiItemKind.EnumMember:
				ApiEnumMember.onDeserializeInto(options, context, jsonObject as IApiDeclaredItemJson);
				return new ApiEnumMember(options as IApiEnumMemberOptions);
			case ApiItemKind.Event:
				ApiEvent.onDeserializeInto(options, context, jsonObject as IApiDeclaredItemJson);
				return new ApiEvent(options as IApiEventOptions);
			case ApiItemKind.Function:
				ApiFunction.onDeserializeInto(options, context, jsonObject as IApiDeclaredItemJson);
				return new ApiFunction(options as IApiFunctionOptions);
			case ApiItemKind.IndexSignature:
				ApiIndexSignature.onDeserializeInto(options, context, jsonObject as IApiDeclaredItemJson);
				return new ApiIndexSignature(options as IApiIndexSignatureOptions);
			case ApiItemKind.Interface:
				ApiInterface.onDeserializeInto(options, context, jsonObject as IApiInterfaceJson);
				return new ApiInterface(options as IApiInterfaceOptions);
			case ApiItemKind.Method:
				ApiMethod.onDeserializeInto(options, context, jsonObject as IApiDeclaredItemJson);
				return new ApiMethod(options as IApiMethodOptions);
			case ApiItemKind.MethodSignature:
				ApiMethodSignature.onDeserializeInto(options, context, jsonObject as IApiDeclaredItemJson);
				return new ApiMethodSignature(options as IApiMethodSignatureOptions);
			case ApiItemKind.Model:
				return new ApiModel();
			case ApiItemKind.Namespace:
				ApiNamespace.onDeserializeInto(options, context, jsonObject as IApiDeclaredItemJson);
				return new ApiNamespace(options as IApiNamespaceOptions);
			case ApiItemKind.Package:
				ApiPackage.onDeserializeInto(options, context, jsonObject as IApiPackageJson);
				return new ApiPackage(options as IApiPackageOptions);
			case ApiItemKind.Property:
				ApiProperty.onDeserializeInto(options, context, jsonObject as IApiPropertyItemJson);
				return new ApiProperty(options as IApiPropertyOptions);
			case ApiItemKind.PropertySignature:
				ApiPropertySignature.onDeserializeInto(options, context, jsonObject as IApiPropertyItemJson);
				return new ApiPropertySignature(options as IApiPropertySignatureOptions);
			case ApiItemKind.TypeAlias:
				ApiTypeAlias.onDeserializeInto(options, context, jsonObject as IApiTypeAliasJson);
				return new ApiTypeAlias(options as IApiTypeAliasOptions);
			case ApiItemKind.Variable:
				ApiVariable.onDeserializeInto(options, context, jsonObject as IApiVariableJson);
				return new ApiVariable(options as IApiVariableOptions);
			default:
				throw new Error(`Failed to deserialize unsupported API item type ${JSON.stringify(jsonObject.kind)}`);
		}
	}

	public static deserializeDocgen(jsonObject: DocgenJson, _package: string) {
		const context: DeserializerContext = {
			apiJsonFilename: 'docs.json',
			tsdocConfiguration: new TSDocConfiguration(),
			versionToDeserialize: ApiJsonSchemaVersion.V_1011,
			toolPackage: jsonObject.meta.generator,
			toolVersion: jsonObject.meta.format.toString(),
		};

		let members: (IApiClassJson | IApiInterfaceJson | IApiMethodJson | IApiTypeAliasJson)[] = [];

		for (const _class of jsonObject.classes) {
			const classMembers: (IApiConstructorJson | IApiMethodJson | IApiPropertyItemJson)[] = [
				// ..._class.events.map((event) => mapEvent(event, _package, _class)),
				...(_class.props?.map((prop) => mapProp(prop, _package, _class)) ?? []),
				...(_class.methods?.map((method) => mapMethod(method, _package, _class)) ?? []),
			];
			if (_class.construct) {
				const excerptTokens: IExcerptToken[] = [
					{
						kind: ExcerptTokenKind.Content,
						text: `${_class.construct.access} constructor(${
							_class.construct.params?.length ? `${_class.construct.params[0]?.name}: ` : ');'
						}`,
					},
				];

				const paramTokens: number[] = [];
				for (let index = 0; index < (_class.construct.params?.length ?? 0) - 1; index++) {
					const newTokens = mapVarType(_class.construct.params![index]!.type, _package);
					paramTokens.push(newTokens.length);
					excerptTokens.push(...newTokens);
					excerptTokens.push({
						kind: ExcerptTokenKind.Content,
						text: `, ${_class.construct.params![index + 1]?.name}: `,
					});
				}

				if (_class.construct.params?.length) {
					const newTokens = mapVarType(_class.construct.params[_class.construct.params.length - 1]!.type, _package);
					paramTokens.push(newTokens.length);
					excerptTokens.push(...newTokens);
					excerptTokens.push({ kind: ExcerptTokenKind.Content, text: ');' });
				}

				classMembers.unshift({
					parameters:
						_class.construct.params?.map((param, index) => mapParam(param, index, _package, paramTokens)) ?? [],
					isProtected: _class.construct.access === 'protected',
					releaseTag: _class.construct.access === 'public' ? 'Public' : 'Internal',
					docComment: `/*+\n * ${_class.construct.description}\n${
						_class.construct.params?.map((param) => ` * @param ${param.name} - ${param.description}\n`).join('') ?? ''
					} */`,
					excerptTokens,
					kind: ApiItemKind.Constructor,
					canonicalReference: `${_package}!${_class.name}:constructor`,
					overloadIndex: 0,
				});
			}

			const excerptTokens: IExcerptToken[] = [
				{
					kind: ExcerptTokenKind.Content,
					text: `${_class.access === 'public' ? 'export ' : ''}declare class ${_class.name}${
						_class.extends ? ' extends ' : _class.implements ? ' implements ' : ''
					}`,
				},
			];

			if (_class.extends)
				excerptTokens.push({
					kind: ExcerptTokenKind.Reference,
					text: formatVarType(_class.extends) ?? '',
					canonicalReference: `${_package}!${getFirstType(_class.extends) ?? ''}:class`,
				});

			if (_class.extends && _class.implements)
				excerptTokens.push({ kind: ExcerptTokenKind.Content, text: ' implements ' });

			if (_class.implements)
				excerptTokens.push({
					kind: ExcerptTokenKind.Reference,
					text: formatVarType(_class.implements) ?? '',
					canonicalReference: `${_package}!${getFirstType(_class.implements) ?? ''}:class`,
				});

			members.push({
				members: classMembers,
				kind: ApiItemKind.Class,
				canonicalReference: `${_package}!${_class.name}:class`,
				name: _class.name,
				extendsTokenRange: _class.extends ? { startIndex: 1, endIndex: 2, typeParameters: [] } : undefined,
				excerptTokens,
				implementsTokenRanges: _class.implements
					? [{ startIndex: _class.extends ? 3 : 1, endIndex: _class.extends ? 4 : 2, typeParameters: [] }]
					: [],
				typeParameters: [],
				releaseTag: _class.access === 'public' ? 'Public' : 'Internal',
				docComment: `/**\n * ${_class.description}\n${_class.see?.map((see) => ` * @see ${see}\n`).join('') ?? ''} */`,
				isExported: _class.access === 'public',
				isAbstract: Boolean(_class.abstract),
				fileLine: _class.meta.line,
				fileUrlPath: `${_class.meta.path.slice(`packages/${_package}/`.length)}/${_class.meta.file}`,
			});
		}

		members = [
			...members,
			...jsonObject.functions.map((_func) => mapMethod(_func, _package)),
			...jsonObject.interfaces.map((_interface) => ({
				members: [
					...(_interface.props?.map((prop) => mapProp(prop, _package, _interface)) ?? []),
					...(_interface.methods?.map((method) => mapMethod(method, _package, _interface)) ?? []),
				],
				kind: ApiItemKind.Interface,
				canonicalReference: `${_package}!${_interface.name}:interface`,
				name: _interface.name,
				extendsTokenRanges: [{ startIndex: 0, endIndex: 0, typeParameters: [] }],
				excerptTokens: [
					{
						kind: ExcerptTokenKind.Content,
						text: `${_interface.access === 'public' ? 'export ' : ''}interface ${_interface.name}`,
					},
				],
				typeParameters: [],
				releaseTag: _interface.access === 'public' ? 'Public' : 'Internal',
				docComment: `/**\n * ${_interface.description}\n${
					_interface.see?.map((see) => ` * @see ${see}\n`).join('') ?? ''
				} */`,
				isExported: _interface.access === 'public',
				fileLine: _interface.meta.line,
				fileUrlPath: `${_interface.meta.path.slice(`packages/${_package}/`.length)}/${_interface.meta.file}`,
			})),
		];

		const reworkedJson: IApiDocumentedItemJson &
			IApiItemContainerJson &
			IApiNameMixinJson &
			IApiPackageJson & { members: (IApiItemContainerJson & IApiNameMixinJson)[] } = {
			projectFolderUrl: `https://github.com/discordjs/discord.js/tree/main/packages/${_package}`,
			metadata: { ...context, tsdocConfig: context.tsdocConfiguration, schemaVersion: context.versionToDeserialize },
			canonicalReference: `!${_package}`,
			kind: ApiItemKind.Package,
			name: _package,
			members: [
				{
					members,
					name: _package,
					kind: ApiItemKind.EntryPoint,
					canonicalReference: `${_package}!`,
				},
			],
			docComment: '',
		};

		return Deserializer.deserialize(context, reworkedJson);
	}
}
