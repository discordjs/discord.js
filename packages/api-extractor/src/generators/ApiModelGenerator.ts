// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { existsSync } from 'node:fs';
import * as path from 'node:path';
import type {
	IApiMethodOptions,
	ApiItemContainerMixin,
	IApiParameterOptions,
	IExcerptTokenRange,
	IExcerptTokenRangeWithTypeParameters,
	IExcerptToken,
	IApiTypeParameterOptions,
	IApiPropertyOptions,
} from '@discordjs/api-extractor-model';
import {
	ApiItemKind,
	ApiModel,
	ApiClass,
	ApiPackage,
	ApiEntryPoint,
	ApiEvent,
	ApiMethod,
	ApiNamespace,
	ApiInterface,
	ApiPropertySignature,
	ReleaseTag,
	ApiProperty,
	ApiMethodSignature,
	ApiEnum,
	ApiEnumMember,
	ApiConstructor,
	ApiConstructSignature,
	ApiFunction,
	ApiIndexSignature,
	ApiVariable,
	ApiTypeAlias,
	ApiCallSignature,
	EnumMemberOrder,
	ExcerptTokenKind,
	Navigation,
} from '@discordjs/api-extractor-model';
import type * as tsdoc from '@microsoft/tsdoc';
import { DeclarationReference, type Meaning } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import { JsonFile, Path } from '@rushstack/node-core-library';
import * as ts from 'typescript';
import type { AstDeclaration } from '../analyzer/AstDeclaration.js';
import type { AstEntity } from '../analyzer/AstEntity.js';
import { AstImport } from '../analyzer/AstImport.js';
import type { AstModule } from '../analyzer/AstModule.js';
import { AstNamespaceImport } from '../analyzer/AstNamespaceImport.js';
import { AstSymbol } from '../analyzer/AstSymbol.js';
import { TypeScriptInternals } from '../analyzer/TypeScriptInternals.js';
import type { ApiItemMetadata } from '../collector/ApiItemMetadata.js';
import type { Collector } from '../collector/Collector.js';
import type { DeclarationMetadata } from '../collector/DeclarationMetadata.js';
import type { ISourceLocation } from '../collector/SourceMapper.js';
import { DeclarationReferenceGenerator } from './DeclarationReferenceGenerator.js';
import { ExcerptBuilder, type IExcerptBuilderNodeToCapture } from './ExcerptBuilder.js';

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
type DocgenContainerJson =
	| DocgenClassJson
	| DocgenConstructorJson
	| DocgenInterfaceJson
	| DocgenJson
	| DocgenMethodJson
	| DocgenTypedefJson;

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
interface IProcessAstEntityContext {
	isExported: boolean;
	name: string;
	parentApiItem: ApiItemContainerMixin;
	parentDocgenJson?: DocgenContainerJson | undefined;
}

const linkRegEx =
	/{@link\s(?:(?<class>\w+)(?:[#.](?<event>event:)?(?<prop>[\w()]+))?|(?<url>https?:\/\/[^\s}]*))(?<name>\s[^}]*)?}/g;

const moduleNameRegEx = /^(?<package>(?:@[\w.-]+\/)?[\w.-]+)(?<path>(?:\/[\w.-]+)+)?$/i;

function filePathFromJson(meta: DocgenMetaJson): string {
	return `${meta.path.slice('packages/discord.js/'.length)}/${meta.file}`;
}

function fixPrimitiveTypes(type: string, symbol: string | undefined) {
	switch (type) {
		case '*':
			return 'any';
		case 'Object':
			return symbol === '<' ? 'Record' : 'object';
		default:
			return type;
	}
}

export class ApiModelGenerator {
	private readonly _collector: Collector;

	private readonly _apiModel: ApiModel;

	private readonly _tsDocParser: tsdoc.TSDocParser;

	private readonly _referenceGenerator: DeclarationReferenceGenerator;

	private readonly _jsDocJson: DocgenJson | undefined;

	public constructor(collector: Collector) {
		this._collector = collector;
		this._apiModel = new ApiModel();
		this._referenceGenerator = new DeclarationReferenceGenerator(collector);
		// @ts-expect-error we reuse the private tsdocParser from collector here
		this._tsDocParser = collector._tsdocParser;
	}

	public get apiModel(): ApiModel {
		return this._apiModel;
	}

	public buildApiPackage(): ApiPackage {
		const packageDocComment: tsdoc.DocComment | undefined = this._collector.workingPackage.tsdocComment;

		const jsDocFilepath = `${this._collector.extractorConfig.apiJsonFilePath.slice(0, -8)}json`;
		if (existsSync(jsDocFilepath)) {
			// @ts-expect-error assign value only when starting to build a new ApiPackage
			this._jsDocJson = JsonFile.load(jsDocFilepath);
		}

		const apiPackage: ApiPackage = new ApiPackage({
			name: this._collector.workingPackage.name,
			docComment: packageDocComment,
			tsdocConfiguration: this._collector.extractorConfig.tsdocConfiguration,
			projectFolderUrl: this._collector.extractorConfig.projectFolderUrl,
		});
		this._apiModel.addMember(apiPackage);

		const apiEntryPoint: ApiEntryPoint = new ApiEntryPoint({ name: '' });
		apiPackage.addMember(apiEntryPoint);

		for (const entity of this._collector.entities) {
			// Only process entities that are exported from the entry point. Entities that are exported from
			// `AstNamespaceImport` entities will be processed by `_processAstNamespaceImport`. However, if
			// we are including forgotten exports, then process everything.
			if (entity.exportedFromEntryPoint || this._collector.extractorConfig.docModelIncludeForgottenExports) {
				this._processAstEntity(entity.astEntity, {
					name: entity.nameForEmit!,
					isExported: entity.exportedFromEntryPoint,
					parentApiItem: apiEntryPoint,
					parentDocgenJson: this._jsDocJson,
				});
			}
		}

		return apiPackage;
	}

	private _processAstEntity(astEntity: AstEntity, context: IProcessAstEntityContext): void {
		if (astEntity instanceof AstSymbol) {
			// Skip ancillary declarations; we will process them with the main declaration
			for (const astDeclaration of this._collector.getNonAncillaryDeclarations(astEntity)) {
				this._processDeclaration(astDeclaration, context);
			}

			return;
		}

		if (astEntity instanceof AstNamespaceImport) {
			// Note that a single API item can belong to two different AstNamespaceImport namespaces.  For example:
			//
			//   // file.ts defines "thing()"
			//   import * as example1 from "./file";
			//   import * as example2 from "./file";
			//
			//   // ...so here we end up with example1.thing() and example2.thing()
			//   export { example1, example2 }
			//
			// The current logic does not try to associate "thing()" with a specific parent.  Instead
			// the API documentation will show duplicated entries for example1.thing() and example2.thing().
			//
			// This could be improved in the future, but it requires a stable mechanism for choosing an associated parent.
			// For thoughts about this:  https://github.com/microsoft/rushstack/issues/1308
			this._processAstNamespaceImport(astEntity, context);
		}

		// TO DO: Figure out how to represent reexported AstImport objects.  Basically we need to introduce a new
		// ApiItem subclass for "export alias", similar to a type alias, but representing declarations of the
		// form "export { X } from 'external-package'".  We can also use this to solve GitHub issue #950.
	}

	private _processAstNamespaceImport(astNamespaceImport: AstNamespaceImport, context: IProcessAstEntityContext): void {
		const astModule: AstModule = astNamespaceImport.astModule;
		const { name, isExported, parentApiItem } = context;
		const containerKey: string = ApiNamespace.getContainerKey(name);
		const sourceLocation: ISourceLocation = this._getSourceLocation(astNamespaceImport.declaration);

		let apiNamespace: ApiNamespace | undefined = parentApiItem.tryGetMemberByKey(containerKey) as ApiNamespace;

		if (apiNamespace === undefined) {
			apiNamespace = new ApiNamespace({
				name,
				docComment: undefined,
				releaseTag: ReleaseTag.None,
				excerptTokens: [],
				isExported,
				fileUrlPath: sourceLocation.sourceFilePath,
				fileLine: sourceLocation.sourceFileLine,
				fileColumn: sourceLocation.sourceFileColumn,
			});
			parentApiItem.addMember(apiNamespace);
		}

		// eslint-disable-next-line unicorn/no-array-for-each
		astModule.astModuleExportInfo!.exportedLocalEntities.forEach((exportedEntity: AstEntity, exportedName: string) => {
			this._processAstEntity(exportedEntity, {
				name: exportedName,
				isExported: true,
				parentApiItem: apiNamespace!,
			});
		});
	}

	private _processDeclaration(astDeclaration: AstDeclaration, context: IProcessAstEntityContext): void {
		if ((astDeclaration.modifierFlags & ts.ModifierFlags.Private) !== 0) {
			return; // trim out private declarations
		}

		const apiItemMetadata: ApiItemMetadata = this._collector.fetchApiItemMetadata(astDeclaration);
		const releaseTag: ReleaseTag = apiItemMetadata.effectiveReleaseTag;
		if (releaseTag === ReleaseTag.Internal) {
			return; // trim out items marked as "@internal"
		}

		switch (astDeclaration.declaration.kind) {
			case ts.SyntaxKind.CallSignature:
				this._processApiCallSignature(astDeclaration, context);
				break;

			case ts.SyntaxKind.Constructor:
				this._processApiConstructor(astDeclaration, context);
				break;

			case ts.SyntaxKind.ConstructSignature:
				this._processApiConstructSignature(astDeclaration, context);
				break;

			case ts.SyntaxKind.ClassDeclaration:
				this._processApiClass(astDeclaration, context);
				break;

			case ts.SyntaxKind.EnumDeclaration:
				this._processApiEnum(astDeclaration, context);
				break;

			case ts.SyntaxKind.EnumMember:
				this._processApiEnumMember(astDeclaration, context);
				break;

			case ts.SyntaxKind.FunctionDeclaration:
				this._processApiFunction(astDeclaration, context);
				break;

			case ts.SyntaxKind.GetAccessor:
				this._processApiProperty(astDeclaration, context);
				break;

			case ts.SyntaxKind.SetAccessor:
				this._processApiProperty(astDeclaration, context);
				break;

			case ts.SyntaxKind.IndexSignature:
				this._processApiIndexSignature(astDeclaration, context);
				break;

			case ts.SyntaxKind.InterfaceDeclaration:
				this._processApiInterface(astDeclaration, context);
				break;

			case ts.SyntaxKind.MethodDeclaration:
				this._processApiMethod(astDeclaration, context);
				break;

			case ts.SyntaxKind.MethodSignature:
				this._processApiMethodSignature(astDeclaration, context);
				break;

			case ts.SyntaxKind.ModuleDeclaration:
				this._processApiNamespace(astDeclaration, context);
				break;

			case ts.SyntaxKind.PropertyDeclaration:
				this._processApiProperty(astDeclaration, context);
				break;

			case ts.SyntaxKind.PropertySignature:
				this._processApiPropertySignature(astDeclaration, context);
				break;

			case ts.SyntaxKind.TypeAliasDeclaration:
				this._processApiTypeAlias(astDeclaration, context);
				break;

			case ts.SyntaxKind.VariableDeclaration:
				this._processApiVariable(astDeclaration, context);
				break;

			default:
			// ignore unknown types
		}
	}

	private _processChildDeclarations(astDeclaration: AstDeclaration, context: IProcessAstEntityContext): void {
		for (const childDeclaration of astDeclaration.children) {
			this._processDeclaration(childDeclaration, {
				...context,
				name: childDeclaration.astSymbol.localName,
			});
		}

		for (const method of (context.parentDocgenJson as DocgenClassJson | DocgenInterfaceJson | undefined)?.methods ??
			[]) {
			switch (context.parentApiItem.kind) {
				case ApiItemKind.Class:
					this._processApiMethod(null, { ...context, name: method.name });
					break;

				case ApiItemKind.Interface:
					this._processApiMethodSignature(null, { ...context, name: method.name });
					break;

				default:
					console.log(
						`Found docgen method not in TS typings for ApiItem of kind ${ApiItemKind[context.parentApiItem.kind]}`,
					);
			}
		}

		for (const property of (context.parentDocgenJson as DocgenClassJson | DocgenInterfaceJson | undefined)?.props ??
			[]) {
			switch (context.parentApiItem.kind) {
				case ApiItemKind.Class:
					this._processApiProperty(null, { ...context, name: property.name });
					break;

				case ApiItemKind.Interface:
					this._processApiPropertySignature(null, { ...context, name: property.name });
					break;

				default:
					console.log(
						`Found docgen property not in TS typings for ApiItem of kind ${ApiItemKind[context.parentApiItem.kind]}`,
					);
			}
		}
	}

	private _processApiCallSignature(astDeclaration: AstDeclaration, context: IProcessAstEntityContext): void {
		const { parentApiItem } = context;
		const overloadIndex: number = this._collector.getOverloadIndex(astDeclaration);
		const containerKey: string = ApiCallSignature.getContainerKey(overloadIndex);

		let apiCallSignature: ApiCallSignature | undefined = parentApiItem.tryGetMemberByKey(
			containerKey,
		) as ApiCallSignature;

		if (apiCallSignature === undefined) {
			const callSignature: ts.CallSignatureDeclaration = astDeclaration.declaration as ts.CallSignatureDeclaration;

			const nodesToCapture: IExcerptBuilderNodeToCapture[] = [];

			const returnTypeTokenRange: IExcerptTokenRange = ExcerptBuilder.createEmptyTokenRange();
			nodesToCapture.push({ node: callSignature.type, tokenRange: returnTypeTokenRange });

			const typeParameters: IApiTypeParameterOptions[] = this._captureTypeParameters(
				nodesToCapture,
				callSignature.typeParameters,
			);

			const parameters: IApiParameterOptions[] = this._captureParameters(nodesToCapture, callSignature.parameters);

			const excerptTokens: IExcerptToken[] = this._buildExcerptTokens(astDeclaration, nodesToCapture);
			const apiItemMetadata: ApiItemMetadata = this._collector.fetchApiItemMetadata(astDeclaration);
			const docComment: tsdoc.DocComment | undefined = apiItemMetadata.tsdocComment;
			const releaseTag: ReleaseTag = apiItemMetadata.effectiveReleaseTag;
			const sourceLocation: ISourceLocation = this._getSourceLocation(callSignature);

			apiCallSignature = new ApiCallSignature({
				docComment,
				releaseTag,
				typeParameters,
				parameters,
				overloadIndex,
				excerptTokens,
				returnTypeTokenRange,
				fileUrlPath: sourceLocation.sourceFilePath,
				fileLine: sourceLocation.sourceFileLine,
				fileColumn: sourceLocation.sourceFileColumn,
			});

			parentApiItem.addMember(apiCallSignature);
		}
	}

	private _processApiConstructor(astDeclaration: AstDeclaration, context: IProcessAstEntityContext): void {
		const { parentApiItem } = context;
		const overloadIndex: number = this._collector.getOverloadIndex(astDeclaration);
		const containerKey: string = ApiConstructor.getContainerKey(overloadIndex);

		let apiConstructor: ApiConstructor | undefined = parentApiItem.tryGetMemberByKey(containerKey) as ApiConstructor;

		if (apiConstructor === undefined) {
			const constructorDeclaration: ts.ConstructorDeclaration = astDeclaration.declaration as ts.ConstructorDeclaration;

			const nodesToCapture: IExcerptBuilderNodeToCapture[] = [];
			const parent = context.parentDocgenJson as DocgenClassJson | DocgenInterfaceJson | undefined;

			const parameters: IApiParameterOptions[] = this._captureParameters(
				nodesToCapture,
				constructorDeclaration.parameters,
			);

			const excerptTokens: IExcerptToken[] = this._buildExcerptTokens(astDeclaration, nodesToCapture);
			const apiItemMetadata: ApiItemMetadata = this._collector.fetchApiItemMetadata(astDeclaration);
			const docComment: tsdoc.DocComment | undefined = parent?.construct
				? this._tsDocParser.parseString(
						`/*+\n * ${this._fixLinkTags(parent.construct.description) ?? ''}\n${
							parent.construct.params
								?.map((param) => ` * @param ${param.name} - ${this._fixLinkTags(param.description) ?? ''}\n`)
								.join('') ?? ''
						} */`,
					).docComment
				: apiItemMetadata.tsdocComment;
			const releaseTag: ReleaseTag = apiItemMetadata.effectiveReleaseTag;
			const isProtected: boolean = (astDeclaration.modifierFlags & ts.ModifierFlags.Protected) !== 0;
			const sourceLocation: ISourceLocation = this._getSourceLocation(constructorDeclaration);

			apiConstructor = new ApiConstructor({
				docComment,
				releaseTag,
				isProtected,
				parameters,
				overloadIndex,
				excerptTokens,
				fileUrlPath: parent ? filePathFromJson(parent.meta) : sourceLocation.sourceFilePath,
				fileLine: parent?.meta.line ?? sourceLocation.sourceFileLine,
				fileColumn: sourceLocation.sourceFileColumn,
			});

			parentApiItem.addMember(apiConstructor);
		}
	}

	private _processApiClass(astDeclaration: AstDeclaration, context: IProcessAstEntityContext): void {
		const { name, isExported, parentApiItem } = context;
		const containerKey: string = ApiClass.getContainerKey(name);

		let apiClass: ApiClass | undefined = parentApiItem.tryGetMemberByKey(containerKey) as ApiClass;
		const parent = context.parentDocgenJson as DocgenJson | undefined;
		const jsDoc = parent?.classes.find((_class) => _class.name === name);

		if (apiClass === undefined) {
			const classDeclaration: ts.ClassDeclaration = astDeclaration.declaration as ts.ClassDeclaration;

			const nodesToCapture: IExcerptBuilderNodeToCapture[] = [];

			const typeParameters: IApiTypeParameterOptions[] = this._captureTypeParameters(
				nodesToCapture,
				classDeclaration.typeParameters,
			);

			let extendsTokenRange: IExcerptTokenRangeWithTypeParameters | undefined;
			const implementsTokenRanges: IExcerptTokenRangeWithTypeParameters[] = [];

			for (const heritageClause of classDeclaration.heritageClauses ?? []) {
				if (heritageClause.token === ts.SyntaxKind.ExtendsKeyword) {
					extendsTokenRange = ExcerptBuilder.createEmptyTokenRangeWithTypeParameters();
					if (heritageClause.types.length > 0) {
						extendsTokenRange.typeParameters.push(
							...(heritageClause.types[0]?.typeArguments?.map((typeArgument) => {
								const typeArgumentTokenRange = ExcerptBuilder.createEmptyTokenRange();
								nodesToCapture.push({ node: typeArgument, tokenRange: typeArgumentTokenRange });

								return typeArgumentTokenRange;
							}) ?? []),
						);
						nodesToCapture.push({ node: heritageClause.types[0], tokenRange: extendsTokenRange });
					}
				} else if (heritageClause.token === ts.SyntaxKind.ImplementsKeyword) {
					for (const heritageType of heritageClause.types) {
						const implementsTokenRange: IExcerptTokenRangeWithTypeParameters =
							ExcerptBuilder.createEmptyTokenRangeWithTypeParameters();
						implementsTokenRange.typeParameters.push(
							...(heritageType.typeArguments?.map((typeArgument) => {
								const typeArgumentTokenRange = ExcerptBuilder.createEmptyTokenRange();
								if (ts.isTypeReferenceNode(typeArgument)) {
									nodesToCapture.push({ node: typeArgument, tokenRange: typeArgumentTokenRange });
								}

								return typeArgumentTokenRange;
							}) ?? []),
						);
						implementsTokenRanges.push(implementsTokenRange);
						nodesToCapture.push({ node: heritageType, tokenRange: implementsTokenRange });
					}
				}
			}

			const excerptTokens: IExcerptToken[] = this._buildExcerptTokens(astDeclaration, nodesToCapture);
			const apiItemMetadata: ApiItemMetadata = this._collector.fetchApiItemMetadata(astDeclaration);
			const docComment: tsdoc.DocComment | undefined = jsDoc
				? this._tsDocParser.parseString(
						`/**\n * ${this._fixLinkTags(jsDoc.description) ?? ''}\n${
							jsDoc.see?.map((see) => ` * @see ${see}\n`).join('') ?? ''
						}${
							jsDoc.deprecated
								? ` * @deprecated ${
										typeof jsDoc.deprecated === 'string' ? this._fixLinkTags(jsDoc.deprecated) : jsDoc.deprecated
									}\n`
								: ''
						} */`,
					).docComment
				: apiItemMetadata.tsdocComment;
			const releaseTag: ReleaseTag = apiItemMetadata.effectiveReleaseTag;
			const isAbstract: boolean = (ts.getCombinedModifierFlags(classDeclaration) & ts.ModifierFlags.Abstract) !== 0;
			const sourceLocation: ISourceLocation = this._getSourceLocation(classDeclaration);

			apiClass = new ApiClass({
				name,
				isAbstract,
				docComment,
				releaseTag,
				excerptTokens,
				typeParameters,
				extendsTokenRange,
				implementsTokenRanges,
				isExported,
				fileUrlPath: jsDoc ? filePathFromJson(jsDoc.meta) : sourceLocation.sourceFilePath,
				fileLine: jsDoc?.meta.line ?? sourceLocation.sourceFileLine,
				fileColumn: sourceLocation.sourceFileColumn,
			});

			parentApiItem.addMember(apiClass);
		}

		this._processChildDeclarations(astDeclaration, {
			...context,
			parentApiItem: apiClass,
			parentDocgenJson: jsDoc,
		});

		for (const event of jsDoc?.events ?? []) {
			this._processApiEvent({ ...context, name: event.name, parentApiItem: apiClass, parentDocgenJson: jsDoc });
		}
	}

	private _processApiConstructSignature(astDeclaration: AstDeclaration, context: IProcessAstEntityContext): void {
		const { parentApiItem } = context;
		const overloadIndex: number = this._collector.getOverloadIndex(astDeclaration);
		const containerKey: string = ApiConstructSignature.getContainerKey(overloadIndex);

		let apiConstructSignature: ApiConstructSignature | undefined = parentApiItem.tryGetMemberByKey(
			containerKey,
		) as ApiConstructSignature;

		if (apiConstructSignature === undefined) {
			const constructSignature: ts.ConstructSignatureDeclaration =
				astDeclaration.declaration as ts.ConstructSignatureDeclaration;

			const nodesToCapture: IExcerptBuilderNodeToCapture[] = [];
			const parent = context.parentDocgenJson as DocgenClassJson | DocgenInterfaceJson | undefined;

			const returnTypeTokenRange: IExcerptTokenRange = ExcerptBuilder.createEmptyTokenRange();
			nodesToCapture.push({ node: constructSignature.type, tokenRange: returnTypeTokenRange });

			const typeParameters: IApiTypeParameterOptions[] = this._captureTypeParameters(
				nodesToCapture,
				constructSignature.typeParameters,
			);

			const parameters: IApiParameterOptions[] = this._captureParameters(nodesToCapture, constructSignature.parameters);

			const excerptTokens: IExcerptToken[] = this._buildExcerptTokens(astDeclaration, nodesToCapture);
			const apiItemMetadata: ApiItemMetadata = this._collector.fetchApiItemMetadata(astDeclaration);
			const docComment: tsdoc.DocComment | undefined = parent?.construct
				? this._tsDocParser.parseString(
						`/*+\n * ${this._fixLinkTags(parent.construct.description) ?? ''}\n${
							parent.construct.params
								?.map((param) => ` * @param ${param.name} - ${this._fixLinkTags(param.description) ?? ''}\n`)
								.join('') ?? ''
						} */`,
					).docComment
				: apiItemMetadata.tsdocComment;
			const releaseTag: ReleaseTag = apiItemMetadata.effectiveReleaseTag;
			const sourceLocation: ISourceLocation = this._getSourceLocation(constructSignature);

			apiConstructSignature = new ApiConstructSignature({
				docComment,
				releaseTag,
				typeParameters,
				parameters,
				overloadIndex,
				excerptTokens,
				returnTypeTokenRange,
				fileUrlPath: parent ? filePathFromJson(parent.meta) : sourceLocation.sourceFilePath,
				fileLine: parent?.meta.line ?? sourceLocation.sourceFileLine,
				fileColumn: sourceLocation.sourceFileColumn,
			});

			parentApiItem.addMember(apiConstructSignature);
		}
	}

	private _processApiEnum(astDeclaration: AstDeclaration, context: IProcessAstEntityContext): void {
		const { name, isExported, parentApiItem } = context;
		const containerKey: string = ApiEnum.getContainerKey(name);

		let apiEnum: ApiEnum | undefined = parentApiItem.tryGetMemberByKey(containerKey) as ApiEnum;

		if (apiEnum === undefined) {
			const excerptTokens: IExcerptToken[] = this._buildExcerptTokens(astDeclaration, []);
			const apiItemMetadata: ApiItemMetadata = this._collector.fetchApiItemMetadata(astDeclaration);
			const docComment: tsdoc.DocComment | undefined = apiItemMetadata.tsdocComment;
			const releaseTag: ReleaseTag = apiItemMetadata.effectiveReleaseTag;
			const preserveMemberOrder: boolean = this._collector.extractorConfig.enumMemberOrder === EnumMemberOrder.Preserve;
			const sourceLocation: ISourceLocation = this._getSourceLocation(astDeclaration.declaration);

			apiEnum = new ApiEnum({
				name,
				docComment,
				releaseTag,
				excerptTokens,
				preserveMemberOrder,
				isExported,
				fileUrlPath: sourceLocation.sourceFilePath,
				fileLine: sourceLocation.sourceFileLine,
				fileColumn: sourceLocation.sourceFileColumn,
			});
			parentApiItem.addMember(apiEnum);
		}

		this._processChildDeclarations(astDeclaration, {
			...context,
			parentApiItem: apiEnum,
		});
	}

	private _processApiEnumMember(astDeclaration: AstDeclaration, context: IProcessAstEntityContext): void {
		const { name, parentApiItem } = context;
		const containerKey: string = ApiEnumMember.getContainerKey(name);

		let apiEnumMember: ApiEnumMember | undefined = parentApiItem.tryGetMemberByKey(containerKey) as ApiEnumMember;

		if (apiEnumMember === undefined) {
			const enumMember: ts.EnumMember = astDeclaration.declaration as ts.EnumMember;

			const nodesToCapture: IExcerptBuilderNodeToCapture[] = [];

			let initializerTokenRange: IExcerptTokenRange | undefined;
			if (enumMember.initializer) {
				initializerTokenRange = ExcerptBuilder.createEmptyTokenRange();
				nodesToCapture.push({ node: enumMember.initializer, tokenRange: initializerTokenRange });
			}

			const excerptTokens: IExcerptToken[] = this._buildExcerptTokens(astDeclaration, nodesToCapture);
			const apiItemMetadata: ApiItemMetadata = this._collector.fetchApiItemMetadata(astDeclaration);
			const docComment: tsdoc.DocComment | undefined = apiItemMetadata.tsdocComment;
			const releaseTag: ReleaseTag = apiItemMetadata.effectiveReleaseTag;
			const sourceLocation: ISourceLocation = this._getSourceLocation(enumMember);

			apiEnumMember = new ApiEnumMember({
				name,
				docComment,
				releaseTag,
				excerptTokens,
				initializerTokenRange,
				fileUrlPath: sourceLocation.sourceFilePath,
				fileLine: sourceLocation.sourceFileLine,
				fileColumn: sourceLocation.sourceFileColumn,
			});

			parentApiItem.addMember(apiEnumMember);
		}
	}

	private _processApiFunction(astDeclaration: AstDeclaration, context: IProcessAstEntityContext): void {
		const { name, isExported, parentApiItem } = context;

		const overloadIndex: number = this._collector.getOverloadIndex(astDeclaration);
		const containerKey: string = ApiFunction.getContainerKey(name, overloadIndex);

		let apiFunction: ApiFunction | undefined = parentApiItem.tryGetMemberByKey(containerKey) as ApiFunction;
		const parent = context.parentDocgenJson as DocgenJson | undefined;
		const jsDoc = parent?.functions.find((fun) => fun.name === name);

		if (apiFunction === undefined) {
			const functionDeclaration: ts.FunctionDeclaration = astDeclaration.declaration as ts.FunctionDeclaration;

			const nodesToCapture: IExcerptBuilderNodeToCapture[] = [];

			const returnTypeTokenRange: IExcerptTokenRange = ExcerptBuilder.createEmptyTokenRange();
			nodesToCapture.push({ node: functionDeclaration.type, tokenRange: returnTypeTokenRange });

			const typeParameters: IApiTypeParameterOptions[] = this._captureTypeParameters(
				nodesToCapture,
				functionDeclaration.typeParameters,
			);

			const parameters: IApiParameterOptions[] = this._captureParameters(
				nodesToCapture,
				functionDeclaration.parameters,
			);

			const excerptTokens: IExcerptToken[] = this._buildExcerptTokens(astDeclaration, nodesToCapture);
			const apiItemMetadata: ApiItemMetadata = this._collector.fetchApiItemMetadata(astDeclaration);
			const docComment: tsdoc.DocComment | undefined = jsDoc
				? this._tsDocParser.parseString(
						`/**\n * ${this._fixLinkTags(jsDoc.description) ?? ''}\n${
							jsDoc.params
								?.map((param) => ` * @param ${param.name} - ${this._fixLinkTags(param.description) ?? ''}\n`)
								.join('') ?? ''
						}${
							jsDoc.returns?.length && !Array.isArray(jsDoc.returns[0])
								? ` * @returns ${this._fixLinkTags(jsDoc.returns[0]!.description) ?? ''}`
								: ''
						}${
							jsDoc.deprecated
								? ` * @deprecated ${
										typeof jsDoc.deprecated === 'string' ? this._fixLinkTags(jsDoc.deprecated) : jsDoc.deprecated
									}\n`
								: ''
						} */`,
					).docComment
				: apiItemMetadata.tsdocComment;
			const releaseTag: ReleaseTag = apiItemMetadata.effectiveReleaseTag;
			const sourceLocation: ISourceLocation = this._getSourceLocation(functionDeclaration);

			apiFunction = new ApiFunction({
				name,
				docComment,
				releaseTag,
				typeParameters,
				parameters,
				overloadIndex,
				excerptTokens,
				returnTypeTokenRange,
				isExported,
				fileUrlPath: jsDoc ? filePathFromJson(jsDoc.meta) : sourceLocation.sourceFilePath,
				fileLine: jsDoc?.meta.line ?? sourceLocation.sourceFileLine,
				fileColumn: sourceLocation.sourceFileColumn,
			});

			parentApiItem.addMember(apiFunction);
		}
	}

	private _processApiIndexSignature(astDeclaration: AstDeclaration, context: IProcessAstEntityContext): void {
		const { parentApiItem } = context;
		const overloadIndex: number = this._collector.getOverloadIndex(astDeclaration);
		const containerKey: string = ApiIndexSignature.getContainerKey(overloadIndex);

		let apiIndexSignature: ApiIndexSignature | undefined = parentApiItem.tryGetMemberByKey(
			containerKey,
		) as ApiIndexSignature;

		if (apiIndexSignature === undefined) {
			const indexSignature: ts.IndexSignatureDeclaration = astDeclaration.declaration as ts.IndexSignatureDeclaration;

			const nodesToCapture: IExcerptBuilderNodeToCapture[] = [];

			const returnTypeTokenRange: IExcerptTokenRange = ExcerptBuilder.createEmptyTokenRange();
			nodesToCapture.push({ node: indexSignature.type, tokenRange: returnTypeTokenRange });

			const parameters: IApiParameterOptions[] = this._captureParameters(nodesToCapture, indexSignature.parameters);

			const excerptTokens: IExcerptToken[] = this._buildExcerptTokens(astDeclaration, nodesToCapture);
			const apiItemMetadata: ApiItemMetadata = this._collector.fetchApiItemMetadata(astDeclaration);
			const docComment: tsdoc.DocComment | undefined = apiItemMetadata.tsdocComment;
			const releaseTag: ReleaseTag = apiItemMetadata.effectiveReleaseTag;
			const isReadonly: boolean = this._isReadonly(astDeclaration);
			const sourceLocation: ISourceLocation = this._getSourceLocation(indexSignature);

			apiIndexSignature = new ApiIndexSignature({
				docComment,
				releaseTag,
				parameters,
				overloadIndex,
				excerptTokens,
				returnTypeTokenRange,
				isReadonly,
				fileUrlPath: sourceLocation.sourceFilePath,
				fileLine: sourceLocation.sourceFileLine,
				fileColumn: sourceLocation.sourceFileColumn,
			});

			parentApiItem.addMember(apiIndexSignature);
		}
	}

	private _processApiInterface(astDeclaration: AstDeclaration, context: IProcessAstEntityContext): void {
		const { name, isExported, parentApiItem } = context;
		const containerKey: string = ApiInterface.getContainerKey(name);

		let apiInterface: ApiInterface | undefined = parentApiItem.tryGetMemberByKey(containerKey) as ApiInterface;
		const parent = context.parentDocgenJson as DocgenJson | undefined;
		const jsDoc =
			parent?.interfaces.find((int) => int.name === name) ?? parent?.typedefs.find((int) => int.name === name);

		if (apiInterface === undefined) {
			const interfaceDeclaration: ts.InterfaceDeclaration = astDeclaration.declaration as ts.InterfaceDeclaration;

			const nodesToCapture: IExcerptBuilderNodeToCapture[] = [];

			const typeParameters: IApiTypeParameterOptions[] = this._captureTypeParameters(
				nodesToCapture,
				interfaceDeclaration.typeParameters,
			);

			const extendsTokenRanges: IExcerptTokenRangeWithTypeParameters[] = [];

			for (const heritageClause of interfaceDeclaration.heritageClauses ?? []) {
				if (heritageClause.token === ts.SyntaxKind.ExtendsKeyword) {
					for (const heritageType of heritageClause.types) {
						const extendsTokenRange: IExcerptTokenRangeWithTypeParameters =
							ExcerptBuilder.createEmptyTokenRangeWithTypeParameters();
						extendsTokenRange.typeParameters.push(
							...(heritageType.typeArguments?.map((typeArgument) => {
								const typeArgumentTokenRange = ExcerptBuilder.createEmptyTokenRange();
								if (ts.isTypeReferenceNode(typeArgument)) {
									nodesToCapture.push({ node: typeArgument, tokenRange: typeArgumentTokenRange });
								}

								return typeArgumentTokenRange;
							}) ?? []),
						);
						extendsTokenRanges.push(extendsTokenRange);
						nodesToCapture.push({ node: heritageType, tokenRange: extendsTokenRange });
					}
				}
			}

			const excerptTokens: IExcerptToken[] = this._buildExcerptTokens(astDeclaration, nodesToCapture);
			const apiItemMetadata: ApiItemMetadata = this._collector.fetchApiItemMetadata(astDeclaration);
			const docComment: tsdoc.DocComment | undefined = jsDoc
				? this._tsDocParser.parseString(
						`/**\n * ${this._fixLinkTags(jsDoc.description) ?? ''}\n${
							jsDoc.see?.map((see) => ` * @see ${see}\n`).join('') ?? ''
						}${
							jsDoc.deprecated
								? ` * @deprecated ${
										typeof jsDoc.deprecated === 'string' ? this._fixLinkTags(jsDoc.deprecated) : jsDoc.deprecated
									}\n`
								: ''
						} */`,
					).docComment
				: apiItemMetadata.tsdocComment;
			const releaseTag: ReleaseTag = apiItemMetadata.effectiveReleaseTag;
			const sourceLocation: ISourceLocation = this._getSourceLocation(interfaceDeclaration);

			apiInterface = new ApiInterface({
				name,
				docComment,
				releaseTag,
				excerptTokens,
				typeParameters,
				extendsTokenRanges,
				isExported,
				fileUrlPath: jsDoc ? filePathFromJson(jsDoc.meta) : sourceLocation.sourceFilePath,
				fileLine: jsDoc?.meta.line ?? sourceLocation.sourceFileLine,
				fileColumn: sourceLocation.sourceFileColumn,
			});

			parentApiItem.addMember(apiInterface);
		}

		this._processChildDeclarations(astDeclaration, {
			...context,
			parentApiItem: apiInterface,
			parentDocgenJson: jsDoc,
		});
	}

	private _processApiMethod(astDeclaration: AstDeclaration | null, context: IProcessAstEntityContext): void {
		const { name, parentApiItem } = context;
		const parent = context.parentDocgenJson as DocgenClassJson | DocgenInterfaceJson | undefined;
		const jsDoc = parent?.methods?.find((method) => method.name === name);
		const isStatic: boolean = astDeclaration
			? (astDeclaration.modifierFlags & ts.ModifierFlags.Static) !== 0
			: jsDoc?.scope === 'static';
		const overloadIndex: number = astDeclaration ? this._collector.getOverloadIndex(astDeclaration) : 1;
		const containerKey: string = ApiMethod.getContainerKey(name, isStatic, overloadIndex);

		let apiMethod: ApiMethod | undefined = parentApiItem.tryGetMemberByKey(containerKey) as ApiMethod;

		if (apiMethod === undefined) {
			if (astDeclaration) {
				const methodDeclaration: ts.MethodDeclaration = astDeclaration.declaration as ts.MethodDeclaration;

				const nodesToCapture: IExcerptBuilderNodeToCapture[] = [];

				const returnTypeTokenRange: IExcerptTokenRange = ExcerptBuilder.createEmptyTokenRange();
				nodesToCapture.push({ node: methodDeclaration.type, tokenRange: returnTypeTokenRange });

				const typeParameters: IApiTypeParameterOptions[] = this._captureTypeParameters(
					nodesToCapture,
					methodDeclaration.typeParameters,
				);

				const parameters: IApiParameterOptions[] = this._captureParameters(
					nodesToCapture,
					methodDeclaration.parameters,
				);

				const excerptTokens: IExcerptToken[] = this._buildExcerptTokens(astDeclaration, nodesToCapture);
				const apiItemMetadata: ApiItemMetadata = this._collector.fetchApiItemMetadata(astDeclaration);
				const docComment: tsdoc.DocComment | undefined = jsDoc
					? this._tsDocParser.parseString(
							`/**\n * ${this._fixLinkTags(jsDoc.description) ?? ''}\n${
								jsDoc.params
									?.map((param) => ` * @param ${param.name} - ${this._fixLinkTags(param.description) ?? ''}\n`)
									.join('') ?? ''
							}${
								jsDoc.returns?.length && !Array.isArray(jsDoc.returns[0])
									? ` * @returns ${this._fixLinkTags(jsDoc.returns[0]!.description) ?? ''}\n`
									: ''
							}${
								jsDoc.examples?.map((example) => ` * @example\n * \`\`\`js\n * ${example}\n * \`\`\`\n`).join('') ?? ''
							}${
								jsDoc.deprecated
									? ` * @deprecated ${
											typeof jsDoc.deprecated === 'string' ? this._fixLinkTags(jsDoc.deprecated) : jsDoc.deprecated
										}\n`
									: ''
							} */`,
						).docComment
					: apiItemMetadata.tsdocComment;
				const releaseTag: ReleaseTag = apiItemMetadata.effectiveReleaseTag;
				if (releaseTag === ReleaseTag.Internal || releaseTag === ReleaseTag.Alpha) {
					return; // trim out items marked as "@internal" or "@alpha"
				}

				const isOptional: boolean = (astDeclaration.astSymbol.followedSymbol.flags & ts.SymbolFlags.Optional) !== 0;
				const isProtected: boolean = (astDeclaration.modifierFlags & ts.ModifierFlags.Protected) !== 0;
				const isAbstract: boolean = (astDeclaration.modifierFlags & ts.ModifierFlags.Abstract) !== 0;
				const sourceLocation: ISourceLocation = this._getSourceLocation(methodDeclaration);

				apiMethod = new ApiMethod({
					name,
					isAbstract,
					docComment,
					releaseTag,
					isProtected,
					isStatic,
					isOptional,
					typeParameters,
					parameters,
					overloadIndex,
					excerptTokens,
					returnTypeTokenRange,
					fileUrlPath: jsDoc ? filePathFromJson(jsDoc.meta) : sourceLocation.sourceFilePath,
					fileLine: jsDoc?.meta.line ?? sourceLocation.sourceFileLine,
					fileColumn: sourceLocation.sourceFileColumn,
				});
			} else if (jsDoc) {
				if (jsDoc.inherited) {
					return;
				}

				const methodOptions = this._mapMethod(jsDoc, parentApiItem.getAssociatedPackage()!.name);
				if (methodOptions.releaseTag === ReleaseTag.Internal || methodOptions.releaseTag === ReleaseTag.Alpha) {
					return; // trim out items marked as "@internal" or "@alpha"
				}

				apiMethod = new ApiMethod(methodOptions);
			}

			parentApiItem.addMember(apiMethod);
		}
	}

	private _processApiMethodSignature(astDeclaration: AstDeclaration | null, context: IProcessAstEntityContext): void {
		const { name, parentApiItem } = context;
		const overloadIndex: number = astDeclaration ? this._collector.getOverloadIndex(astDeclaration) : 1;
		const containerKey: string = ApiMethodSignature.getContainerKey(name, overloadIndex);

		let apiMethodSignature: ApiMethodSignature | undefined = parentApiItem.tryGetMemberByKey(
			containerKey,
		) as ApiMethodSignature;
		const parent = context.parentDocgenJson as DocgenClassJson | DocgenInterfaceJson | undefined;
		const jsDoc = parent?.methods?.find((method) => method.name === name);

		if (apiMethodSignature === undefined) {
			if (astDeclaration) {
				const methodSignature: ts.MethodSignature = astDeclaration.declaration as ts.MethodSignature;

				const nodesToCapture: IExcerptBuilderNodeToCapture[] = [];

				const returnTypeTokenRange: IExcerptTokenRange = ExcerptBuilder.createEmptyTokenRange();
				nodesToCapture.push({ node: methodSignature.type, tokenRange: returnTypeTokenRange });

				const typeParameters: IApiTypeParameterOptions[] = this._captureTypeParameters(
					nodesToCapture,
					methodSignature.typeParameters,
				);

				const parameters: IApiParameterOptions[] = this._captureParameters(nodesToCapture, methodSignature.parameters);

				const excerptTokens: IExcerptToken[] = this._buildExcerptTokens(astDeclaration, nodesToCapture);
				const apiItemMetadata: ApiItemMetadata = this._collector.fetchApiItemMetadata(astDeclaration);
				const docComment: tsdoc.DocComment | undefined = jsDoc
					? this._tsDocParser.parseString(
							`/**\n * ${this._fixLinkTags(jsDoc.description) ?? ''}\n${
								jsDoc.params
									?.map((param) => ` * @param ${param.name} - ${this._fixLinkTags(param.description) ?? ''}\n`)
									.join('') ?? ''
							}${
								jsDoc.returns?.length && !Array.isArray(jsDoc.returns[0])
									? ` * @returns ${this._fixLinkTags(jsDoc.returns[0]!.description) ?? ''}\n`
									: ''
							}${
								jsDoc.deprecated
									? ` * @deprecated ${
											typeof jsDoc.deprecated === 'string' ? this._fixLinkTags(jsDoc.deprecated) : jsDoc.deprecated
										}\n`
									: ''
							} */`,
						).docComment
					: apiItemMetadata.tsdocComment;
				const releaseTag: ReleaseTag = apiItemMetadata.effectiveReleaseTag;
				const isOptional: boolean = (astDeclaration.astSymbol.followedSymbol.flags & ts.SymbolFlags.Optional) !== 0;
				const sourceLocation: ISourceLocation = this._getSourceLocation(methodSignature);

				apiMethodSignature = new ApiMethodSignature({
					name,
					docComment,
					releaseTag,
					isOptional,
					typeParameters,
					parameters,
					overloadIndex,
					excerptTokens,
					returnTypeTokenRange,
					fileUrlPath: jsDoc ? filePathFromJson(jsDoc.meta) : sourceLocation.sourceFilePath,
					fileLine: jsDoc?.meta.line ?? sourceLocation.sourceFileLine,
					fileColumn: sourceLocation.sourceFileColumn,
				});
			} else if (jsDoc) {
				apiMethodSignature = new ApiMethodSignature(this._mapMethod(jsDoc, parentApiItem.getAssociatedPackage()!.name));
			}

			parentApiItem.addMember(apiMethodSignature);
		}
	}

	private _processApiNamespace(astDeclaration: AstDeclaration, context: IProcessAstEntityContext): void {
		const { name, isExported, parentApiItem } = context;
		const containerKey: string = ApiNamespace.getContainerKey(name);

		let apiNamespace: ApiNamespace | undefined = parentApiItem.tryGetMemberByKey(containerKey) as ApiNamespace;

		if (apiNamespace === undefined) {
			const excerptTokens: IExcerptToken[] = this._buildExcerptTokens(astDeclaration, []);
			const apiItemMetadata: ApiItemMetadata = this._collector.fetchApiItemMetadata(astDeclaration);
			const docComment: tsdoc.DocComment | undefined = apiItemMetadata.tsdocComment;
			const releaseTag: ReleaseTag = apiItemMetadata.effectiveReleaseTag;
			const sourceLocation: ISourceLocation = this._getSourceLocation(astDeclaration.declaration);

			apiNamespace = new ApiNamespace({
				name,
				docComment,
				releaseTag,
				excerptTokens,
				isExported,
				fileUrlPath: sourceLocation.sourceFilePath,
				fileLine: sourceLocation.sourceFileLine,
				fileColumn: sourceLocation.sourceFileColumn,
			});
			parentApiItem.addMember(apiNamespace);
		}

		this._processChildDeclarations(astDeclaration, {
			...context,
			parentApiItem: apiNamespace,
		});
	}

	private _processApiProperty(astDeclaration: AstDeclaration | null, context: IProcessAstEntityContext): void {
		const { name, parentApiItem } = context;
		const parent = context.parentDocgenJson as DocgenClassJson | DocgenInterfaceJson | DocgenTypedefJson | undefined;
		const jsDoc = parent?.props?.find((prop) => prop.name === name);
		const isStatic: boolean = astDeclaration
			? (astDeclaration.modifierFlags & ts.ModifierFlags.Static) !== 0
			: parentApiItem.kind === ApiItemKind.Class || parentApiItem.kind === ApiItemKind.Interface
				? (jsDoc as DocgenPropertyJson).scope === 'static'
				: false;
		const containerKey: string = ApiProperty.getContainerKey(name, isStatic);

		let apiProperty: ApiProperty | undefined = parentApiItem.tryGetMemberByKey(containerKey) as ApiProperty;

		if (
			apiProperty === undefined &&
			(astDeclaration ||
				!this._isInherited(parent as DocgenClassJson | DocgenInterfaceJson, jsDoc!, parentApiItem.kind))
		) {
			if (astDeclaration) {
				const declaration: ts.Declaration = astDeclaration.declaration;
				const nodesToCapture: IExcerptBuilderNodeToCapture[] = [];

				const propertyTypeTokenRange: IExcerptTokenRange = ExcerptBuilder.createEmptyTokenRange();
				let propertyTypeNode: ts.TypeNode | undefined;

				if (ts.isPropertyDeclaration(declaration) || ts.isGetAccessorDeclaration(declaration)) {
					propertyTypeNode = declaration.type;
				}

				if (ts.isSetAccessorDeclaration(declaration)) {
					// Note that TypeScript always reports an error if a setter does not have exactly one parameter.
					propertyTypeNode = declaration.parameters[0]!.type;
				}

				nodesToCapture.push({ node: propertyTypeNode, tokenRange: propertyTypeTokenRange });

				let initializerTokenRange: IExcerptTokenRange | undefined;
				if (ts.isPropertyDeclaration(declaration) && declaration.initializer) {
					initializerTokenRange = ExcerptBuilder.createEmptyTokenRange();
					nodesToCapture.push({ node: declaration.initializer, tokenRange: initializerTokenRange });
				}

				const excerptTokens: IExcerptToken[] = this._buildExcerptTokens(astDeclaration, nodesToCapture);
				const apiItemMetadata: ApiItemMetadata = this._collector.fetchApiItemMetadata(astDeclaration);
				const docComment: tsdoc.DocComment | undefined = jsDoc
					? this._tsDocParser.parseString(
							`/**\n * ${this._fixLinkTags(jsDoc.description) ?? ''}\n${
								'see' in jsDoc ? jsDoc.see.map((see) => ` * @see ${see}\n`).join('') : ''
							}${'readonly' in jsDoc && jsDoc.readonly ? ' * @readonly\n' : ''}${
								'deprecated' in jsDoc && jsDoc.deprecated
									? ` * @deprecated ${
											typeof jsDoc.deprecated === 'string' ? this._fixLinkTags(jsDoc.deprecated) : jsDoc.deprecated
										}\n`
									: ''
							} */`,
						).docComment
					: apiItemMetadata.tsdocComment;
				const releaseTag: ReleaseTag = apiItemMetadata.effectiveReleaseTag;
				const isOptional: boolean = (astDeclaration.astSymbol.followedSymbol.flags & ts.SymbolFlags.Optional) !== 0;
				const isProtected: boolean = (astDeclaration.modifierFlags & ts.ModifierFlags.Protected) !== 0;
				const isAbstract: boolean = (astDeclaration.modifierFlags & ts.ModifierFlags.Abstract) !== 0;
				const isReadonly: boolean = this._isReadonly(astDeclaration);
				const sourceLocation: ISourceLocation = this._getSourceLocation(declaration);

				apiProperty = new ApiProperty({
					name,
					docComment,
					releaseTag,
					isAbstract,
					isProtected,
					isStatic,
					isOptional,
					isReadonly,
					excerptTokens,
					propertyTypeTokenRange,
					initializerTokenRange,
					fileUrlPath: jsDoc && 'meta' in jsDoc ? filePathFromJson(jsDoc.meta) : sourceLocation.sourceFilePath,
					fileLine: jsDoc && 'meta' in jsDoc ? jsDoc.meta.line : sourceLocation.sourceFileLine,
					fileColumn: sourceLocation.sourceFileColumn,
				});
			} else if (parentApiItem.kind === ApiItemKind.Class || parentApiItem.kind === ApiItemKind.Interface) {
				const propertyOptions = this._mapProp(jsDoc as DocgenPropertyJson, parentApiItem.getAssociatedPackage()!.name);
				if (propertyOptions.releaseTag === ReleaseTag.Internal || propertyOptions.releaseTag === ReleaseTag.Alpha) {
					return; // trim out items marked as "@internal" or "@alpha"
				}

				apiProperty = new ApiProperty(propertyOptions);
			} else {
				console.log(`We got a property in ApiItem of kind ${ApiItemKind[parentApiItem.kind]}`);
			}

			parentApiItem.addMember(apiProperty);
		} else {
			// If the property was already declared before (via a merged interface declaration),
			// we assume its signature is identical, because the language requires that.
		}
	}

	private _processApiPropertySignature(astDeclaration: AstDeclaration | null, context: IProcessAstEntityContext): void {
		const { name, parentApiItem } = context;
		const containerKey: string = ApiPropertySignature.getContainerKey(name);

		let apiPropertySignature: ApiPropertySignature | undefined = parentApiItem.tryGetMemberByKey(
			containerKey,
		) as ApiPropertySignature;
		const parent = context.parentDocgenJson as DocgenInterfaceJson | DocgenPropertyJson | DocgenTypedefJson | undefined;
		const jsDoc = parent?.props?.find((prop) => prop.name === name);

		if (
			apiPropertySignature === undefined &&
			(astDeclaration || !this._isInherited(parent as DocgenInterfaceJson, jsDoc!, parentApiItem.kind))
		) {
			if (astDeclaration) {
				const propertySignature: ts.PropertySignature = astDeclaration.declaration as ts.PropertySignature;

				const nodesToCapture: IExcerptBuilderNodeToCapture[] = [];

				const propertyTypeTokenRange: IExcerptTokenRange = ExcerptBuilder.createEmptyTokenRange();
				nodesToCapture.push({ node: propertySignature.type, tokenRange: propertyTypeTokenRange });

				const excerptTokens: IExcerptToken[] = this._buildExcerptTokens(astDeclaration, nodesToCapture);
				const apiItemMetadata: ApiItemMetadata = this._collector.fetchApiItemMetadata(astDeclaration);
				const docComment: tsdoc.DocComment | undefined = jsDoc
					? this._tsDocParser.parseString(
							`/**\n * ${this._fixLinkTags(jsDoc.description) ?? ''}\n${
								'see' in jsDoc ? jsDoc.see.map((see) => ` * @see ${see}\n`).join('') : ''
							}${'readonly' in jsDoc && jsDoc.readonly ? ' * @readonly\n' : ''}${
								'deprecated' in jsDoc && jsDoc.deprecated
									? ` * @deprecated ${
											typeof jsDoc.deprecated === 'string' ? this._fixLinkTags(jsDoc.deprecated) : jsDoc.deprecated
										}\n`
									: ''
							} */`,
						).docComment
					: apiItemMetadata.tsdocComment;
				const releaseTag: ReleaseTag = apiItemMetadata.effectiveReleaseTag;
				const isOptional: boolean = (astDeclaration.astSymbol.followedSymbol.flags & ts.SymbolFlags.Optional) !== 0;
				const isReadonly: boolean = this._isReadonly(astDeclaration);
				const sourceLocation: ISourceLocation = this._getSourceLocation(propertySignature);

				apiPropertySignature = new ApiPropertySignature({
					name,
					docComment,
					releaseTag,
					isOptional,
					excerptTokens,
					propertyTypeTokenRange,
					isReadonly,
					fileUrlPath: jsDoc && 'meta' in jsDoc ? filePathFromJson(jsDoc.meta) : sourceLocation.sourceFilePath,
					fileLine: jsDoc && 'meta' in jsDoc ? jsDoc.meta.line : sourceLocation.sourceFileLine,
					fileColumn: sourceLocation.sourceFileColumn,
				});
			} else if (parentApiItem.kind === ApiItemKind.Class || parentApiItem.kind === ApiItemKind.Interface) {
				apiPropertySignature = new ApiPropertySignature(
					this._mapProp(jsDoc as DocgenPropertyJson, parentApiItem.getAssociatedPackage()!.name),
				);
			} else {
				console.log(`We got a property in ApiItem of kind ${ApiItemKind[parentApiItem.kind]}`);
			}

			parentApiItem.addMember(apiPropertySignature);
		} else {
			// If the property was already declared before (via a merged interface declaration),
			// we assume its signature is identical, because the language requires that.
		}
	}

	private _processApiTypeAlias(astDeclaration: AstDeclaration, context: IProcessAstEntityContext): void {
		const { name, isExported, parentApiItem } = context;

		const containerKey: string = ApiTypeAlias.getContainerKey(name);

		let apiTypeAlias: ApiTypeAlias | undefined = parentApiItem.tryGetMemberByKey(containerKey) as ApiTypeAlias;
		const parent = context.parentDocgenJson as DocgenJson | undefined;
		const jsDoc =
			parent?.typedefs.find((type) => type.name === name) ??
			parent?.functions.find((func) => func.name === name) ??
			parent?.interfaces.find((clas) => clas.name === name);

		if (apiTypeAlias === undefined) {
			const typeAliasDeclaration: ts.TypeAliasDeclaration = astDeclaration.declaration as ts.TypeAliasDeclaration;

			const nodesToCapture: IExcerptBuilderNodeToCapture[] = [];

			const typeParameters: IApiTypeParameterOptions[] = this._captureTypeParameters(
				nodesToCapture,
				typeAliasDeclaration.typeParameters,
			);

			const typeTokenRange: IExcerptTokenRange = ExcerptBuilder.createEmptyTokenRange();
			nodesToCapture.push({ node: typeAliasDeclaration.type, tokenRange: typeTokenRange });

			const excerptTokens: IExcerptToken[] = this._buildExcerptTokens(astDeclaration, nodesToCapture);
			const apiItemMetadata: ApiItemMetadata = this._collector.fetchApiItemMetadata(astDeclaration);
			const docComment: tsdoc.DocComment | undefined = jsDoc
				? this._tsDocParser.parseString(
						`/**\n * ${this._fixLinkTags(jsDoc.description) ?? ''}\n${
							'params' in jsDoc
								? jsDoc.params
										.map((param) => ` * @param ${param.name} - ${this._fixLinkTags(param.description) ?? ''}\n`)
										.join('')
								: ''
						}${
							'returns' in jsDoc
								? jsDoc.returns
										.map((ret) => ` * @returns ${Array.isArray(ret) ? '' : this._fixLinkTags(ret.description) ?? ''}\n`)
										.join('')
								: ''
						} */`,
					).docComment
				: apiItemMetadata.tsdocComment;
			const releaseTag: ReleaseTag = apiItemMetadata.effectiveReleaseTag;
			const sourceLocation: ISourceLocation = this._getSourceLocation(typeAliasDeclaration);

			apiTypeAlias = new ApiTypeAlias({
				name,
				docComment,
				typeParameters,
				releaseTag,
				excerptTokens,
				typeTokenRange,
				isExported,
				fileUrlPath: jsDoc ? filePathFromJson(jsDoc.meta) : sourceLocation.sourceFilePath,
				fileLine: jsDoc?.meta.line ?? sourceLocation.sourceFileLine,
				fileColumn: sourceLocation.sourceFileColumn,
			});

			parentApiItem.addMember(apiTypeAlias);
		}
	}

	private _processApiVariable(astDeclaration: AstDeclaration, context: IProcessAstEntityContext): void {
		const { name, isExported, parentApiItem } = context;

		const containerKey: string = ApiVariable.getContainerKey(name);

		let apiVariable: ApiVariable | undefined = parentApiItem.tryGetMemberByKey(containerKey) as ApiVariable;

		if (apiVariable === undefined) {
			const variableDeclaration: ts.VariableDeclaration = astDeclaration.declaration as ts.VariableDeclaration;

			const nodesToCapture: IExcerptBuilderNodeToCapture[] = [];

			const variableTypeTokenRange: IExcerptTokenRange = ExcerptBuilder.createEmptyTokenRange();
			nodesToCapture.push({ node: variableDeclaration.type, tokenRange: variableTypeTokenRange });

			let initializerTokenRange: IExcerptTokenRange | undefined;
			if (variableDeclaration.initializer) {
				initializerTokenRange = ExcerptBuilder.createEmptyTokenRange();
				nodesToCapture.push({ node: variableDeclaration.initializer, tokenRange: initializerTokenRange });
			}

			const excerptTokens: IExcerptToken[] = this._buildExcerptTokens(astDeclaration, nodesToCapture);
			const apiItemMetadata: ApiItemMetadata = this._collector.fetchApiItemMetadata(astDeclaration);
			const docComment: tsdoc.DocComment | undefined = apiItemMetadata.tsdocComment;
			const releaseTag: ReleaseTag = apiItemMetadata.effectiveReleaseTag;
			const isReadonly: boolean = this._isReadonly(astDeclaration);
			const sourceLocation: ISourceLocation = this._getSourceLocation(variableDeclaration);

			apiVariable = new ApiVariable({
				name,
				docComment,
				releaseTag,
				excerptTokens,
				variableTypeTokenRange,
				initializerTokenRange,
				isReadonly,
				isExported,
				fileUrlPath: sourceLocation.sourceFilePath,
				fileLine: sourceLocation.sourceFileLine,
				fileColumn: sourceLocation.sourceFileColumn,
			});

			parentApiItem.addMember(apiVariable);
		}
	}

	// events aren't part of typescript, we only get them from docgen JSON here
	private _processApiEvent(context: IProcessAstEntityContext): void {
		const { name, parentApiItem } = context;
		const containerKey: string = ApiProperty.getContainerKey(name, false);

		let apiEvent: ApiEvent | undefined = parentApiItem.tryGetMemberByKey(containerKey) as ApiEvent;
		const parent = context.parentDocgenJson as DocgenClassJson | DocgenInterfaceJson | undefined;
		const jsDoc = parent?.events?.find((prop) => prop.name === name);

		if (apiEvent === undefined && jsDoc) {
			const excerptTokens: IExcerptToken[] = [
				{
					kind: ExcerptTokenKind.Content,
					text: `on('${name}', (${
						jsDoc.params?.length ? `${jsDoc.params[0]?.name}${jsDoc.params[0]?.nullable ? '?' : ''}: ` : ') => {})'
					}`,
				},
			];
			const parameters: IApiParameterOptions[] = [];
			for (let index = 0; index < (jsDoc.params?.length ?? 0) - 1; index++) {
				const parameter = jsDoc.params![index]!;
				const newTokens = this._mapVarType(parameter.type);
				parameters.push({
					parameterName: parameter.name,
					parameterTypeTokenRange: {
						startIndex: excerptTokens.length,
						endIndex: excerptTokens.length + newTokens.length,
					},
					isOptional: Boolean(parameter.optional),
					isRest: parameter.name.startsWith('...'),
				});
				excerptTokens.push(...newTokens);
				excerptTokens.push({
					kind: ExcerptTokenKind.Content,
					text: `, ${jsDoc.params![index + 1]?.name}${jsDoc.params![index + 1]!.optional ? '?' : ''}: `,
				});
			}

			if (jsDoc.params?.length) {
				const parameter = jsDoc.params![jsDoc.params.length - 1]!;
				const newTokens = this._mapVarType(parameter.type);
				parameters.push({
					parameterName: parameter.name,
					parameterTypeTokenRange: {
						startIndex: excerptTokens.length,
						endIndex: excerptTokens.length + newTokens.length,
					},
					isOptional: Boolean(parameter.optional),
					isRest: parameter.name.startsWith('...'),
				});
				excerptTokens.push(...newTokens);
				excerptTokens.push({
					kind: ExcerptTokenKind.Content,
					text: `) => {})`,
				});
			}

			const docComment: tsdoc.DocComment | undefined = this._tsDocParser.parseString(
				`/**\n * ${this._fixLinkTags(jsDoc.description) ?? ''}\n${
					jsDoc.params
						?.map((param) => ` * @param ${param.name} - ${this._fixLinkTags(param.description) ?? ''}\n`)
						.join('') ?? ''
				}${'see' in jsDoc ? jsDoc.see.map((see) => ` * @see ${see}\n`).join('') : ''}${
					'deprecated' in jsDoc && jsDoc.deprecated
						? ` * @deprecated ${
								typeof jsDoc.deprecated === 'string' ? this._fixLinkTags(jsDoc.deprecated) : jsDoc.deprecated
							}\n`
						: ''
				} */`,
			).docComment;
			const releaseTag: ReleaseTag = ReleaseTag.Public;

			apiEvent = new ApiEvent({
				name,
				docComment,
				releaseTag,
				excerptTokens,
				overloadIndex: 0,
				parameters,
				fileUrlPath: filePathFromJson(jsDoc.meta),
				fileLine: jsDoc.meta.line,
				fileColumn: 0,
			});
			parentApiItem.addMember(apiEvent);
		} else {
			// If the event was already declared before (via a merged interface declaration),
			// we assume its signature is identical, because the language requires that.
		}
	}

	/**
	 * @param astDeclaration - The declaration
	 * @param nodesToCapture - A list of child nodes whose token ranges we want to capture
	 */
	private _buildExcerptTokens(
		astDeclaration: AstDeclaration,
		nodesToCapture: IExcerptBuilderNodeToCapture[],
	): IExcerptToken[] {
		const excerptTokens: IExcerptToken[] = [];

		// Build the main declaration
		ExcerptBuilder.addDeclaration(excerptTokens, astDeclaration, nodesToCapture, this._referenceGenerator);

		const declarationMetadata: DeclarationMetadata = this._collector.fetchDeclarationMetadata(astDeclaration);

		// Add any ancillary declarations
		for (const ancillaryDeclaration of declarationMetadata.ancillaryDeclarations) {
			ExcerptBuilder.addBlankLine(excerptTokens);
			ExcerptBuilder.addDeclaration(excerptTokens, ancillaryDeclaration, nodesToCapture, this._referenceGenerator);
		}

		return excerptTokens;
	}

	private _captureTypeParameters(
		nodesToCapture: IExcerptBuilderNodeToCapture[],
		typeParameterNodes: ts.NodeArray<ts.TypeParameterDeclaration> | undefined,
	): IApiTypeParameterOptions[] {
		const typeParameters: IApiTypeParameterOptions[] = [];
		if (typeParameterNodes) {
			for (const typeParameter of typeParameterNodes) {
				const constraintTokenRange: IExcerptTokenRange = ExcerptBuilder.createEmptyTokenRange();
				nodesToCapture.push({ node: typeParameter.constraint, tokenRange: constraintTokenRange });

				const defaultTypeTokenRange: IExcerptTokenRange = ExcerptBuilder.createEmptyTokenRange();
				nodesToCapture.push({ node: typeParameter.default, tokenRange: defaultTypeTokenRange });

				typeParameters.push({
					typeParameterName: typeParameter.name.getText().trim(),
					constraintTokenRange,
					defaultTypeTokenRange,
				});
			}
		}

		return typeParameters;
	}

	private _captureParameters(
		nodesToCapture: IExcerptBuilderNodeToCapture[],
		parameterNodes: ts.NodeArray<ts.ParameterDeclaration>,
	): IApiParameterOptions[] {
		const parameters: IApiParameterOptions[] = [];
		for (const parameter of parameterNodes) {
			const parameterTypeTokenRange: IExcerptTokenRange = ExcerptBuilder.createEmptyTokenRange();
			nodesToCapture.push({ node: parameter.type, tokenRange: parameterTypeTokenRange });
			parameters.push({
				parameterName: parameter.name.getText().trim(),
				parameterTypeTokenRange,
				isOptional: this._collector.typeChecker.isOptionalParameter(parameter),
				isRest: Boolean(parameter.dotDotDotToken),
			});
		}

		return parameters;
	}

	private _isInherited(
		container: DocgenClassJson | DocgenInterfaceJson,
		jsDoc: DocgenParamJson | DocgenPropertyJson,
		containerKind: ApiItemKind,
	): boolean {
		switch (containerKind) {
			case ApiItemKind.Class: {
				const token = (container as DocgenClassJson).extends;
				const parentName = Array.isArray(token) ? token[0]?.[0]?.[0] : token?.types?.[0]?.[0]?.[0];
				const parentJson = this._jsDocJson?.classes.find((clas) => clas.name === parentName);
				if (parentJson) {
					if (parentJson.props?.find((prop) => prop.name === jsDoc.name)) {
						return true;
					} else {
						return this._isInherited(parentJson, jsDoc, containerKind);
					}
				}

				break;
			}

			case ApiItemKind.Interface: {
				const token = (container as DocgenInterfaceJson).extends;
				const parentNames = Array.isArray(token) ? token.map((parent) => parent[0]?.[0]) : undefined;
				const parentJsons = parentNames?.map((name) =>
					this._jsDocJson?.interfaces.find((inter) => inter.name === name),
				);
				if (parentJsons?.length) {
					for (const parentJson of parentJsons) {
						if (
							parentJson?.props?.find((prop) => prop.name === jsDoc.name) ||
							this._isInherited(parentJson as DocgenInterfaceJson, jsDoc, containerKind)
						) {
							return true;
						}
					}
				}

				break;
			}

			default:
				console.log(`Unexpected parent of type ${containerKind} (${container.name}) of ${jsDoc?.name} `);
		}

		return false;
	}

	private _isReadonly(astDeclaration: AstDeclaration): boolean {
		switch (astDeclaration.declaration.kind) {
			case ts.SyntaxKind.GetAccessor:
			case ts.SyntaxKind.IndexSignature:
			case ts.SyntaxKind.PropertyDeclaration:
			case ts.SyntaxKind.PropertySignature:
			case ts.SyntaxKind.SetAccessor:
			case ts.SyntaxKind.VariableDeclaration: {
				const apiItemMetadata: ApiItemMetadata = this._collector.fetchApiItemMetadata(astDeclaration);
				const docComment: tsdoc.DocComment | undefined = apiItemMetadata.tsdocComment;
				const declarationMetadata: DeclarationMetadata = this._collector.fetchDeclarationMetadata(astDeclaration);

				const hasReadonlyModifier: boolean = (astDeclaration.modifierFlags & ts.ModifierFlags.Readonly) !== 0;
				const hasReadonlyDocTag = Boolean(docComment?.modifierTagSet?.hasTagName('@readonly'));
				const isGetterWithNoSetter: boolean =
					ts.isGetAccessorDeclaration(astDeclaration.declaration) &&
					declarationMetadata.ancillaryDeclarations.length === 0;
				const isVarConst: boolean =
					ts.isVariableDeclaration(astDeclaration.declaration) &&
					TypeScriptInternals.isVarConst(astDeclaration.declaration);

				return hasReadonlyModifier || hasReadonlyDocTag || isGetterWithNoSetter || isVarConst;
			}

			default: {
				// Readonly-ness does not make sense for any other declaration kind.
				return false;
			}
		}
	}

	private _getSourceLocation(declaration: ts.Declaration): ISourceLocation {
		const sourceFile: ts.SourceFile = declaration.getSourceFile();
		const sourceLocation: ISourceLocation = this._collector.sourceMapper.getSourceLocation({
			sourceFile,
			pos: declaration.getStart(sourceFile, false),
		});

		sourceLocation.sourceFilePath = Path.convertToSlashes(
			path.relative(this._collector.extractorConfig.projectFolder, sourceLocation.sourceFilePath),
		);
		return sourceLocation;
	}

	private _fixLinkTags(input?: string): string | undefined {
		return input
			?.replaceAll(linkRegEx, (_match, _p1, _p2, _p3, _p4, _p5, _offset, _string, groups) => {
				let target = groups.class ?? groups.url;
				const external = this._jsDocJson?.externals.find((external) => groups.class && external.name === groups.class);
				const match = /discord-api-types-(?<type>[^#]*?)(?:#|\/(?<kind>[^#/]*)\/)(?<name>[^/}]*)}$/.exec(
					external?.see?.[0] ?? '',
				);
				if (match) {
					target = `discord-api-types#(${match.groups!.name}:${
						/^v\d+$/.test(match.groups!.type!) ? match.groups!.kind : 'type'
					})`;
				}

				return `{@link ${target}${groups.prop ? `.${groups.prop}` : ''}${groups.name ? ` |${groups.name}` : ''}}`;
			})
			.replaceAll('* ', '\n * * ');
	}

	private _mapVarType(typey: DocgenVarTypeJson): IExcerptToken[] {
		const mapper = Array.isArray(typey) ? typey : typey.types ?? [];
		const lookup: { [K in ts.SyntaxKind]?: string } = {
			[ts.SyntaxKind.ClassDeclaration]: 'class',
			[ts.SyntaxKind.EnumDeclaration]: 'enum',
			[ts.SyntaxKind.InterfaceDeclaration]: 'interface',
			[ts.SyntaxKind.TypeAliasDeclaration]: 'type',
		};
		return mapper
			.flatMap((typ, index) => {
				const result = typ.reduce<IExcerptToken[]>((arr, [type, symbol]) => {
					const astEntity =
						(this._collector.entities.find(
							(entity) => entity.nameForEmit === type && 'astDeclarations' in entity.astEntity,
						)?.astEntity as AstSymbol | undefined) ??
						(this._collector.entities.find((entity) => entity.nameForEmit === type && 'astSymbol' in entity.astEntity)
							?.astEntity as AstImport | undefined);
					const astSymbol = astEntity instanceof AstImport ? astEntity.astSymbol : astEntity;
					const match = astEntity instanceof AstImport ? moduleNameRegEx.exec(astEntity.modulePath) : null;
					const pkg = match?.groups!.package ?? this._apiModel.packages[0]!.name;
					return [
						...arr,
						{
							kind: type?.includes("'") ? ExcerptTokenKind.Content : ExcerptTokenKind.Reference,
							text: fixPrimitiveTypes(type ?? 'unknown', symbol),
							canonicalReference: type?.includes("'")
								? undefined
								: DeclarationReference.package(pkg)
										.addNavigationStep(
											Navigation.Members as any,
											DeclarationReference.parseComponent(type ?? 'unknown'),
										)
										.withMeaning(
											(lookup[astSymbol?.astDeclarations.at(-1)?.declaration.kind ?? ts.SyntaxKind.ClassDeclaration] ??
												'class') as Meaning,
										)
										.toString(),
						},
						{ kind: ExcerptTokenKind.Content, text: symbol ?? '' },
					];
				}, []);
				return index === 0 ? result : [{ kind: ExcerptTokenKind.Content, text: ' | ' }, ...result];
			})
			.filter((excerpt) => excerpt.text.length);
	}

	private _mapProp(prop: DocgenPropertyJson, _package: string): IApiPropertyOptions {
		const mappedVarType = this._mapVarType(prop.type);
		return {
			name: prop.name,
			isAbstract: Boolean(prop.abstract),
			isProtected: prop.access === 'protected',
			isStatic: prop.scope === 'static',
			isOptional: Boolean(prop.nullable),
			isReadonly: Boolean(prop.readonly),
			docComment: this._tsDocParser.parseString(
				`/**\n * ${this._fixLinkTags(prop.description) ?? ''}\n${
					prop.see?.map((see) => ` * @see ${see}\n`).join('') ?? ''
				}${prop.readonly ? ' * @readonly\n' : ''} */`,
			).docComment,
			excerptTokens: [
				{
					kind: ExcerptTokenKind.Content,
					text: `${prop.access ? `${prop.access} ` : ''}${prop.scope === 'static' ? 'static ' : ''}${
						prop.readonly ? 'readonly ' : ''
					}${prop.name} :`,
				},
				...mappedVarType,
				{ kind: ExcerptTokenKind.Content, text: ';' },
			],
			propertyTypeTokenRange: { startIndex: 1, endIndex: 1 + mappedVarType.length },
			releaseTag: prop.access === 'private' ? ReleaseTag.Internal : ReleaseTag.Public,
			fileLine: prop.meta?.line ?? 0,
			fileUrlPath: prop.meta ? `${prop.meta.path.slice(`packages/${_package}/`.length)}/${prop.meta.file}` : '',
		};
	}

	private _mapParam(
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

	private _mapMethod(method: DocgenMethodJson, _package: string): IApiMethodOptions {
		const excerptTokens: IExcerptToken[] = [];
		excerptTokens.push({
			kind: ExcerptTokenKind.Content,
			text: `${
				method.scope === 'global'
					? `export function ${method.name}(`
					: `${method.access ? `${method.access} ` : ''}${method.scope === 'static' ? 'static ' : ''}${method.name}(`
			}${
				method.params?.length
					? `${method.params[0]!.name}${method.params[0]!.nullable || method.params[0]!.optional ? '?' : ''}`
					: '): '
			}`,
		});
		const paramTokens: number[] = [];
		for (let index = 0; index < (method.params?.length ?? 0) - 1; index++) {
			const newTokens = this._mapVarType(method.params![index]!.type);
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
			const newTokens = this._mapVarType(method.params[method.params.length - 1]!.type);
			paramTokens.push(newTokens.length);
			excerptTokens.push(...newTokens);
			excerptTokens.push({ kind: ExcerptTokenKind.Content, text: `): ` });
		}

		const returnTokens = this._mapVarType(method.returns?.[0] ?? []);
		excerptTokens.push(...returnTokens);

		excerptTokens.push({ kind: ExcerptTokenKind.Content, text: ';' });

		return {
			name: method.name,
			isAbstract: Boolean(method.abstract),
			isOptional: false,
			isProtected: method.access === 'protected',
			isStatic: method.scope === 'static',
			overloadIndex: 1,
			parameters: method.params?.map((param, index) => this._mapParam(param, index, _package, paramTokens)) ?? [],
			releaseTag: method.access === 'private' ? ReleaseTag.Internal : ReleaseTag.Public,
			returnTypeTokenRange: method.returns?.length
				? { startIndex: excerptTokens.length - 1 - returnTokens.length, endIndex: excerptTokens.length - 1 }
				: { startIndex: 0, endIndex: 0 },
			typeParameters: [],
			docComment: this._tsDocParser.parseString(
				`/**\n * ${this._fixLinkTags(method.description) ?? ''}\n${
					method.params
						?.map((param) => ` * @param ${param.name} - ${this._fixLinkTags(param.description) ?? ''}\n`)
						.join('') ?? ''
				}${
					method.returns?.length && !Array.isArray(method.returns[0]) && method.returns[0]!.description
						? ` * @returns ${this._fixLinkTags(method.returns[0]!.description) ?? ''}`
						: ''
				}${method.examples?.map((example) => ` * @example\n * \`\`\`js\n * ${example}\n * \`\`\`\n`).join('') ?? ''}${
					method.deprecated
						? ` * @deprecated ${typeof method.deprecated === 'boolean' ? 'yes' : method.deprecated}\n`
						: ''
				} */`,
			).docComment,
			excerptTokens,
			fileLine: method.meta.line,
			fileUrlPath: `${method.meta.path.slice(`packages/${_package}/`.length)}/${method.meta.file}`,
		};
	}
}
