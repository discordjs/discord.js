// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

/* eslint-disable @typescript-eslint/no-redeclare */

import {
  ApiItem,
  apiItem_onParentChanged,
  type IApiItemJson,
  type IApiItemOptions,
  type IApiItemConstructor,
  ApiItemKind
} from '../items/ApiItem';
import { ApiNameMixin } from './ApiNameMixin';
import type { DeserializerContext } from '../model/DeserializerContext';
import type { ApiModel } from '../model/ApiModel';
import type { ApiClass } from '../model/ApiClass';
import type { ApiInterface } from '../model/ApiInterface';
import { type ExcerptToken, ExcerptTokenKind } from './Excerpt';
import {
  type IFindApiItemsResult,
  type IFindApiItemsMessage,
  FindApiItemsMessageId
} from './IFindApiItemsResult';
import { InternalError } from '@rushstack/node-core-library';
import type { DeclarationReference } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference';
import type { HeritageType } from '../model/HeritageType';
import type { IResolveDeclarationReferenceResult } from '../model/ModelReferenceResolver';

/**
 * Constructor options for {@link (ApiItemContainerMixin:interface)}.
 * @public
 */
export interface IApiItemContainerMixinOptions extends IApiItemOptions {
  preserveMemberOrder?: boolean;
  members?: ApiItem[];
}

export interface IApiItemContainerJson extends IApiItemJson {
  preserveMemberOrder?: boolean;
  members: IApiItemJson[];
}

const _members: unique symbol = Symbol('ApiItemContainerMixin._members');
const _membersSorted: unique symbol = Symbol('ApiItemContainerMixin._membersSorted');
const _membersByContainerKey: unique symbol = Symbol('ApiItemContainerMixin._membersByContainerKey');
const _membersByName: unique symbol = Symbol('ApiItemContainerMixin._membersByName');
const _membersByKind: unique symbol = Symbol('ApiItemContainerMixin._membersByKind');
const _preserveMemberOrder: unique symbol = Symbol('ApiItemContainerMixin._preserveMemberOrder');

/**
 * The mixin base class for API items that act as containers for other child items.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.  The non-abstract classes (e.g. `ApiClass`, `ApiEnum`, `ApiInterface`, etc.) use
 * TypeScript "mixin" functions (e.g. `ApiDeclaredItem`, `ApiItemContainerMixin`, etc.) to add various
 * features that cannot be represented as a normal inheritance chain (since TypeScript does not allow a child class
 * to extend more than one base class).  The "mixin" is a TypeScript merged declaration with three components:
 * the function that generates a subclass, an interface that describes the members of the subclass, and
 * a namespace containing static members of the class.
 *
 * Examples of `ApiItemContainerMixin` child classes include `ApiModel`, `ApiPackage`, `ApiEntryPoint`,
 * and `ApiEnum`.  But note that `Parameter` is not considered a "member" of an `ApiMethod`; this relationship
 * is modeled using {@link (ApiParameterListMixin:interface).parameters} instead
 * of {@link ApiItem.members}.
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface ApiItemContainerMixin extends ApiItem {
  /**
   * Disables automatic sorting of {@link ApiItem.members}.
   *
   * @remarks
   * By default `ApiItemContainerMixin` will automatically sort its members according to their
   * {@link ApiItem.getSortKey} string, which provides a standardized mostly alphabetical ordering
   * that is appropriate for most API items.  When loading older .api.json files the automatic sorting
   * is reapplied and may update the ordering.
   *
   * Set `preserveMemberOrder` to true to disable automatic sorting for this container; instead, the
   * members will retain whatever ordering appeared in the {@link IApiItemContainerMixinOptions.members} array.
   * The `preserveMemberOrder` option is saved in the .api.json file.
   */
  readonly preserveMemberOrder: boolean;

  /**
   * Adds a new member to the container.
   *
   * @remarks
   * An ApiItem cannot be added to more than one container.
   */
  addMember(member: ApiItem): void;

  /**
   * Attempts to retrieve a member using its containerKey, or returns `undefined` if no matching member was found.
   *
   * @remarks
   * Use the `getContainerKey()` static member to construct the key.  Each subclass has a different implementation
   * of this function, according to the aspects that are important for identifying it.
   *
   * See {@link ApiItem.containerKey} for more information.
   */
  tryGetMemberByKey(containerKey: string): ApiItem | undefined;

  /**
   * Returns a list of members with the specified name.
   */
  findMembersByName(name: string): ReadonlyArray<ApiItem>;

  /**
   * Finds all of the ApiItem's immediate and inherited members by walking up the inheritance tree.
   *
   * @remarks
   *
   * Given the following class heritage:
   *
   * ```
   * export class A {
   *   public a: number|boolean;
   * }
   *
   * export class B extends A {
   *   public a: number;
   *   public b: string;
   * }
   *
   * export class C extends B {
   *   public c: boolean;
   * }
   * ```
   *
   * Calling `findMembersWithInheritance` on `C` will return `B.a`, `B.b`, and `C.c`. Calling the
   * method on `B` will return `B.a` and `B.b`. And calling the method on `A` will return just
   * `A.a`.
   *
   * The inherited members returned by this method may be incomplete. If so, there will be a flag
   * on the result object indicating this as well as messages explaining the errors in more detail.
   * Some scenarios include:
   *
   * - Interface extending from a type alias.
   *
   * - Class extending from a variable.
   *
   * - Extending from a declaration not present in the model (e.g. external package).
   *
   * - Extending from an unexported declaration (e.g. ae-forgotten-export). Common in mixin
   *   patterns.
   *
   * - Unexpected runtime errors...
   *
   * Lastly, be aware that the types of inherited members are returned with respect to their
   * defining class as opposed to with respect to the inheriting class. For example, consider
   * the following:
   *
   * ```
   * export class A<T> {
   *   public a: T;
   * }
   *
   * export class B extends A<number> {}
   * ```
   *
   * When called on `B`, this method will return `B.a` with type `T` as opposed to type
   * `number`, although the latter is more accurate.
   */
  findMembersWithInheritance(): IFindApiItemsResult;

  /**
   * For a given member of this container, return its `ApiItem.getMergedSiblings()` list.
   * @internal
   */
  _getMergedSiblingsForMember(memberApiItem: ApiItem): ReadonlyArray<ApiItem>;

  /** @override */
  serializeInto(jsonObject: Partial<IApiItemJson>): void;
}

/**
 * Mixin function for {@link ApiDeclaredItem}.
 *
 * @param baseClass - The base class to be extended
 * @returns A child class that extends baseClass, adding the {@link (ApiItemContainerMixin:interface)} functionality.
 *
 * @public
 */
export function ApiItemContainerMixin<TBaseClass extends IApiItemConstructor>(
  baseClass: TBaseClass
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): TBaseClass & (new (...args: any[]) => ApiItemContainerMixin) {
  class MixedClass extends baseClass implements ApiItemContainerMixin {
    public readonly [_members]: ApiItem[];
    public [_membersSorted]: boolean;
    public [_membersByContainerKey]: Map<string, ApiItem>;
    public [_preserveMemberOrder]: boolean;

    // For members of this container that extend ApiNameMixin, this stores the list of members with a given name.
    // Examples include merged declarations, overloaded functions, etc.
    public [_membersByName]: Map<string, ApiItem[]> | undefined;

    // For members of this container that do NOT extend ApiNameMixin, this stores the list of members
    // that share a common ApiItemKind.  Examples include overloaded constructors or index signatures.
    public [_membersByKind]: Map<string, ApiItem[]> | undefined; // key is ApiItemKind

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public constructor(...args: any[]) {
      super(...args);
      const options: IApiItemContainerMixinOptions = args[0] as IApiItemContainerMixinOptions;

      this[_members] = [];
      this[_membersSorted] = false;
      this[_membersByContainerKey] = new Map<string, ApiItem>();
      this[_preserveMemberOrder] = options.preserveMemberOrder ?? false;

      if (options.members) {
        for (const member of options.members) {
          this.addMember(member);
        }
      }
    }

    /** @override */
    public static onDeserializeInto(
      options: Partial<IApiItemContainerMixinOptions>,
      context: DeserializerContext,
      jsonObject: IApiItemContainerJson
    ): void {
      baseClass.onDeserializeInto(options, context, jsonObject);
      options.preserveMemberOrder = jsonObject.preserveMemberOrder;
      options.members = [];
      for (const memberObject of jsonObject.members) {
        options.members.push(ApiItem.deserialize(memberObject, context));
      }
    }

    /** @override */
    public get members(): ReadonlyArray<ApiItem> {
      if (!this[_membersSorted] && !this[_preserveMemberOrder]) {
        this[_members].sort((x, y) => x.getSortKey().localeCompare(y.getSortKey()));
        this[_membersSorted] = true;
      }

      return this[_members];
    }

    public get preserveMemberOrder(): boolean {
      return this[_preserveMemberOrder];
    }

    public addMember(member: ApiItem): void {
      if (this[_membersByContainerKey].has(member.containerKey)) {
        throw new Error(
          `Another member has already been added with the same name (${member.displayName})` +
            ` and containerKey (${member.containerKey})`
        );
      }

      const existingParent: ApiItem | undefined = member.parent;
      if (existingParent !== undefined) {
        throw new Error(
          `This item has already been added to another container: "${existingParent.displayName}"`
        );
      }

      this[_members].push(member);
      this[_membersByName] = undefined; // invalidate the lookup
      this[_membersByKind] = undefined; // invalidate the lookup
      this[_membersSorted] = false;
      this[_membersByContainerKey].set(member.containerKey, member);

      member[apiItem_onParentChanged](this);
    }

    public tryGetMemberByKey(containerKey: string): ApiItem | undefined {
      return this[_membersByContainerKey].get(containerKey);
    }

    public findMembersByName(name: string): ReadonlyArray<ApiItem> {
      this._ensureMemberMaps();
      return this[_membersByName]!.get(name) || [];
    }

    public findMembersWithInheritance(): IFindApiItemsResult {
      const messages: IFindApiItemsMessage[] = [];
      let maybeIncompleteResult: boolean = false;

      // For API items that don't support inheritance, this method just returns the item's
      // immediate members.
      switch (this.kind) {
        case ApiItemKind.Class:
        case ApiItemKind.Interface:
          break;
        default: {
          return {
            items: this.members.concat(),
            messages,
            maybeIncompleteResult
          };
        }
      }

      const membersByName: Map<string, ApiItem[]> = new Map();
      const membersByKind: Map<ApiItemKind, ApiItem[]> = new Map();

      const toVisit: ApiItem[] = [];
      let next: ApiItem | undefined = this;

      while (next) {
        const membersToAdd: ApiItem[] = [];

        // For each member, check to see if we've already seen a member with the same name
        // previously in the inheritance tree. If so, we know we won't inherit it, and thus
        // do not add it to our `membersToAdd` array.
        for (const member of next.members) {
          // We add the to-be-added members to an intermediate array instead of immediately
          // to the maps themselves to support method overloads with the same name.
          if (ApiNameMixin.isBaseClassOf(member)) {
            if (!membersByName.has(member.name)) {
              membersToAdd.push(member);
            }
          } else {
            if (!membersByKind.has(member.kind)) {
              membersToAdd.push(member);
            }
          }
        }

        for (const member of membersToAdd) {
          if (ApiNameMixin.isBaseClassOf(member)) {
            const members: ApiItem[] = membersByName.get(member.name) || [];
            members.push(member);
            membersByName.set(member.name, members);
          } else {
            const members: ApiItem[] = membersByKind.get(member.kind) || [];
            members.push(member);
            membersByKind.set(member.kind, members);
          }
        }

        // Interfaces can extend multiple interfaces, so iterate through all of them.
        const extendedItems: ApiItem[] = [];
        let extendsTypes: readonly HeritageType[] | undefined;

        switch (next.kind) {
          case ApiItemKind.Class: {
            const apiClass: ApiClass = next as ApiClass;
            extendsTypes = apiClass.extendsType ? [apiClass.extendsType] : [];
            break;
          }
          case ApiItemKind.Interface: {
            const apiInterface: ApiInterface = next as ApiInterface;
            extendsTypes = apiInterface.extendsTypes;
            break;
          }
        }

        if (extendsTypes === undefined) {
          messages.push({
            messageId: FindApiItemsMessageId.UnsupportedKind,
            text: `Unable to analyze references of API item ${next.displayName} because it is of unsupported kind ${next.kind}`
          });
          maybeIncompleteResult = true;
          next = toVisit.shift();
          continue;
        }

        for (const extendsType of extendsTypes) {
          // We want to find the reference token associated with the actual inherited declaration.
          // In every case we support, this is the first reference token. For example:
          //
          // ```
          // export class A extends B {}
          //                        ^
          // export class A extends B<C> {}
          //                        ^
          // export class A extends B.C {}
          //                        ^^^
          // ```
          const firstReferenceToken: ExcerptToken | undefined = extendsType.excerpt.spannedTokens.find(
            (token: ExcerptToken) => {
              return token.kind === ExcerptTokenKind.Reference && token.canonicalReference;
            }
          );

          if (!firstReferenceToken) {
            messages.push({
              messageId: FindApiItemsMessageId.ExtendsClauseMissingReference,
              text: `Unable to analyze extends clause ${extendsType.excerpt.text} of API item ${next.displayName} because no canonical reference was found`
            });
            maybeIncompleteResult = true;
            continue;
          }

          const apiModel: ApiModel | undefined = this.getAssociatedModel();
          if (!apiModel) {
            messages.push({
              messageId: FindApiItemsMessageId.NoAssociatedApiModel,
              text: `Unable to analyze references of API item ${next.displayName} because it is not associated with an ApiModel`
            });
            maybeIncompleteResult = true;
            continue;
          }

          const canonicalReference: DeclarationReference = firstReferenceToken.canonicalReference!;
          const apiItemResult: IResolveDeclarationReferenceResult = apiModel.resolveDeclarationReference(
            canonicalReference,
            undefined
          );

          const apiItem: ApiItem | undefined = apiItemResult.resolvedApiItem;
          if (!apiItem) {
            messages.push({
              messageId: FindApiItemsMessageId.DeclarationResolutionFailed,
              text: `Unable to resolve declaration reference within API item ${next.displayName}: ${apiItemResult.errorMessage}`
            });
            maybeIncompleteResult = true;
            continue;
          }

          extendedItems.push(apiItem);
        }

        // For classes, this array will only have one item. For interfaces, there may be multiple items. Sort the array
        // into alphabetical order before adding to our list of API items to visit. This ensures that in the case
        // of multiple interface inheritance, a member inherited from multiple interfaces is attributed to the interface
        // earlier in alphabetical order (as opposed to source order).
        //
        // For example, in the code block below, `Bar.x` is reported as the inherited item, not `Foo.x`.
        //
        // ```
        // interface Foo {
        //   public x: string;
        // }
        //
        // interface Bar {
        //   public x: string;
        // }
        //
        // interface FooBar extends Foo, Bar {}
        // ```
        extendedItems.sort((x: ApiItem, y: ApiItem) => x.getSortKey().localeCompare(y.getSortKey()));

        toVisit.push(...extendedItems);
        next = toVisit.shift();
      }

      const items: ApiItem[] = [];
      for (const members of membersByName.values()) {
        items.push(...members);
      }
      for (const members of membersByKind.values()) {
        items.push(...members);
      }
      items.sort((x: ApiItem, y: ApiItem) => x.getSortKey().localeCompare(y.getSortKey()));

      return {
        items,
        messages,
        maybeIncompleteResult
      };
    }

    /** @internal */
    public _getMergedSiblingsForMember(memberApiItem: ApiItem): ReadonlyArray<ApiItem> {
      this._ensureMemberMaps();
      let result: ApiItem[] | undefined;
      if (ApiNameMixin.isBaseClassOf(memberApiItem)) {
        result = this[_membersByName]!.get(memberApiItem.name);
      } else {
        result = this[_membersByKind]!.get(memberApiItem.kind);
      }
      if (!result) {
        throw new InternalError('Item was not found in the _membersByName/_membersByKind lookup');
      }
      return result;
    }

    /** @internal */
    public _ensureMemberMaps(): void {
      // Build the _membersByName and _membersByKind tables if they don't already exist
      if (this[_membersByName] === undefined) {
        const membersByName: Map<string, ApiItem[]> = new Map<string, ApiItem[]>();
        const membersByKind: Map<string, ApiItem[]> = new Map<string, ApiItem[]>();

        for (const member of this[_members]) {
          let map: Map<string, ApiItem[]> | Map<ApiItemKind, ApiItem[]>;
          let key: string | ApiItemKind;

          if (ApiNameMixin.isBaseClassOf(member)) {
            map = membersByName;
            key = member.name;
          } else {
            map = membersByKind;
            key = member.kind;
          }

          let list: ApiItem[] | undefined = map.get(key);
          if (list === undefined) {
            list = [];
            map.set(key, list);
          }
          list.push(member);
        }

        this[_membersByName] = membersByName;
        this[_membersByKind] = membersByKind;
      }
    }

    /** @override */
    public serializeInto(jsonObject: Partial<IApiItemContainerJson>): void {
      super.serializeInto(jsonObject);

      const memberObjects: IApiItemJson[] = [];

      for (const member of this.members) {
        const memberJsonObject: Partial<IApiItemJson> = {};
        member.serializeInto(memberJsonObject);
        memberObjects.push(memberJsonObject as IApiItemJson);
      }

      jsonObject.preserveMemberOrder = this.preserveMemberOrder;
      jsonObject.members = memberObjects;
    }
  }

  return MixedClass;
}

/**
 * Static members for {@link (ApiItemContainerMixin:interface)}.
 * @public
 */
export namespace ApiItemContainerMixin {
  /**
   * A type guard that tests whether the specified `ApiItem` subclass extends the `ApiItemContainerMixin` mixin.
   *
   * @remarks
   *
   * The JavaScript `instanceof` operator cannot be used to test for mixin inheritance, because each invocation of
   * the mixin function produces a different subclass.  (This could be mitigated by `Symbol.hasInstance`, however
   * the TypeScript type system cannot invoke a runtime test.)
   */
  export function isBaseClassOf(apiItem: ApiItem): apiItem is ApiItemContainerMixin {
    return apiItem.hasOwnProperty(_members);
  }
}
