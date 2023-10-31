// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { DeclarationReference } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference';
import {
  ApiDocumentedItem,
  type IApiDocumentedItemJson,
  type IApiDocumentedItemOptions
} from './ApiDocumentedItem';
import type { ApiItem } from './ApiItem';
import { Excerpt, ExcerptToken, type IExcerptTokenRange, type IExcerptToken } from '../mixins/Excerpt';
import type { DeserializerContext } from '../model/DeserializerContext';
import { SourceLocation } from '../model/SourceLocation';

/**
 * Constructor options for {@link ApiDeclaredItem}.
 * @public
 */
export interface IApiDeclaredItemOptions extends IApiDocumentedItemOptions {
  excerptTokens: IExcerptToken[];
  fileUrlPath?: string;
}

export interface IApiDeclaredItemJson extends IApiDocumentedItemJson {
  excerptTokens: IExcerptToken[];
  fileUrlPath?: string;
}

/**
 * The base class for API items that have an associated source code excerpt containing a TypeScript declaration.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * Most `ApiItem` subclasses have declarations and thus extend `ApiDeclaredItem`.  Counterexamples include
 * `ApiModel` and `ApiPackage`, which do not have any corresponding TypeScript source code.
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export class ApiDeclaredItem extends ApiDocumentedItem {
  private _excerptTokens: ExcerptToken[];
  private _excerpt: Excerpt;
  private _fileUrlPath?: string;
  private _sourceLocation?: SourceLocation;

  public constructor(options: IApiDeclaredItemOptions) {
    super(options);

    this._excerptTokens = options.excerptTokens.map((token) => {
      const canonicalReference: DeclarationReference | undefined =
        token.canonicalReference === undefined
          ? undefined
          : DeclarationReference.parse(token.canonicalReference);
      return new ExcerptToken(token.kind, token.text, canonicalReference);
    });
    this._excerpt = new Excerpt(this.excerptTokens, { startIndex: 0, endIndex: this.excerptTokens.length });
    this._fileUrlPath = options.fileUrlPath;
  }

  /** @override */
  public static onDeserializeInto(
    options: Partial<IApiDeclaredItemOptions>,
    context: DeserializerContext,
    jsonObject: IApiDeclaredItemJson
  ): void {
    super.onDeserializeInto(options, context, jsonObject);

    options.excerptTokens = jsonObject.excerptTokens;
    options.fileUrlPath = jsonObject.fileUrlPath;
  }

  /**
   * The source code excerpt where the API item is declared.
   */
  public get excerpt(): Excerpt {
    return this._excerpt;
  }

  /**
   * The individual source code tokens that comprise the main excerpt.
   */
  public get excerptTokens(): ReadonlyArray<ExcerptToken> {
    return this._excerptTokens;
  }

  /**
   * The file URL path relative to the `projectFolder` and `projectFolderURL` fields
   * as defined in the `api-extractor.json` config. Is `undefined` if the path is
   * the same as the parent API item's.
   */
  public get fileUrlPath(): string | undefined {
    return this._fileUrlPath;
  }

  /**
   * Returns the source location where the API item is declared.
   */
  public get sourceLocation(): SourceLocation {
    if (!this._sourceLocation) {
      this._sourceLocation = this._buildSourceLocation();
    }
    return this._sourceLocation;
  }

  /**
   * If the API item has certain important modifier tags such as `@sealed`, `@virtual`, or `@override`,
   * this prepends them as a doc comment above the excerpt.
   */
  public getExcerptWithModifiers(): string {
    const excerpt: string = this.excerpt.text;
    const modifierTags: string[] = [];

    if (excerpt.length > 0) {
      if (this instanceof ApiDocumentedItem) {
        if (this.tsdocComment) {
          if (this.tsdocComment.modifierTagSet.isSealed()) {
            modifierTags.push('@sealed');
          }
          if (this.tsdocComment.modifierTagSet.isVirtual()) {
            modifierTags.push('@virtual');
          }
          if (this.tsdocComment.modifierTagSet.isOverride()) {
            modifierTags.push('@override');
          }
        }
        if (modifierTags.length > 0) {
          return '/** ' + modifierTags.join(' ') + ' */\n' + excerpt;
        }
      }
    }

    return excerpt;
  }

  /** @override */
  public serializeInto(jsonObject: Partial<IApiDeclaredItemJson>): void {
    super.serializeInto(jsonObject);
    jsonObject.excerptTokens = this.excerptTokens.map((x) => {
      const excerptToken: IExcerptToken = { kind: x.kind, text: x.text };
      if (x.canonicalReference !== undefined) {
        excerptToken.canonicalReference = x.canonicalReference.toString();
      }
      return excerptToken;
    });

    // Only serialize this API item's file URL path if it exists and it's different from its parent's
    // (a little optimization to keep the doc model succinct).
    if (this.fileUrlPath) {
      if (!(this.parent instanceof ApiDeclaredItem) || this.fileUrlPath !== this.parent.fileUrlPath) {
        jsonObject.fileUrlPath = this.fileUrlPath;
      }
    }
  }

  /**
   * Constructs a new {@link Excerpt} corresponding to the provided token range.
   */
  public buildExcerpt(tokenRange: IExcerptTokenRange): Excerpt {
    return new Excerpt(this.excerptTokens, tokenRange);
  }

  /**
   * Builds the cached object used by the `sourceLocation` property.
   */
  private _buildSourceLocation(): SourceLocation {
    const projectFolderUrl: string | undefined = this.getAssociatedPackage()?.projectFolderUrl;

    let fileUrlPath: string | undefined;
    for (let current: ApiItem | undefined = this; current !== undefined; current = current.parent) {
      if (current instanceof ApiDeclaredItem && current.fileUrlPath) {
        fileUrlPath = current.fileUrlPath;
        break;
      }
    }

    return new SourceLocation({
      projectFolderUrl: projectFolderUrl,
      fileUrlPath: fileUrlPath
    });
  }
}
