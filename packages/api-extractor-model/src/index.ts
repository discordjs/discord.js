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

export { AedocDefinitions } from './aedoc/AedocDefinitions';
export { ReleaseTag } from './aedoc/ReleaseTag';

// items
export { IApiDeclaredItemOptions, ApiDeclaredItem } from './items/ApiDeclaredItem';
export { IApiDocumentedItemOptions, ApiDocumentedItem } from './items/ApiDocumentedItem';
export { ApiItemKind, IApiItemOptions, ApiItem, IApiItemConstructor } from './items/ApiItem';
export { IApiPropertyItemOptions, ApiPropertyItem } from './items/ApiPropertyItem';

// mixins
export {
  IApiParameterListMixinOptions,
  IApiParameterOptions,
  ApiParameterListMixin
} from './mixins/ApiParameterListMixin';
export {
  IApiTypeParameterOptions,
  IApiTypeParameterListMixinOptions,
  ApiTypeParameterListMixin
} from './mixins/ApiTypeParameterListMixin';
export { IApiAbstractMixinOptions, ApiAbstractMixin } from './mixins/ApiAbstractMixin';
export { IApiItemContainerMixinOptions, ApiItemContainerMixin } from './mixins/ApiItemContainerMixin';
export { IApiProtectedMixinOptions, ApiProtectedMixin } from './mixins/ApiProtectedMixin';
export { IApiReleaseTagMixinOptions, ApiReleaseTagMixin } from './mixins/ApiReleaseTagMixin';
export { IApiReturnTypeMixinOptions, ApiReturnTypeMixin } from './mixins/ApiReturnTypeMixin';
export { IApiStaticMixinOptions, ApiStaticMixin } from './mixins/ApiStaticMixin';
export { IApiNameMixinOptions, ApiNameMixin } from './mixins/ApiNameMixin';
export { IApiOptionalMixinOptions, ApiOptionalMixin } from './mixins/ApiOptionalMixin';
export { IApiReadonlyMixinOptions, ApiReadonlyMixin } from './mixins/ApiReadonlyMixin';
export { IApiInitializerMixinOptions, ApiInitializerMixin } from './mixins/ApiInitializerMixin';
export { IApiExportedMixinOptions, ApiExportedMixin } from './mixins/ApiExportedMixin';
export {
  IFindApiItemsResult,
  IFindApiItemsMessage,
  FindApiItemsMessageId
} from './mixins/IFindApiItemsResult';

export { ExcerptTokenKind, IExcerptTokenRange, IExcerptToken, ExcerptToken, Excerpt } from './mixins/Excerpt';
export { Constructor, PropertiesOf } from './mixins/Mixin';

// model
export { IApiCallSignatureOptions, ApiCallSignature } from './model/ApiCallSignature';
export { IApiClassOptions, ApiClass } from './model/ApiClass';
export { IApiConstructorOptions, ApiConstructor } from './model/ApiConstructor';
export { IApiConstructSignatureOptions, ApiConstructSignature } from './model/ApiConstructSignature';
export { IApiEntryPointOptions, ApiEntryPoint } from './model/ApiEntryPoint';
export { IApiEnumOptions, ApiEnum } from './model/ApiEnum';
export { IApiEnumMemberOptions, ApiEnumMember, EnumMemberOrder } from './model/ApiEnumMember';
export { IApiFunctionOptions, ApiFunction } from './model/ApiFunction';
export { IApiIndexSignatureOptions, ApiIndexSignature } from './model/ApiIndexSignature';
export { IApiInterfaceOptions, ApiInterface } from './model/ApiInterface';
export { IApiMethodOptions, ApiMethod } from './model/ApiMethod';
export { IApiMethodSignatureOptions, ApiMethodSignature } from './model/ApiMethodSignature';
export { ApiModel } from './model/ApiModel';
export { IApiNamespaceOptions, ApiNamespace } from './model/ApiNamespace';
export { IApiPackageOptions, ApiPackage, IApiPackageSaveOptions } from './model/ApiPackage';
export { IParameterOptions, Parameter } from './model/Parameter';
export { IApiPropertyOptions, ApiProperty } from './model/ApiProperty';
export { IApiPropertySignatureOptions, ApiPropertySignature } from './model/ApiPropertySignature';
export { IApiTypeAliasOptions, ApiTypeAlias } from './model/ApiTypeAlias';
export { ITypeParameterOptions, TypeParameter } from './model/TypeParameter';
export { IApiVariableOptions, ApiVariable } from './model/ApiVariable';
export { IResolveDeclarationReferenceResult } from './model/ModelReferenceResolver';
export { HeritageType } from './model/HeritageType';
export { ISourceLocationOptions, SourceLocation } from './model/SourceLocation';
