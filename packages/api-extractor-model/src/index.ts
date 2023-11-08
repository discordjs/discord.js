// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

/**
 * Use this library to read and write *.api.json files as defined by the
 * {@link https://api-extractor.com/ | API Extractor}  tool.  These files are used to generate a documentation
 * website for your TypeScript package.  The files store the API signatures and doc comments that were extracted
 * from your package.
 *
 * @packageDocumentation
 */

export { AedocDefinitions } from './aedoc/AedocDefinitions.js';
export { ReleaseTag, compare as releaseTagCompare, getTagName as releaseTagGetTagName } from './aedoc/ReleaseTag.js';

// items
export { type IApiDeclaredItemOptions, ApiDeclaredItem } from './items/ApiDeclaredItem.js';
export { type IApiDocumentedItemOptions, ApiDocumentedItem } from './items/ApiDocumentedItem.js';
export { ApiItemKind, type IApiItemOptions, ApiItem, type IApiItemConstructor } from './items/ApiItem.js';
export { type IApiPropertyItemOptions, ApiPropertyItem } from './items/ApiPropertyItem.js';

// mixins
export {
	type IApiParameterListMixinOptions,
	type IApiParameterOptions,
	ApiParameterListMixin,
} from './mixins/ApiParameterListMixin.js';
export {
	type IApiTypeParameterOptions,
	type IApiTypeParameterListMixinOptions,
	ApiTypeParameterListMixin,
} from './mixins/ApiTypeParameterListMixin.js';
export { type IApiAbstractMixinOptions, ApiAbstractMixin } from './mixins/ApiAbstractMixin.js';
export { type IApiItemContainerMixinOptions, ApiItemContainerMixin } from './mixins/ApiItemContainerMixin.js';
export { type IApiProtectedMixinOptions, ApiProtectedMixin } from './mixins/ApiProtectedMixin.js';
export { type IApiReleaseTagMixinOptions, ApiReleaseTagMixin } from './mixins/ApiReleaseTagMixin.js';
export { type IApiReturnTypeMixinOptions, ApiReturnTypeMixin } from './mixins/ApiReturnTypeMixin.js';
export { type IApiStaticMixinOptions, ApiStaticMixin } from './mixins/ApiStaticMixin.js';
export { type IApiNameMixinOptions, ApiNameMixin } from './mixins/ApiNameMixin.js';
export { type IApiOptionalMixinOptions, ApiOptionalMixin } from './mixins/ApiOptionalMixin.js';
export { type IApiReadonlyMixinOptions, ApiReadonlyMixin } from './mixins/ApiReadonlyMixin.js';
export { type IApiInitializerMixinOptions, ApiInitializerMixin } from './mixins/ApiInitializerMixin.js';
export { type IApiExportedMixinOptions, ApiExportedMixin } from './mixins/ApiExportedMixin.js';
export {
	type IFindApiItemsResult,
	type IFindApiItemsMessage,
	FindApiItemsMessageId,
} from './mixins/IFindApiItemsResult.js';

export {
	ExcerptTokenKind,
	type IExcerptTokenRange,
	type IExcerptToken,
	ExcerptToken,
	Excerpt,
} from './mixins/Excerpt.js';
export type { Constructor, PropertiesOf } from './mixins/Mixin.js';

// model
export { type IApiCallSignatureOptions, ApiCallSignature } from './model/ApiCallSignature.js';
export { type IApiClassOptions, ApiClass, type IExcerptTokenRangeWithTypeParameters } from './model/ApiClass.js';
export { type IApiConstructorOptions, ApiConstructor } from './model/ApiConstructor.js';
export { type IApiConstructSignatureOptions, ApiConstructSignature } from './model/ApiConstructSignature.js';
export { type IApiEntryPointOptions, ApiEntryPoint } from './model/ApiEntryPoint.js';
export { type IApiEnumOptions, ApiEnum } from './model/ApiEnum.js';
export { type IApiEnumMemberOptions, ApiEnumMember, EnumMemberOrder } from './model/ApiEnumMember.js';
export { type IApiEventOptions, ApiEvent } from './model/ApiEvent.js';
export { type IApiFunctionOptions, ApiFunction } from './model/ApiFunction.js';
export { type IApiIndexSignatureOptions, ApiIndexSignature } from './model/ApiIndexSignature.js';
export { type IApiInterfaceOptions, ApiInterface } from './model/ApiInterface.js';
export { type IApiMethodOptions, ApiMethod } from './model/ApiMethod.js';
export { type IApiMethodSignatureOptions, ApiMethodSignature } from './model/ApiMethodSignature.js';
export { ApiModel } from './model/ApiModel.js';
export { type IApiNamespaceOptions, ApiNamespace } from './model/ApiNamespace.js';
export { type IApiPackageOptions, ApiPackage, type IApiPackageSaveOptions } from './model/ApiPackage.js';
export { type IParameterOptions, Parameter } from './model/Parameter.js';
export { type IApiPropertyOptions, ApiProperty } from './model/ApiProperty.js';
export { type IApiPropertySignatureOptions, ApiPropertySignature } from './model/ApiPropertySignature.js';
export { type IApiTypeAliasOptions, ApiTypeAlias } from './model/ApiTypeAlias.js';
export { type ITypeParameterOptions, TypeParameter } from './model/TypeParameter.js';
export { type IApiVariableOptions, ApiVariable } from './model/ApiVariable.js';
export type { IResolveDeclarationReferenceResult } from './model/ModelReferenceResolver.js';
export { HeritageType } from './model/HeritageType.js';
export { type ISourceLocationOptions, SourceLocation } from './model/SourceLocation.js';
export { Navigation, Meaning } from './items/ApiItem.js';
