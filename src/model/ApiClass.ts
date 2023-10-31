// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import {
  DeclarationReference,
  Meaning,
  Navigation,
  type Component
} from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference';
import { ApiItemKind } from '../items/ApiItem';
import {
  ApiDeclaredItem,
  type IApiDeclaredItemOptions,
  type IApiDeclaredItemJson
} from '../items/ApiDeclaredItem';
import { ApiItemContainerMixin, type IApiItemContainerMixinOptions } from '../mixins/ApiItemContainerMixin';
import { ApiReleaseTagMixin, type IApiReleaseTagMixinOptions } from '../mixins/ApiReleaseTagMixin';
import type { IExcerptTokenRange } from '../mixins/Excerpt';
import { HeritageType } from './HeritageType';
import { type IApiNameMixinOptions, ApiNameMixin } from '../mixins/ApiNameMixin';
import {
  ApiTypeParameterListMixin,
  type IApiTypeParameterListMixinOptions,
  type IApiTypeParameterListMixinJson
} from '../mixins/ApiTypeParameterListMixin';
import type { DeserializerContext } from './DeserializerContext';
import {
  type IApiExportedMixinJson,
  type IApiExportedMixinOptions,
  ApiExportedMixin
} from '../mixins/ApiExportedMixin';
import {
  ApiAbstractMixin,
  type IApiAbstractMixinJson,
  type IApiAbstractMixinOptions
} from '../mixins/ApiAbstractMixin';

/**
 * Constructor options for {@link ApiClass}.
 * @public
 */
export interface IApiClassOptions
  extends IApiItemContainerMixinOptions,
    IApiNameMixinOptions,
    IApiAbstractMixinOptions,
    IApiReleaseTagMixinOptions,
    IApiDeclaredItemOptions,
    IApiTypeParameterListMixinOptions,
    IApiExportedMixinOptions {
  extendsTokenRange: IExcerptTokenRange | undefined;
  implementsTokenRanges: IExcerptTokenRange[];
}

export interface IApiClassJson
  extends IApiDeclaredItemJson,
    IApiAbstractMixinJson,
    IApiTypeParameterListMixinJson,
    IApiExportedMixinJson {
  extendsTokenRange?: IExcerptTokenRange;
  implementsTokenRanges: IExcerptTokenRange[];
}

/**
 * Represents a TypeScript class declaration.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * `ApiClass` represents a TypeScript declaration such as this:
 *
 * ```ts
 * export class X { }
 * ```
 *
 * @public
 */
export class ApiClass extends ApiItemContainerMixin(
  ApiNameMixin(
    ApiAbstractMixin(ApiTypeParameterListMixin(ApiReleaseTagMixin(ApiExportedMixin(ApiDeclaredItem))))
  )
) {
  /**
   * The base class that this class inherits from (using the `extends` keyword), or undefined if there is no base class.
   */
  public readonly extendsType: HeritageType | undefined;

  private readonly _implementsTypes: HeritageType[] = [];

  public constructor(options: IApiClassOptions) {
    super(options);

    if (options.extendsTokenRange) {
      this.extendsType = new HeritageType(this.buildExcerpt(options.extendsTokenRange));
    } else {
      this.extendsType = undefined;
    }

    for (const implementsTokenRange of options.implementsTokenRanges) {
      this._implementsTypes.push(new HeritageType(this.buildExcerpt(implementsTokenRange)));
    }
  }

  public static getContainerKey(name: string): string {
    return `${name}|${ApiItemKind.Class}`;
  }

  /** @override */
  public static onDeserializeInto(
    options: Partial<IApiClassOptions>,
    context: DeserializerContext,
    jsonObject: IApiClassJson
  ): void {
    super.onDeserializeInto(options, context, jsonObject);

    options.extendsTokenRange = jsonObject.extendsTokenRange;
    options.implementsTokenRanges = jsonObject.implementsTokenRanges;
  }

  /** @override */
  public get kind(): ApiItemKind {
    return ApiItemKind.Class;
  }

  /** @override */
  public get containerKey(): string {
    return ApiClass.getContainerKey(this.name);
  }

  /**
   * The list of interfaces that this class implements using the `implements` keyword.
   */
  public get implementsTypes(): ReadonlyArray<HeritageType> {
    return this._implementsTypes;
  }

  /** @override */
  public serializeInto(jsonObject: Partial<IApiClassJson>): void {
    super.serializeInto(jsonObject);

    // Note that JSON does not support the "undefined" value, so we simply omit the field entirely if it is undefined
    if (this.extendsType) {
      jsonObject.extendsTokenRange = this.extendsType.excerpt.tokenRange;
    }

    jsonObject.implementsTokenRanges = this.implementsTypes.map((x) => x.excerpt.tokenRange);
  }

  /** @beta @override */
  public buildCanonicalReference(): DeclarationReference {
    const nameComponent: Component = DeclarationReference.parseComponent(this.name);
    const navigation: Navigation = this.isExported ? Navigation.Exports : Navigation.Locals;
    return (this.parent ? this.parent.canonicalReference : DeclarationReference.empty())
      .addNavigationStep(navigation, nameComponent)
      .withMeaning(Meaning.Class);
  }
}
