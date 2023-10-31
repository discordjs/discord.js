// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import {
  DeclarationReference,
  Meaning,
  Navigation,
  type Component
} from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference';
import { ApiItemKind } from '../items/ApiItem';
import { ApiProtectedMixin, type IApiProtectedMixinOptions } from '../mixins/ApiProtectedMixin';
import { ApiStaticMixin, type IApiStaticMixinOptions } from '../mixins/ApiStaticMixin';
import { type IApiDeclaredItemOptions, ApiDeclaredItem } from '../items/ApiDeclaredItem';
import { type IApiParameterListMixinOptions, ApiParameterListMixin } from '../mixins/ApiParameterListMixin';
import { type IApiReleaseTagMixinOptions, ApiReleaseTagMixin } from '../mixins/ApiReleaseTagMixin';
import { ApiReturnTypeMixin, type IApiReturnTypeMixinOptions } from '../mixins/ApiReturnTypeMixin';
import { type IApiNameMixinOptions, ApiNameMixin } from '../mixins/ApiNameMixin';
import { type IApiAbstractMixinOptions, ApiAbstractMixin } from '../mixins/ApiAbstractMixin';
import {
  ApiTypeParameterListMixin,
  type IApiTypeParameterListMixinOptions
} from '../mixins/ApiTypeParameterListMixin';
import { ApiOptionalMixin, type IApiOptionalMixinOptions } from '../mixins/ApiOptionalMixin';

/**
 * Constructor options for {@link ApiMethod}.
 * @public
 */
export interface IApiMethodOptions
  extends IApiNameMixinOptions,
    IApiAbstractMixinOptions,
    IApiOptionalMixinOptions,
    IApiParameterListMixinOptions,
    IApiProtectedMixinOptions,
    IApiReleaseTagMixinOptions,
    IApiReturnTypeMixinOptions,
    IApiStaticMixinOptions,
    IApiTypeParameterListMixinOptions,
    IApiDeclaredItemOptions {}

/**
 * Represents a TypeScript member function declaration that belongs to an `ApiClass`.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * `ApiMethod` represents a TypeScript declaration such as the `render` member function in this example:
 *
 * ```ts
 * export class Widget {
 *   public render(): void { }
 * }
 * ```
 *
 * Compare with {@link ApiMethodSignature}, which represents a method belonging to an interface.
 * For example, a class method can be `static` but an interface method cannot.
 *
 * @public
 */
export class ApiMethod extends ApiNameMixin(
  ApiAbstractMixin(
    ApiOptionalMixin(
      ApiParameterListMixin(
        ApiProtectedMixin(
          ApiReleaseTagMixin(ApiReturnTypeMixin(ApiStaticMixin(ApiTypeParameterListMixin(ApiDeclaredItem))))
        )
      )
    )
  )
) {
  public constructor(options: IApiMethodOptions) {
    super(options);
  }

  public static getContainerKey(name: string, isStatic: boolean, overloadIndex: number): string {
    if (isStatic) {
      return `${name}|${ApiItemKind.Method}|static|${overloadIndex}`;
    } else {
      return `${name}|${ApiItemKind.Method}|instance|${overloadIndex}`;
    }
  }

  /** @override */
  public get kind(): ApiItemKind {
    return ApiItemKind.Method;
  }

  /** @override */
  public get containerKey(): string {
    return ApiMethod.getContainerKey(this.name, this.isStatic, this.overloadIndex);
  }

  /** @beta @override */
  public buildCanonicalReference(): DeclarationReference {
    const nameComponent: Component = DeclarationReference.parseComponent(this.name);
    return (this.parent ? this.parent.canonicalReference : DeclarationReference.empty())
      .addNavigationStep(this.isStatic ? Navigation.Exports : Navigation.Members, nameComponent)
      .withMeaning(Meaning.Member)
      .withOverloadIndex(this.overloadIndex);
  }
}
