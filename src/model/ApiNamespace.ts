// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import {
  DeclarationReference,
  Meaning,
  Navigation,
  type Component
} from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference';
import { ApiItemKind } from '../items/ApiItem';
import { ApiItemContainerMixin, type IApiItemContainerMixinOptions } from '../mixins/ApiItemContainerMixin';
import { type IApiDeclaredItemOptions, ApiDeclaredItem } from '../items/ApiDeclaredItem';
import { ApiReleaseTagMixin, type IApiReleaseTagMixinOptions } from '../mixins/ApiReleaseTagMixin';
import { type IApiNameMixinOptions, ApiNameMixin } from '../mixins/ApiNameMixin';
import { type IApiExportedMixinOptions, ApiExportedMixin } from '../mixins/ApiExportedMixin';

/**
 * Constructor options for {@link ApiClass}.
 * @public
 */
export interface IApiNamespaceOptions
  extends IApiItemContainerMixinOptions,
    IApiNameMixinOptions,
    IApiReleaseTagMixinOptions,
    IApiDeclaredItemOptions,
    IApiExportedMixinOptions {}

/**
 * Represents a TypeScript namespace declaration.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * `ApiNamespace` represents a TypeScript declaration such `X` or `Y` in this example:
 *
 * ```ts
 * export namespace X {
 *   export namespace Y {
 *     export interface IWidget {
 *       render(): void;
 *     }
 *   }
 * }
 * ```
 *
 * @public
 */
export class ApiNamespace extends ApiItemContainerMixin(
  ApiNameMixin(ApiReleaseTagMixin(ApiExportedMixin(ApiDeclaredItem)))
) {
  public constructor(options: IApiNamespaceOptions) {
    super(options);
  }

  public static getContainerKey(name: string): string {
    return `${name}|${ApiItemKind.Namespace}`;
  }

  /** @override */
  public get kind(): ApiItemKind {
    return ApiItemKind.Namespace;
  }

  /** @override */
  public get containerKey(): string {
    return ApiNamespace.getContainerKey(this.name);
  }

  /** @beta @override */
  public buildCanonicalReference(): DeclarationReference {
    const nameComponent: Component = DeclarationReference.parseComponent(this.name);
    const navigation: Navigation = this.isExported ? Navigation.Exports : Navigation.Locals;
    return (this.parent ? this.parent.canonicalReference : DeclarationReference.empty())
      .addNavigationStep(navigation, nameComponent)
      .withMeaning(Meaning.Namespace);
  }
}
