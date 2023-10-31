// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { DeclarationReference } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference';
import { ApiItem, ApiItemKind, type IApiItemJson } from '../items/ApiItem';
import { ApiItemContainerMixin, type IApiItemContainerMixinOptions } from '../mixins/ApiItemContainerMixin';
import {
  JsonFile,
  type IJsonFileSaveOptions,
  PackageJsonLookup,
  type IPackageJson,
  type JsonObject
} from '@rushstack/node-core-library';
import { ApiDocumentedItem, type IApiDocumentedItemOptions } from '../items/ApiDocumentedItem';
import type { ApiEntryPoint } from './ApiEntryPoint';
import { type IApiNameMixinOptions, ApiNameMixin } from '../mixins/ApiNameMixin';
import { DeserializerContext, ApiJsonSchemaVersion } from './DeserializerContext';
import { TSDocConfiguration } from '@microsoft/tsdoc';
import { TSDocConfigFile } from '@microsoft/tsdoc-config';

/**
 * Constructor options for {@link ApiPackage}.
 * @public
 */
export interface IApiPackageOptions
  extends IApiItemContainerMixinOptions,
    IApiNameMixinOptions,
    IApiDocumentedItemOptions {
  tsdocConfiguration: TSDocConfiguration;
  projectFolderUrl?: string;
}

export interface IApiPackageMetadataJson {
  /**
   * The NPM package name for the tool that wrote the *.api.json file.
   * For informational purposes only.
   */
  toolPackage: string;

  /**
   * The NPM package version for the tool that wrote the *.api.json file.
   * For informational purposes only.
   */
  toolVersion: string;

  /**
   * The schema version for the .api.json file format.  Used for determining whether the file format is
   * supported, and for backwards compatibility.
   */
  schemaVersion: ApiJsonSchemaVersion;

  /**
   * To support forwards compatibility, the `oldestForwardsCompatibleVersion` field tracks the oldest schema version
   * whose corresponding deserializer could safely load this file.
   *
   * @remarks
   * Normally api-extractor-model should refuse to load a schema version that is newer than the latest version
   * that its deserializer understands.  However, sometimes a schema change may merely introduce some new fields
   * without modifying or removing any existing fields.  In this case, an older api-extractor-model library can
   * safely deserialize the newer version (by ignoring the extra fields that it doesn't recognize).  The newer
   * serializer can use this field to communicate that.
   *
   * If present, the `oldestForwardsCompatibleVersion` must be less than or equal to
   * `IApiPackageMetadataJson.schemaVersion`.
   */
  oldestForwardsCompatibleVersion?: ApiJsonSchemaVersion;

  /**
   * The TSDoc configuration that was used when analyzing the API for this package.
   *
   * @remarks
   *
   * The structure of this objet is defined by the `@microsoft/tsdoc-config` library.
   * Normally this configuration is loaded from the project's tsdoc.json file.  It is stored
   * in the .api.json file so that doc comments can be parsed accurately when loading the file.
   */
  tsdocConfig: JsonObject;
}

export interface IApiPackageJson extends IApiItemJson {
  /**
   * A file header that stores metadata about the tool that wrote the *.api.json file.
   */
  metadata: IApiPackageMetadataJson;

  /**
   * The base URL where the project's source code can be viewed on a website such as GitHub or
   * Azure DevOps. This URL path corresponds to the `<projectFolder>` path on disk. Provided via the
   * `api-extractor.json` config.
   */
  projectFolderUrl?: string;
}

/**
 * Options for {@link ApiPackage.saveToJsonFile}.
 * @public
 */
export interface IApiPackageSaveOptions extends IJsonFileSaveOptions {
  /**
   * Optionally specifies a value for the "toolPackage" field in the output .api.json data file;
   * otherwise, the value will be "api-extractor-model".
   */
  toolPackage?: string;

  /**
   * Optionally specifies a value for the "toolVersion" field in the output .api.json data file;
   * otherwise, the value will be the current version of the api-extractor-model package.
   */
  toolVersion?: string;

  /**
   * Set to true only when invoking API Extractor's test harness.
   *
   * @remarks
   * When `testMode` is true, the `toolVersion` field in the .api.json file is assigned an empty string
   * to prevent spurious diffs in output files tracked for tests.
   */
  testMode?: boolean;
}

/**
 * Represents an NPM package containing API declarations.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * @public
 */
export class ApiPackage extends ApiItemContainerMixin(ApiNameMixin(ApiDocumentedItem)) {
  private readonly _tsdocConfiguration: TSDocConfiguration;
  private readonly _projectFolderUrl?: string;

  public constructor(options: IApiPackageOptions) {
    super(options);

    this._tsdocConfiguration = options.tsdocConfiguration;
    this._projectFolderUrl = options.projectFolderUrl;
  }

  /** @override */
  public static onDeserializeInto(
    options: Partial<IApiPackageOptions>,
    context: DeserializerContext,
    jsonObject: IApiPackageJson
  ): void {
    super.onDeserializeInto(options, context, jsonObject);

    options.projectFolderUrl = jsonObject.projectFolderUrl;
  }

  public static loadFromJsonFile(apiJsonFilename: string): ApiPackage {
    const jsonObject: IApiPackageJson = JsonFile.load(apiJsonFilename);

    if (!jsonObject || !jsonObject.metadata || typeof jsonObject.metadata.schemaVersion !== 'number') {
      throw new Error(
        `Error loading ${apiJsonFilename}:` +
          `\nThe file format is not recognized; the "metadata.schemaVersion" field is missing or invalid`
      );
    }

    const schemaVersion: number = jsonObject.metadata.schemaVersion;

    if (schemaVersion < ApiJsonSchemaVersion.OLDEST_SUPPORTED) {
      throw new Error(
        `Error loading ${apiJsonFilename}:` +
          `\nThe file format is version ${schemaVersion},` +
          ` whereas ${ApiJsonSchemaVersion.OLDEST_SUPPORTED} is the oldest version supported by this tool`
      );
    }

    let oldestForwardsCompatibleVersion: number = schemaVersion;
    if (jsonObject.metadata.oldestForwardsCompatibleVersion) {
      // Sanity check
      if (jsonObject.metadata.oldestForwardsCompatibleVersion > schemaVersion) {
        throw new Error(
          `Error loading ${apiJsonFilename}:` +
            `\nInvalid file format; "oldestForwardsCompatibleVersion" cannot be newer than "schemaVersion"`
        );
      }
      oldestForwardsCompatibleVersion = jsonObject.metadata.oldestForwardsCompatibleVersion;
    }

    let versionToDeserialize: number = schemaVersion;
    if (versionToDeserialize > ApiJsonSchemaVersion.LATEST) {
      // If the file format is too new, can we treat it as some earlier compatible version
      // as indicated by oldestForwardsCompatibleVersion?
      versionToDeserialize = Math.max(oldestForwardsCompatibleVersion, ApiJsonSchemaVersion.LATEST);

      if (versionToDeserialize > ApiJsonSchemaVersion.LATEST) {
        // Nope, still too new
        throw new Error(
          `Error loading ${apiJsonFilename}:` +
            `\nThe file format version ${schemaVersion} was written by a newer release of` +
            ` the api-extractor-model library; you may need to upgrade your software`
        );
      }
    }

    const tsdocConfiguration: TSDocConfiguration = new TSDocConfiguration();

    if (versionToDeserialize >= ApiJsonSchemaVersion.V_1004) {
      const tsdocConfigFile: TSDocConfigFile = TSDocConfigFile.loadFromObject(
        jsonObject.metadata.tsdocConfig
      );
      if (tsdocConfigFile.hasErrors) {
        throw new Error(`Error loading ${apiJsonFilename}:\n` + tsdocConfigFile.getErrorSummary());
      }

      tsdocConfigFile.configureParser(tsdocConfiguration);
    }

    const context: DeserializerContext = new DeserializerContext({
      apiJsonFilename,
      toolPackage: jsonObject.metadata.toolPackage,
      toolVersion: jsonObject.metadata.toolVersion,
      versionToDeserialize: versionToDeserialize,
      tsdocConfiguration
    });

    return ApiItem.deserialize(jsonObject, context) as ApiPackage;
  }

  /** @override */
  public get kind(): ApiItemKind {
    return ApiItemKind.Package;
  }

  /** @override */
  public get containerKey(): string {
    // No prefix needed, because ApiPackage is the only possible member of an ApiModel
    return this.name;
  }

  public get entryPoints(): ReadonlyArray<ApiEntryPoint> {
    return this.members as ReadonlyArray<ApiEntryPoint>;
  }

  /**
   * The TSDoc configuration that was used when analyzing the API for this package.
   *
   * @remarks
   *
   * Normally this configuration is loaded from the project's tsdoc.json file.  It is stored
   * in the .api.json file so that doc comments can be parsed accurately when loading the file.
   */
  public get tsdocConfiguration(): TSDocConfiguration {
    return this._tsdocConfiguration;
  }

  public get projectFolderUrl(): string | undefined {
    return this._projectFolderUrl;
  }

  /** @override */
  public addMember(member: ApiEntryPoint): void {
    if (member.kind !== ApiItemKind.EntryPoint) {
      throw new Error('Only items of type ApiEntryPoint may be added to an ApiPackage');
    }
    super.addMember(member);
  }

  public findEntryPointsByPath(importPath: string): ReadonlyArray<ApiEntryPoint> {
    return this.findMembersByName(importPath) as ReadonlyArray<ApiEntryPoint>;
  }

  public saveToJsonFile(apiJsonFilename: string, options?: IApiPackageSaveOptions): void {
    if (!options) {
      options = {};
    }

    const packageJson: IPackageJson = PackageJsonLookup.loadOwnPackageJson(__dirname);

    const tsdocConfigFile: TSDocConfigFile = TSDocConfigFile.loadFromParser(this.tsdocConfiguration);
    const tsdocConfig: JsonObject = tsdocConfigFile.saveToObject();

    const jsonObject: IApiPackageJson = {
      metadata: {
        toolPackage: options.toolPackage || packageJson.name,
        // In test mode, we don't write the real version, since that would cause spurious diffs whenever
        // the version is bumped.  Instead we write a placeholder string.
        toolVersion: options.testMode ? '[test mode]' : options.toolVersion || packageJson.version,
        schemaVersion: ApiJsonSchemaVersion.LATEST,
        oldestForwardsCompatibleVersion: ApiJsonSchemaVersion.OLDEST_FORWARDS_COMPATIBLE,
        tsdocConfig
      }
    } as IApiPackageJson;

    if (this.projectFolderUrl) {
      jsonObject.projectFolderUrl = this.projectFolderUrl;
    }

    this.serializeInto(jsonObject);
    JsonFile.save(jsonObject, apiJsonFilename, options);
  }

  /** @beta @override */
  public buildCanonicalReference(): DeclarationReference {
    return DeclarationReference.package(this.name);
  }
}
