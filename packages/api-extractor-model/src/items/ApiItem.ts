// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type { DeclarationReference } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference';
import type { Constructor, PropertiesOf } from '../mixins/Mixin';
import type { ApiPackage } from '../model/ApiPackage';
import { ApiParameterListMixin } from '../mixins/ApiParameterListMixin';
import type { DeserializerContext } from '../model/DeserializerContext';
import { InternalError } from '@rushstack/node-core-library';
import { ApiItemContainerMixin } from '../mixins/ApiItemContainerMixin';
import type { ApiModel } from '../model/ApiModel';

/**
 * The type returned by the {@link ApiItem.kind} property, which can be used to easily distinguish subclasses of
 * {@link ApiItem}.
 *
 * @public
 */
export enum ApiItemKind {
  CallSignature = 'CallSignature',
  Class = 'Class',
  Constructor = 'Constructor',
  ConstructSignature = 'ConstructSignature',
  EntryPoint = 'EntryPoint',
  Enum = 'Enum',
  EnumMember = 'EnumMember',
  Function = 'Function',
  IndexSignature = 'IndexSignature',
  Interface = 'Interface',
  Method = 'Method',
  MethodSignature = 'MethodSignature',
  Model = 'Model',
  Namespace = 'Namespace',
  Package = 'Package',
  Property = 'Property',
  PropertySignature = 'PropertySignature',
  TypeAlias = 'TypeAlias',
  Variable = 'Variable',
  None = 'None'
}

/**
 * Constructor options for {@link ApiItem}.
 * @public
 */
export interface IApiItemOptions {}

export interface IApiItemJson {
  kind: ApiItemKind;
  canonicalReference: string;
}

// PRIVATE - Allows ApiItemContainerMixin to assign the parent.
//
export const apiItem_onParentChanged: unique symbol = Symbol('ApiItem._onAddToContainer');

/**
 * The abstract base class for all members of an `ApiModel` object.
 *
 * @remarks
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 * @public
 */
export class ApiItem {
  private _canonicalReference: DeclarationReference | undefined;
  private _parent: ApiItem | undefined;

  public constructor(options: IApiItemOptions) {
    // ("options" is not used here, but part of the inheritance pattern)
  }

  public static deserialize(jsonObject: IApiItemJson, context: DeserializerContext): ApiItem {
    // The Deserializer class is coupled with a ton of other classes, so  we delay loading it
    // to avoid ES5 circular imports.
    const deserializerModule: typeof import('../model/Deserializer') = require('../model/Deserializer');
    return deserializerModule.Deserializer.deserialize(context, jsonObject);
  }

  /** @virtual */
  public static onDeserializeInto(
    options: Partial<IApiItemOptions>,
    context: DeserializerContext,
    jsonObject: IApiItemJson
  ): void {
    // (implemented by subclasses)
  }

  /** @virtual */
  public serializeInto(jsonObject: Partial<IApiItemJson>): void {
    jsonObject.kind = this.kind;
    jsonObject.canonicalReference = this.canonicalReference.toString();
  }

  /**
   * Identifies the subclass of the `ApiItem` base class.
   * @virtual
   */
  public get kind(): ApiItemKind {
    throw new Error('ApiItem.kind was not implemented by the child class');
  }

  /**
   * Warning: This API is used internally by API extractor but is not yet ready for general usage.
   *
   * @remarks
   *
   * Returns a `DeclarationReference` object using the experimental new declaration reference notation.
   *
   * @beta
   */
  public get canonicalReference(): DeclarationReference {
    if (!this._canonicalReference) {
      try {
        this._canonicalReference = this.buildCanonicalReference();
      } catch (e) {
        const name: string = this.getScopedNameWithinPackage() || this.displayName;
        throw new InternalError(`Error building canonical reference for ${name}:\n` + (e as Error).message);
      }
    }
    return this._canonicalReference;
  }

  /**
   * Returns a string key that can be used to efficiently retrieve an `ApiItem` from an `ApiItemContainerMixin`.
   * The key is unique within the container.  Its format is undocumented and may change at any time.
   *
   * @remarks
   * Use the `getContainerKey()` static member to construct the key.  Each subclass has a different implementation
   * of this function, according to the aspects that are important for identifying it.
   *
   * @virtual
   */
  public get containerKey(): string {
    throw new InternalError('ApiItem.containerKey was not implemented by the child class');
  }

  /**
   * Returns a name for this object that can be used in diagnostic messages, for example.
   *
   * @remarks
   * For an object that inherits ApiNameMixin, this will return the declared name (e.g. the name of a TypeScript
   * function).  Otherwise, it will return a string such as "(call signature)" or "(model)".
   *
   * @virtual
   */
  public get displayName(): string {
    switch (this.kind) {
      case ApiItemKind.CallSignature:
        return '(call)';
      case ApiItemKind.Constructor:
        return '(constructor)';
      case ApiItemKind.ConstructSignature:
        return '(new)';
      case ApiItemKind.IndexSignature:
        return '(indexer)';
      case ApiItemKind.Model:
        return '(model)';
    }
    return '(???)'; // All other types should inherit ApiNameMixin which will override this property
  }

  /**
   * If this item was added to a ApiItemContainerMixin item, then this returns the container item.
   * If this is an Parameter that was added to a method or function, then this returns the function item.
   * Otherwise, it returns undefined.
   * @virtual
   */
  public get parent(): ApiItem | undefined {
    return this._parent;
  }

  /**
   * This property supports a visitor pattern for walking the tree.
   * For items with ApiItemContainerMixin, it returns the contained items, sorted alphabetically.
   * Otherwise it returns an empty array.
   * @virtual
   */
  public get members(): ReadonlyArray<ApiItem> {
    return [];
  }

  /**
   * If this item has a name (i.e. extends `ApiNameMixin`), then return all items that have the same parent
   * and the same name.  Otherwise, return all items that have the same parent and the same `ApiItemKind`.
   *
   * @remarks
   * Examples: For a function, this would return all overloads for the function.  For a constructor, this would
   * return all overloads for the constructor.  For a merged declaration (e.g. a `namespace` and `enum` with the
   * same name), this would return both declarations.  If this item does not have a parent, or if it is the only
   * item of its name/kind, then the result is an array containing only this item.
   */
  public getMergedSiblings(): ReadonlyArray<ApiItem> {
    const parent: ApiItem | undefined = this._parent;
    if (parent && ApiItemContainerMixin.isBaseClassOf(parent)) {
      return parent._getMergedSiblingsForMember(this);
    }
    return [];
  }

  /**
   * Returns the chain of ancestors, starting from the root of the tree, and ending with the this item.
   */
  public getHierarchy(): ReadonlyArray<ApiItem> {
    const hierarchy: ApiItem[] = [];
    for (let current: ApiItem | undefined = this; current !== undefined; current = current.parent) {
      hierarchy.push(current);
    }
    hierarchy.reverse();
    return hierarchy;
  }

  /**
   * This returns a scoped name such as `"Namespace1.Namespace2.MyClass.myMember()"`.  It does not include the
   * package name or entry point.
   *
   * @remarks
   * If called on an ApiEntrypoint, ApiPackage, or ApiModel item, the result is an empty string.
   */
  public getScopedNameWithinPackage(): string {
    const reversedParts: string[] = [];

    for (let current: ApiItem | undefined = this; current !== undefined; current = current.parent) {
      if (
        current.kind === ApiItemKind.Model ||
        current.kind === ApiItemKind.Package ||
        current.kind === ApiItemKind.EntryPoint
      ) {
        break;
      }
      if (reversedParts.length !== 0) {
        reversedParts.push('.');
      } else {
        switch (current.kind) {
          case ApiItemKind.CallSignature:
          case ApiItemKind.ConstructSignature:
          case ApiItemKind.Constructor:
          case ApiItemKind.IndexSignature:
            // These functional forms don't have a proper name, so we don't append the "()" suffix
            break;
          default:
            if (ApiParameterListMixin.isBaseClassOf(current)) {
              reversedParts.push('()');
            }
        }
      }
      reversedParts.push(current.displayName);
    }

    return reversedParts.reverse().join('');
  }

  /**
   * If this item is an ApiPackage or has an ApiPackage as one of its parents, then that object is returned.
   * Otherwise undefined is returned.
   */
  public getAssociatedPackage(): ApiPackage | undefined {
    for (let current: ApiItem | undefined = this; current !== undefined; current = current.parent) {
      if (current.kind === ApiItemKind.Package) {
        return current as ApiPackage;
      }
    }
    return undefined;
  }

  /**
   * If this item is an ApiModel or has an ApiModel as one of its parents, then that object is returned.
   * Otherwise undefined is returned.
   */
  public getAssociatedModel(): ApiModel | undefined {
    for (let current: ApiItem | undefined = this; current !== undefined; current = current.parent) {
      if (current.kind === ApiItemKind.Model) {
        return current as ApiModel;
      }
    }
    return undefined;
  }

  /**
   * A text string whose value determines the sort order that is automatically applied by the
   * {@link (ApiItemContainerMixin:interface)} class.
   *
   * @remarks
   * The value of this string is undocumented and may change at any time.
   * If {@link (ApiItemContainerMixin:interface).preserveMemberOrder} is enabled for the `ApiItem`'s parent,
   * then no sorting is performed, and this key is not used.
   *
   * @virtual
   */
  public getSortKey(): string {
    return this.containerKey;
  }

  /**
   * PRIVATE
   *
   * @privateRemarks
   * Allows ApiItemContainerMixin to assign the parent when the item is added to a container.
   *
   * @internal
   */
  public [apiItem_onParentChanged](parent: ApiItem | undefined): void {
    this._parent = parent;
    this._canonicalReference = undefined;
  }

  /**
   * Builds the cached object used by the `canonicalReference` property.
   * @virtual
   */
  protected buildCanonicalReference(): DeclarationReference {
    throw new InternalError('ApiItem.canonicalReference was not implemented by the child class');
  }
}

/**
 * This abstraction is used by the mixin pattern.
 * It describes a class type that inherits from {@link ApiItem}.
 *
 * @public
 */
export interface IApiItemConstructor extends Constructor<ApiItem>, PropertiesOf<typeof ApiItem> {}
