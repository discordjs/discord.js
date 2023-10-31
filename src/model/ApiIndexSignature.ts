// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import {
  DeclarationReference,
  Meaning,
  Navigation
} from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference';
import { ApiItemKind } from '../items/ApiItem';
import { type IApiDeclaredItemOptions, ApiDeclaredItem } from '../items/ApiDeclaredItem';
import { type IApiParameterListMixinOptions, ApiParameterListMixin } from '../mixins/ApiParameterListMixin';
import { type IApiReleaseTagMixinOptions, ApiReleaseTagMixin } from '../mixins/ApiReleaseTagMixin';
import { type IApiReturnTypeMixinOptions, ApiReturnTypeMixin } from '../mixins/ApiReturnTypeMixin';
import { type IApiReadonlyMixinOptions, ApiReadonlyMixin } from '../mixins/ApiReadonlyMixin';

/**
 * Constructor options for {@link ApiIndexSignature}.
 * @public
 */
export interface IApiIndexSignatureOptions
  extends IApiParameterListMixinOptions,
    IApiReleaseTagMixinOptions,
    IApiReturnTypeMixinOptions,
    IApiReadonlyMixinOptions,
    IApiDeclaredItemOptions {}

/**
 * Represents a TypeScript index signature.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * `ApiIndexSignature` represents a TypeScript declaration such as `[x: number]: number` in this example:
 *
 * ```ts
 * export interface INumberTable {
 *   // An index signature
 *   [value: number]: number;
 *
 *   // An overloaded index signature
 *   [name: string]: number;
 * }
 * ```
 *
 * @public
 */
export class ApiIndexSignature extends ApiParameterListMixin(
  ApiReleaseTagMixin(ApiReturnTypeMixin(ApiReadonlyMixin(ApiDeclaredItem)))
) {
  public constructor(options: IApiIndexSignatureOptions) {
    super(options);
  }

  public static getContainerKey(overloadIndex: number): string {
    return `|${ApiItemKind.IndexSignature}|${overloadIndex}`;
  }

  /** @override */
  public get kind(): ApiItemKind {
    return ApiItemKind.IndexSignature;
  }

  /** @override */
  public get containerKey(): string {
    return ApiIndexSignature.getContainerKey(this.overloadIndex);
  }

  /** @beta @override */
  public buildCanonicalReference(): DeclarationReference {
    const parent: DeclarationReference = this.parent
      ? this.parent.canonicalReference
      : // .withMeaning() requires some kind of component
        DeclarationReference.empty().addNavigationStep(Navigation.Members, '(parent)');
    return parent.withMeaning(Meaning.IndexSignature).withOverloadIndex(this.overloadIndex);
  }
}
