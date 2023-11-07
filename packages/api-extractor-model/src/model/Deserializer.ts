// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type { IApiDeclaredItemJson } from '../items/ApiDeclaredItem.js';
import { type IApiItemJson, type IApiItemOptions, type ApiItem, ApiItemKind } from '../items/ApiItem.js';
import type { IApiPropertyItemJson } from '../items/ApiPropertyItem.js';
import { ApiCallSignature, type IApiCallSignatureOptions } from './ApiCallSignature.js';
import { ApiClass, type IApiClassOptions, type IApiClassJson } from './ApiClass.js';
import { ApiConstructSignature, type IApiConstructSignatureOptions } from './ApiConstructSignature.js';
import { ApiConstructor, type IApiConstructorOptions } from './ApiConstructor.js';
import { ApiEntryPoint, type IApiEntryPointOptions } from './ApiEntryPoint.js';
import { ApiEnum, type IApiEnumOptions } from './ApiEnum.js';
import { ApiEnumMember, type IApiEnumMemberOptions } from './ApiEnumMember.js';
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
import type { DeserializerContext } from './DeserializerContext.js';

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
