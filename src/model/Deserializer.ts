// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { type IApiItemJson, type IApiItemOptions, type ApiItem, ApiItemKind } from '../items/ApiItem';
import { ApiClass, type IApiClassOptions, type IApiClassJson } from './ApiClass';
import { ApiEntryPoint, type IApiEntryPointOptions } from './ApiEntryPoint';
import { ApiMethod, type IApiMethodOptions } from './ApiMethod';
import { ApiModel } from './ApiModel';
import { ApiNamespace, type IApiNamespaceOptions } from './ApiNamespace';
import { ApiPackage, type IApiPackageOptions, type IApiPackageJson } from './ApiPackage';
import { ApiInterface, type IApiInterfaceOptions, type IApiInterfaceJson } from './ApiInterface';
import { ApiPropertySignature, type IApiPropertySignatureOptions } from './ApiPropertySignature';
import { ApiMethodSignature, type IApiMethodSignatureOptions } from './ApiMethodSignature';
import { ApiProperty, type IApiPropertyOptions } from './ApiProperty';
import { ApiEnumMember, type IApiEnumMemberOptions } from './ApiEnumMember';
import { ApiEnum, type IApiEnumOptions } from './ApiEnum';
import type { IApiPropertyItemJson } from '../items/ApiPropertyItem';
import { ApiConstructor, type IApiConstructorOptions } from './ApiConstructor';
import { ApiConstructSignature, type IApiConstructSignatureOptions } from './ApiConstructSignature';
import { ApiFunction, type IApiFunctionOptions } from './ApiFunction';
import { ApiCallSignature, type IApiCallSignatureOptions } from './ApiCallSignature';
import { ApiIndexSignature, type IApiIndexSignatureOptions } from './ApiIndexSignature';
import { ApiTypeAlias, type IApiTypeAliasOptions, type IApiTypeAliasJson } from './ApiTypeAlias';
import { ApiVariable, type IApiVariableOptions, type IApiVariableJson } from './ApiVariable';
import type { IApiDeclaredItemJson } from '../items/ApiDeclaredItem';
import type { DeserializerContext } from './DeserializerContext';

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
}
