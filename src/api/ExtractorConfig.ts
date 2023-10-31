// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as path from 'path';
import * as resolve from 'resolve';
import lodash = require('lodash');
import {
  JsonFile,
  JsonSchema,
  FileSystem,
  PackageJsonLookup,
  type INodePackageJson,
  PackageName,
  Text,
  InternalError,
  Path,
  NewlineKind
} from '@rushstack/node-core-library';
import { type IRigConfig, RigConfig } from '@rushstack/rig-package';

import type { IConfigFile, IExtractorMessagesConfig } from './IConfigFile';
import { PackageMetadataManager } from '../analyzer/PackageMetadataManager';
import { MessageRouter } from '../collector/MessageRouter';
import { EnumMemberOrder } from '@microsoft/api-extractor-model';
import { TSDocConfiguration } from '@microsoft/tsdoc';
import { TSDocConfigFile } from '@microsoft/tsdoc-config';

import apiExtractorSchema from '../schemas/api-extractor.schema.json';

/**
 * Tokens used during variable expansion of path fields from api-extractor.json.
 */
interface IExtractorConfigTokenContext {
  /**
   * The `<unscopedPackageName>` token returns the project's NPM package name, without any NPM scope.
   * If there is no associated package.json file, then the value is `unknown-package`.
   *
   * Example: `my-project`
   */
  unscopedPackageName: string;

  /**
   * The `<packageName>` token returns the project's full NPM package name including any NPM scope.
   * If there is no associated package.json file, then the value is `unknown-package`.
   *
   * Example: `@scope/my-project`
   */
  packageName: string;

  /**
   * The `<projectFolder>` token returns the expanded `"projectFolder"` setting from api-extractor.json.
   */
  projectFolder: string;
}

/**
 * Options for {@link ExtractorConfig.tryLoadForFolder}.
 *
 * @public
 */
export interface IExtractorConfigLoadForFolderOptions {
  /**
   * The folder path to start from when searching for api-extractor.json.
   */
  startingFolder: string;

  /**
   * An already constructed `PackageJsonLookup` cache object to use.  If omitted, a temporary one will
   * be constructed.
   */
  packageJsonLookup?: PackageJsonLookup;

  /**
   * An already constructed `RigConfig` object.  If omitted, then a new `RigConfig` object will be constructed.
   */
  rigConfig?: IRigConfig;
}

/**
 * Options for {@link ExtractorConfig.prepare}.
 *
 * @public
 */
export interface IExtractorConfigPrepareOptions {
  /**
   * A configuration object as returned by {@link ExtractorConfig.loadFile}.
   */
  configObject: IConfigFile;

  /**
   * The absolute path of the file that the `configObject` object was loaded from.  This is used for error messages
   * and when probing for `tsconfig.json`.
   *
   * @remarks
   *
   * If `configObjectFullPath` and `projectFolderLookupToken` are both unspecified, then the api-extractor.json
   * config file must explicitly specify a `projectFolder` setting rather than relying on the `<lookup>` token.
   */
  configObjectFullPath: string | undefined;

  /**
   * The parsed package.json file for the working package, or undefined if API Extractor was invoked without
   * a package.json file.
   *
   * @remarks
   *
   * If omitted, then the `<unscopedPackageName>` and `<packageName>` tokens will have default values.
   */
  packageJson?: INodePackageJson | undefined;

  /**
   * The absolute path of the file that the `packageJson` object was loaded from, or undefined if API Extractor
   * was invoked without a package.json file.
   *
   * @remarks
   *
   * This is used for error messages and when resolving paths found in package.json.
   *
   * If `packageJsonFullPath` is specified but `packageJson` is omitted, the file will be loaded automatically.
   */
  packageJsonFullPath: string | undefined;

  /**
   * The default value for the `projectFolder` setting is the `<lookup>` token, which uses a heuristic to guess
   * an appropriate project folder.  Use `projectFolderLookupValue` to manually specify the `<lookup>` token value
   * instead.
   *
   * @remarks
   * If the `projectFolder` setting is explicitly specified in api-extractor.json file, it should take precedence
   * over a value specified via the API.  Thus the `projectFolderLookupToken` option provides a way to override
   * the default value for `projectFolder` setting while still honoring a manually specified value.
   */
  projectFolderLookupToken?: string;

  /**
   * Allow customization of the tsdoc.json config file.  If omitted, this file will be loaded from its default
   * location.  If the file does not exist, then the standard definitions will be used from
   * `@microsoft/api-extractor/extends/tsdoc-base.json`.
   */
  tsdocConfigFile?: TSDocConfigFile;

  /**
   * When preparing the configuration object, folder and file paths referenced in the configuration are checked
   * for existence, and an error is reported if they are not found.  This option can be used to disable this
   * check for the main entry point module. This may be useful when preparing a configuration file for an
   * un-built project.
   */
  ignoreMissingEntryPoint?: boolean;
}

interface IExtractorConfigParameters {
  projectFolder: string;
  packageJson: INodePackageJson | undefined;
  packageFolder: string | undefined;
  mainEntryPointFilePath: string;
  bundledPackages: string[];
  tsconfigFilePath: string;
  overrideTsconfig: {} | undefined;
  skipLibCheck: boolean;
  apiReportEnabled: boolean;
  reportFilePath: string;
  reportTempFilePath: string;
  apiReportIncludeForgottenExports: boolean;
  docModelEnabled: boolean;
  apiJsonFilePath: string;
  docModelIncludeForgottenExports: boolean;
  projectFolderUrl: string | undefined;
  rollupEnabled: boolean;
  untrimmedFilePath: string;
  alphaTrimmedFilePath: string;
  betaTrimmedFilePath: string;
  publicTrimmedFilePath: string;
  omitTrimmingComments: boolean;
  tsdocMetadataEnabled: boolean;
  tsdocMetadataFilePath: string;
  tsdocConfigFile: TSDocConfigFile;
  tsdocConfiguration: TSDocConfiguration;
  newlineKind: NewlineKind;
  messages: IExtractorMessagesConfig;
  testMode: boolean;
  enumMemberOrder: EnumMemberOrder;
}

/**
 * The `ExtractorConfig` class loads, validates, interprets, and represents the api-extractor.json config file.
 * @public
 */
export class ExtractorConfig {
  /**
   * The JSON Schema for API Extractor config file (api-extractor.schema.json).
   */
  public static readonly jsonSchema: JsonSchema = JsonSchema.fromLoadedObject(apiExtractorSchema);

  /**
   * The config file name "api-extractor.json".
   */
  public static readonly FILENAME: 'api-extractor.json' = 'api-extractor.json';

  /**
   * The full path to `extends/tsdoc-base.json` which contains the standard TSDoc configuration
   * for API Extractor.
   * @internal
   */
  public static readonly _tsdocBaseFilePath: string = path.resolve(
    __dirname,
    '../../extends/tsdoc-base.json'
  );

  private static readonly _defaultConfig: Partial<IConfigFile> = JsonFile.load(
    path.join(__dirname, '../schemas/api-extractor-defaults.json')
  );

  private static readonly _declarationFileExtensionRegExp: RegExp = /\.d\.(c|m)?ts$/i;

  /** {@inheritDoc IConfigFile.projectFolder} */
  public readonly projectFolder: string;

  /**
   * The parsed package.json file for the working package, or undefined if API Extractor was invoked without
   * a package.json file.
   */
  public readonly packageJson: INodePackageJson | undefined;

  /**
   * The absolute path of the folder containing the package.json file for the working package, or undefined
   * if API Extractor was invoked without a package.json file.
   */
  public readonly packageFolder: string | undefined;

  /** {@inheritDoc IConfigFile.mainEntryPointFilePath} */
  public readonly mainEntryPointFilePath: string;

  /** {@inheritDoc IConfigFile.bundledPackages} */
  public readonly bundledPackages: string[];

  /** {@inheritDoc IConfigCompiler.tsconfigFilePath} */
  public readonly tsconfigFilePath: string;

  /** {@inheritDoc IConfigCompiler.overrideTsconfig} */
  public readonly overrideTsconfig: {} | undefined;

  /** {@inheritDoc IConfigCompiler.skipLibCheck} */
  public readonly skipLibCheck: boolean;

  /** {@inheritDoc IConfigApiReport.enabled} */
  public readonly apiReportEnabled: boolean;

  /** The `reportFolder` path combined with the `reportFileName`. */
  public readonly reportFilePath: string;
  /** The `reportTempFolder` path combined with the `reportFileName`. */
  public readonly reportTempFilePath: string;
  /** {@inheritDoc IConfigApiReport.includeForgottenExports} */
  public readonly apiReportIncludeForgottenExports: boolean;

  /** {@inheritDoc IConfigDocModel.enabled} */
  public readonly docModelEnabled: boolean;
  /** {@inheritDoc IConfigDocModel.apiJsonFilePath} */
  public readonly apiJsonFilePath: string;
  /** {@inheritDoc IConfigDocModel.includeForgottenExports} */
  public readonly docModelIncludeForgottenExports: boolean;
  /** {@inheritDoc IConfigDocModel.projectFolderUrl} */
  public readonly projectFolderUrl: string | undefined;

  /** {@inheritDoc IConfigDtsRollup.enabled} */
  public readonly rollupEnabled: boolean;
  /** {@inheritDoc IConfigDtsRollup.untrimmedFilePath} */
  public readonly untrimmedFilePath: string;
  /** {@inheritDoc IConfigDtsRollup.alphaTrimmedFilePath} */
  public readonly alphaTrimmedFilePath: string;
  /** {@inheritDoc IConfigDtsRollup.betaTrimmedFilePath} */
  public readonly betaTrimmedFilePath: string;
  /** {@inheritDoc IConfigDtsRollup.publicTrimmedFilePath} */
  public readonly publicTrimmedFilePath: string;
  /** {@inheritDoc IConfigDtsRollup.omitTrimmingComments} */
  public readonly omitTrimmingComments: boolean;

  /** {@inheritDoc IConfigTsdocMetadata.enabled} */
  public readonly tsdocMetadataEnabled: boolean;
  /** {@inheritDoc IConfigTsdocMetadata.tsdocMetadataFilePath} */
  public readonly tsdocMetadataFilePath: string;

  /**
   * The tsdoc.json configuration that will be used when parsing doc comments.
   */
  public readonly tsdocConfigFile: TSDocConfigFile;

  /**
   * The `TSDocConfiguration` loaded from {@link ExtractorConfig.tsdocConfigFile}.
   */
  public readonly tsdocConfiguration: TSDocConfiguration;

  /**
   * Specifies what type of newlines API Extractor should use when writing output files.  By default, the output files
   * will be written with Windows-style newlines.
   */
  public readonly newlineKind: NewlineKind;

  /** {@inheritDoc IConfigFile.messages} */
  public readonly messages: IExtractorMessagesConfig;

  /** {@inheritDoc IConfigFile.testMode} */
  public readonly testMode: boolean;

  /** {@inheritDoc IConfigFile.enumMemberOrder} */
  public readonly enumMemberOrder: EnumMemberOrder;

  private constructor(parameters: IExtractorConfigParameters) {
    this.projectFolder = parameters.projectFolder;
    this.packageJson = parameters.packageJson;
    this.packageFolder = parameters.packageFolder;
    this.mainEntryPointFilePath = parameters.mainEntryPointFilePath;
    this.bundledPackages = parameters.bundledPackages;
    this.tsconfigFilePath = parameters.tsconfigFilePath;
    this.overrideTsconfig = parameters.overrideTsconfig;
    this.skipLibCheck = parameters.skipLibCheck;
    this.apiReportEnabled = parameters.apiReportEnabled;
    this.reportFilePath = parameters.reportFilePath;
    this.reportTempFilePath = parameters.reportTempFilePath;
    this.apiReportIncludeForgottenExports = parameters.apiReportIncludeForgottenExports;
    this.docModelEnabled = parameters.docModelEnabled;
    this.apiJsonFilePath = parameters.apiJsonFilePath;
    this.docModelIncludeForgottenExports = parameters.docModelIncludeForgottenExports;
    this.projectFolderUrl = parameters.projectFolderUrl;
    this.rollupEnabled = parameters.rollupEnabled;
    this.untrimmedFilePath = parameters.untrimmedFilePath;
    this.alphaTrimmedFilePath = parameters.alphaTrimmedFilePath;
    this.betaTrimmedFilePath = parameters.betaTrimmedFilePath;
    this.publicTrimmedFilePath = parameters.publicTrimmedFilePath;
    this.omitTrimmingComments = parameters.omitTrimmingComments;
    this.tsdocMetadataEnabled = parameters.tsdocMetadataEnabled;
    this.tsdocMetadataFilePath = parameters.tsdocMetadataFilePath;
    this.tsdocConfigFile = parameters.tsdocConfigFile;
    this.tsdocConfiguration = parameters.tsdocConfiguration;
    this.newlineKind = parameters.newlineKind;
    this.messages = parameters.messages;
    this.testMode = parameters.testMode;
    this.enumMemberOrder = parameters.enumMemberOrder;
  }

  /**
   * Returns a JSON-like string representing the `ExtractorConfig` state, which can be printed to a console
   * for diagnostic purposes.
   *
   * @remarks
   * This is used by the "--diagnostics" command-line option.  The string is not intended to be deserialized;
   * its format may be changed at any time.
   */
  public getDiagnosticDump(): string {
    // Handle the simple JSON-serializable properties using buildJsonDumpObject()
    const result: object = MessageRouter.buildJsonDumpObject(this, {
      keyNamesToOmit: ['tsdocConfigFile', 'tsdocConfiguration']
    });

    // Implement custom formatting for tsdocConfigFile and tsdocConfiguration

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (result as any).tsdocConfigFile = {
      filePath: this.tsdocConfigFile.filePath,
      log: this.tsdocConfigFile.log.messages.map((x) => x.toString())
    };

    return JSON.stringify(result, undefined, 2);
  }

  /**
   * Returns a simplified file path for use in error messages.
   * @internal
   */
  public _getShortFilePath(absolutePath: string): string {
    if (!path.isAbsolute(absolutePath)) {
      throw new InternalError('Expected absolute path: ' + absolutePath);
    }
    if (Path.isUnderOrEqual(absolutePath, this.projectFolder)) {
      return Path.convertToSlashes(path.relative(this.projectFolder, absolutePath));
    }
    return absolutePath;
  }

  /**
   * Searches for the api-extractor.json config file associated with the specified starting folder,
   * and loads the file if found.  This lookup supports
   * {@link https://www.npmjs.com/package/@rushstack/rig-package | rig packages}.
   *
   * @remarks
   * The search will first look for a package.json file in a parent folder of the starting folder;
   * if found, that will be used as the base folder instead of the starting folder.  If the config
   * file is not found in `<baseFolder>/api-extractor.json` or `<baseFolder>/config/api-extractor.json`,
   * then `<baseFolder/config/rig.json` will be checked to see whether a
   * {@link https://www.npmjs.com/package/@rushstack/rig-package | rig package} is referenced; if so then
   * the rig's api-extractor.json file will be used instead.  If a config file is found, it will be loaded
   * and returned with the `IExtractorConfigPrepareOptions` object. Otherwise, `undefined` is returned
   * to indicate that API Extractor does not appear to be configured for the specified folder.
   *
   * @returns An options object that can be passed to {@link ExtractorConfig.prepare}, or `undefined`
   * if not api-extractor.json file was found.
   */
  public static tryLoadForFolder(
    options: IExtractorConfigLoadForFolderOptions
  ): IExtractorConfigPrepareOptions | undefined {
    const packageJsonLookup: PackageJsonLookup = options.packageJsonLookup || new PackageJsonLookup();
    const startingFolder: string = options.startingFolder;

    // Figure out which project we're in and look for the config file at the project root
    const packageJsonFullPath: string | undefined =
      packageJsonLookup.tryGetPackageJsonFilePathFor(startingFolder);
    const packageFolder: string | undefined = packageJsonFullPath
      ? path.dirname(packageJsonFullPath)
      : undefined;

    // If there is no package, then just use the starting folder
    const baseFolder: string = packageFolder || startingFolder;

    let projectFolderLookupToken: string | undefined = undefined;

    // First try the standard "config" subfolder:
    let configFilename: string = path.join(baseFolder, 'config', ExtractorConfig.FILENAME);
    if (FileSystem.exists(configFilename)) {
      if (FileSystem.exists(path.join(baseFolder, ExtractorConfig.FILENAME))) {
        throw new Error(`Found conflicting ${ExtractorConfig.FILENAME} files in "." and "./config" folders`);
      }
    } else {
      // Otherwise try the top-level folder
      configFilename = path.join(baseFolder, ExtractorConfig.FILENAME);

      if (!FileSystem.exists(configFilename)) {
        // If We didn't find it in <packageFolder>/api-extractor.json or <packageFolder>/config/api-extractor.json
        // then check for a rig package
        if (packageFolder) {
          let rigConfig: IRigConfig;
          if (options.rigConfig) {
            // The caller provided an already solved RigConfig.  Double-check that it is for the right project.
            if (!Path.isEqual(options.rigConfig.projectFolderPath, packageFolder)) {
              throw new Error(
                'The provided ILoadForFolderOptions.rigConfig is for the wrong project folder:\n' +
                  '\nExpected path: ' +
                  packageFolder +
                  '\nProvided path: ' +
                  options.rigConfig.projectFolderOriginalPath
              );
            }
            rigConfig = options.rigConfig;
          } else {
            rigConfig = RigConfig.loadForProjectFolder({
              projectFolderPath: packageFolder
            });
          }

          if (rigConfig.rigFound) {
            configFilename = path.join(rigConfig.getResolvedProfileFolder(), ExtractorConfig.FILENAME);

            // If the "projectFolder" setting isn't specified in api-extractor.json, it defaults to the
            // "<lookup>" token which will probe for the tsconfig.json nearest to the api-extractor.json path.
            // But this won't work if api-extractor.json belongs to the rig.  So instead "<lookup>" should be
            // the "<packageFolder>" that referenced the rig.
            projectFolderLookupToken = packageFolder;
          }
        }
        if (!FileSystem.exists(configFilename)) {
          // API Extractor does not seem to be configured for this folder
          return undefined;
        }
      }
    }

    const configObjectFullPath: string = path.resolve(configFilename);
    const configObject: IConfigFile = ExtractorConfig.loadFile(configObjectFullPath);

    return {
      configObject,
      configObjectFullPath,
      packageJsonFullPath,
      projectFolderLookupToken
    };
  }

  /**
   * Loads the api-extractor.json config file from the specified file path, and prepares an `ExtractorConfig` object.
   *
   * @remarks
   * Loads the api-extractor.json config file from the specified file path.   If the "extends" field is present,
   * the referenced file(s) will be merged.  For any omitted fields, the API Extractor default values are merged.
   *
   * The result is prepared using `ExtractorConfig.prepare()`.
   */
  public static loadFileAndPrepare(configJsonFilePath: string): ExtractorConfig {
    const configObjectFullPath: string = path.resolve(configJsonFilePath);
    const configObject: IConfigFile = ExtractorConfig.loadFile(configObjectFullPath);

    const packageJsonLookup: PackageJsonLookup = new PackageJsonLookup();
    const packageJsonFullPath: string | undefined =
      packageJsonLookup.tryGetPackageJsonFilePathFor(configObjectFullPath);

    const extractorConfig: ExtractorConfig = ExtractorConfig.prepare({
      configObject,
      configObjectFullPath,
      packageJsonFullPath
    });

    return extractorConfig;
  }

  /**
   * Performs only the first half of {@link ExtractorConfig.loadFileAndPrepare}, providing an opportunity to
   * modify the object before it is passed to {@link ExtractorConfig.prepare}.
   *
   * @remarks
   * Loads the api-extractor.json config file from the specified file path.   If the "extends" field is present,
   * the referenced file(s) will be merged.  For any omitted fields, the API Extractor default values are merged.
   */
  public static loadFile(jsonFilePath: string): IConfigFile {
    // Set to keep track of config files which have been processed.
    const visitedPaths: Set<string> = new Set<string>();

    let currentConfigFilePath: string = path.resolve(jsonFilePath);
    let configObject: Partial<IConfigFile> = {};

    try {
      do {
        // Check if this file was already processed.
        if (visitedPaths.has(currentConfigFilePath)) {
          throw new Error(
            `The API Extractor "extends" setting contains a cycle.` +
              `  This file is included twice: "${currentConfigFilePath}"`
          );
        }
        visitedPaths.add(currentConfigFilePath);

        const currentConfigFolderPath: string = path.dirname(currentConfigFilePath);

        // Load the extractor config defined in extends property.
        const baseConfig: IConfigFile = JsonFile.load(currentConfigFilePath);

        let extendsField: string = baseConfig.extends || '';

        // Delete the "extends" field so it doesn't get merged
        delete baseConfig.extends;

        if (extendsField) {
          if (extendsField.match(/^\.\.?[\\/]/)) {
            // EXAMPLE:  "./subfolder/api-extractor-base.json"
            extendsField = path.resolve(currentConfigFolderPath, extendsField);
          } else {
            // EXAMPLE:  "my-package/api-extractor-base.json"
            //
            // Resolve "my-package" from the perspective of the current folder.
            try {
              extendsField = resolve.sync(extendsField, {
                basedir: currentConfigFolderPath
              });
            } catch (e) {
              throw new Error(`Error resolving NodeJS path "${extendsField}": ${(e as Error).message}`);
            }
          }
        }

        // This step has to be performed in advance, since the currentConfigFolderPath information will be lost
        // after lodash.merge() is performed.
        ExtractorConfig._resolveConfigFileRelativePaths(baseConfig, currentConfigFolderPath);

        // Merge extractorConfig into baseConfig, mutating baseConfig
        lodash.merge(baseConfig, configObject);
        configObject = baseConfig;

        currentConfigFilePath = extendsField;
      } while (currentConfigFilePath);
    } catch (e) {
      throw new Error(`Error loading ${currentConfigFilePath}:\n` + (e as Error).message);
    }

    // Lastly, apply the defaults
    configObject = lodash.merge(lodash.cloneDeep(ExtractorConfig._defaultConfig), configObject);

    ExtractorConfig.jsonSchema.validateObject(configObject, jsonFilePath);

    // The schema validation should ensure that this object conforms to IConfigFile
    return configObject as IConfigFile;
  }

  private static _resolveConfigFileRelativePaths(
    configFile: IConfigFile,
    currentConfigFolderPath: string
  ): void {
    if (configFile.projectFolder) {
      configFile.projectFolder = ExtractorConfig._resolveConfigFileRelativePath(
        'projectFolder',
        configFile.projectFolder,
        currentConfigFolderPath
      );
    }

    if (configFile.mainEntryPointFilePath) {
      configFile.mainEntryPointFilePath = ExtractorConfig._resolveConfigFileRelativePath(
        'mainEntryPointFilePath',
        configFile.mainEntryPointFilePath,
        currentConfigFolderPath
      );
    }

    if (configFile.compiler) {
      if (configFile.compiler.tsconfigFilePath) {
        configFile.compiler.tsconfigFilePath = ExtractorConfig._resolveConfigFileRelativePath(
          'tsconfigFilePath',
          configFile.compiler.tsconfigFilePath,
          currentConfigFolderPath
        );
      }
    }

    if (configFile.apiReport) {
      if (configFile.apiReport.reportFolder) {
        configFile.apiReport.reportFolder = ExtractorConfig._resolveConfigFileRelativePath(
          'reportFolder',
          configFile.apiReport.reportFolder,
          currentConfigFolderPath
        );
      }
      if (configFile.apiReport.reportTempFolder) {
        configFile.apiReport.reportTempFolder = ExtractorConfig._resolveConfigFileRelativePath(
          'reportTempFolder',
          configFile.apiReport.reportTempFolder,
          currentConfigFolderPath
        );
      }
    }

    if (configFile.docModel) {
      if (configFile.docModel.apiJsonFilePath) {
        configFile.docModel.apiJsonFilePath = ExtractorConfig._resolveConfigFileRelativePath(
          'apiJsonFilePath',
          configFile.docModel.apiJsonFilePath,
          currentConfigFolderPath
        );
      }
    }

    if (configFile.dtsRollup) {
      if (configFile.dtsRollup.untrimmedFilePath) {
        configFile.dtsRollup.untrimmedFilePath = ExtractorConfig._resolveConfigFileRelativePath(
          'untrimmedFilePath',
          configFile.dtsRollup.untrimmedFilePath,
          currentConfigFolderPath
        );
      }
      if (configFile.dtsRollup.alphaTrimmedFilePath) {
        configFile.dtsRollup.alphaTrimmedFilePath = ExtractorConfig._resolveConfigFileRelativePath(
          'alphaTrimmedFilePath',
          configFile.dtsRollup.alphaTrimmedFilePath,
          currentConfigFolderPath
        );
      }
      if (configFile.dtsRollup.betaTrimmedFilePath) {
        configFile.dtsRollup.betaTrimmedFilePath = ExtractorConfig._resolveConfigFileRelativePath(
          'betaTrimmedFilePath',
          configFile.dtsRollup.betaTrimmedFilePath,
          currentConfigFolderPath
        );
      }
      if (configFile.dtsRollup.publicTrimmedFilePath) {
        configFile.dtsRollup.publicTrimmedFilePath = ExtractorConfig._resolveConfigFileRelativePath(
          'publicTrimmedFilePath',
          configFile.dtsRollup.publicTrimmedFilePath,
          currentConfigFolderPath
        );
      }
    }

    if (configFile.tsdocMetadata) {
      if (configFile.tsdocMetadata.tsdocMetadataFilePath) {
        configFile.tsdocMetadata.tsdocMetadataFilePath = ExtractorConfig._resolveConfigFileRelativePath(
          'tsdocMetadataFilePath',
          configFile.tsdocMetadata.tsdocMetadataFilePath,
          currentConfigFolderPath
        );
      }
    }
  }

  private static _resolveConfigFileRelativePath(
    fieldName: string,
    fieldValue: string,
    currentConfigFolderPath: string
  ): string {
    if (!path.isAbsolute(fieldValue)) {
      if (fieldValue.indexOf('<projectFolder>') !== 0) {
        // If the path is not absolute and does not start with "<projectFolder>", then resolve it relative
        // to the folder of the config file that it appears in
        return path.join(currentConfigFolderPath, fieldValue);
      }
    }

    return fieldValue;
  }

  /**
   * Prepares an `ExtractorConfig` object using a configuration that is provided as a runtime object,
   * rather than reading it from disk.  This allows configurations to be constructed programmatically,
   * loaded from an alternate source, and/or customized after loading.
   */
  public static prepare(options: IExtractorConfigPrepareOptions): ExtractorConfig {
    const filenameForErrors: string = options.configObjectFullPath || 'the configuration object';
    const configObject: Partial<IConfigFile> = options.configObject;

    if (configObject.extends) {
      throw new Error(
        'The IConfigFile.extends field must be expanded before calling ExtractorConfig.prepare()'
      );
    }

    if (options.configObjectFullPath) {
      if (!path.isAbsolute(options.configObjectFullPath)) {
        throw new Error('The "configObjectFullPath" setting must be an absolute path');
      }
    }

    ExtractorConfig.jsonSchema.validateObject(configObject, filenameForErrors);

    const packageJsonFullPath: string | undefined = options.packageJsonFullPath;
    let packageFolder: string | undefined = undefined;
    let packageJson: INodePackageJson | undefined = undefined;

    if (packageJsonFullPath) {
      if (!/.json$/i.test(packageJsonFullPath)) {
        // Catch common mistakes e.g. where someone passes a folder path instead of a file path
        throw new Error('The "packageJsonFullPath" setting does not have a .json file extension');
      }
      if (!path.isAbsolute(packageJsonFullPath)) {
        throw new Error('The "packageJsonFullPath" setting must be an absolute path');
      }

      if (options.packageJson) {
        packageJson = options.packageJson;
      } else {
        const packageJsonLookup: PackageJsonLookup = new PackageJsonLookup();
        packageJson = packageJsonLookup.loadNodePackageJson(packageJsonFullPath);
      }

      packageFolder = path.dirname(packageJsonFullPath);
    }

    // "tsdocConfigFile" and "tsdocConfiguration" are prepared outside the try-catch block,
    // so that if exceptions are thrown, it will not get the "Error parsing api-extractor.json:" header
    let extractorConfigParameters: Omit<IExtractorConfigParameters, 'tsdocConfigFile' | 'tsdocConfiguration'>;

    try {
      if (!configObject.compiler) {
        // A merged configuration should have this
        throw new Error('The "compiler" section is missing');
      }

      if (!configObject.projectFolder) {
        // A merged configuration should have this
        throw new Error('The "projectFolder" setting is missing');
      }

      let projectFolder: string;
      if (configObject.projectFolder.trim() === '<lookup>') {
        if (options.projectFolderLookupToken) {
          // Use the manually specified "<lookup>" value
          projectFolder = options.projectFolderLookupToken;

          if (!FileSystem.exists(options.projectFolderLookupToken)) {
            throw new Error(
              'The specified "projectFolderLookupToken" path does not exist: ' +
                options.projectFolderLookupToken
            );
          }
        } else {
          if (!options.configObjectFullPath) {
            throw new Error(
              'The "projectFolder" setting uses the "<lookup>" token, but it cannot be expanded because' +
                ' the "configObjectFullPath" setting was not specified'
            );
          }

          // "The default value for `projectFolder` is the token `<lookup>`, which means the folder is determined
          // by traversing parent folders, starting from the folder containing api-extractor.json, and stopping
          // at the first folder that contains a tsconfig.json file.  If a tsconfig.json file cannot be found in
          // this way, then an error will be reported."

          let currentFolder: string = path.dirname(options.configObjectFullPath);
          for (;;) {
            const tsconfigPath: string = path.join(currentFolder, 'tsconfig.json');
            if (FileSystem.exists(tsconfigPath)) {
              projectFolder = currentFolder;
              break;
            }
            const parentFolder: string = path.dirname(currentFolder);
            if (parentFolder === '' || parentFolder === currentFolder) {
              throw new Error(
                'The "projectFolder" setting uses the "<lookup>" token, but a tsconfig.json file cannot be' +
                  ' found in this folder or any parent folder.'
              );
            }
            currentFolder = parentFolder;
          }
        }
      } else {
        ExtractorConfig._rejectAnyTokensInPath(configObject.projectFolder, 'projectFolder');

        if (!FileSystem.exists(configObject.projectFolder)) {
          throw new Error('The specified "projectFolder" path does not exist: ' + configObject.projectFolder);
        }

        projectFolder = configObject.projectFolder;
      }

      const tokenContext: IExtractorConfigTokenContext = {
        unscopedPackageName: 'unknown-package',
        packageName: 'unknown-package',
        projectFolder: projectFolder
      };

      if (packageJson) {
        tokenContext.packageName = packageJson.name;
        tokenContext.unscopedPackageName = PackageName.getUnscopedName(packageJson.name);
      }

      if (!configObject.mainEntryPointFilePath) {
        // A merged configuration should have this
        throw new Error('The "mainEntryPointFilePath" setting is missing');
      }
      const mainEntryPointFilePath: string = ExtractorConfig._resolvePathWithTokens(
        'mainEntryPointFilePath',
        configObject.mainEntryPointFilePath,
        tokenContext
      );

      if (!ExtractorConfig.hasDtsFileExtension(mainEntryPointFilePath)) {
        throw new Error(
          'The "mainEntryPointFilePath" value is not a declaration file: ' + mainEntryPointFilePath
        );
      }

      if (!options.ignoreMissingEntryPoint && !FileSystem.exists(mainEntryPointFilePath)) {
        throw new Error('The "mainEntryPointFilePath" path does not exist: ' + mainEntryPointFilePath);
      }

      const bundledPackages: string[] = configObject.bundledPackages || [];
      for (const bundledPackage of bundledPackages) {
        if (!PackageName.isValidName(bundledPackage)) {
          throw new Error(`The "bundledPackages" list contains an invalid package name: "${bundledPackage}"`);
        }
      }

      const tsconfigFilePath: string = ExtractorConfig._resolvePathWithTokens(
        'tsconfigFilePath',
        configObject.compiler.tsconfigFilePath,
        tokenContext
      );

      if (configObject.compiler.overrideTsconfig === undefined) {
        if (!tsconfigFilePath) {
          throw new Error('Either the "tsconfigFilePath" or "overrideTsconfig" setting must be specified');
        }
        if (!FileSystem.exists(tsconfigFilePath)) {
          throw new Error('The file referenced by "tsconfigFilePath" does not exist: ' + tsconfigFilePath);
        }
      }

      let apiReportEnabled: boolean = false;
      let reportFilePath: string = '';
      let reportTempFilePath: string = '';
      let apiReportIncludeForgottenExports: boolean = false;
      if (configObject.apiReport) {
        apiReportEnabled = !!configObject.apiReport.enabled;

        const reportFilename: string = ExtractorConfig._expandStringWithTokens(
          'reportFileName',
          configObject.apiReport.reportFileName || '',
          tokenContext
        );

        if (!reportFilename) {
          // A merged configuration should have this
          throw new Error('The "reportFilename" setting is missing');
        }
        if (reportFilename.indexOf('/') >= 0 || reportFilename.indexOf('\\') >= 0) {
          // A merged configuration should have this
          throw new Error(`The "reportFilename" setting contains invalid characters: "${reportFilename}"`);
        }

        const reportFolder: string = ExtractorConfig._resolvePathWithTokens(
          'reportFolder',
          configObject.apiReport.reportFolder,
          tokenContext
        );
        const reportTempFolder: string = ExtractorConfig._resolvePathWithTokens(
          'reportTempFolder',
          configObject.apiReport.reportTempFolder,
          tokenContext
        );

        reportFilePath = path.join(reportFolder, reportFilename);
        reportTempFilePath = path.join(reportTempFolder, reportFilename);
        apiReportIncludeForgottenExports = !!configObject.apiReport.includeForgottenExports;
      }

      let docModelEnabled: boolean = false;
      let apiJsonFilePath: string = '';
      let docModelIncludeForgottenExports: boolean = false;
      let projectFolderUrl: string | undefined;
      if (configObject.docModel) {
        docModelEnabled = !!configObject.docModel.enabled;
        apiJsonFilePath = ExtractorConfig._resolvePathWithTokens(
          'apiJsonFilePath',
          configObject.docModel.apiJsonFilePath,
          tokenContext
        );
        docModelIncludeForgottenExports = !!configObject.docModel.includeForgottenExports;
        projectFolderUrl = configObject.docModel.projectFolderUrl;
      }

      let tsdocMetadataEnabled: boolean = false;
      let tsdocMetadataFilePath: string = '';
      if (configObject.tsdocMetadata) {
        tsdocMetadataEnabled = !!configObject.tsdocMetadata.enabled;

        if (tsdocMetadataEnabled) {
          tsdocMetadataFilePath = configObject.tsdocMetadata.tsdocMetadataFilePath || '';

          if (tsdocMetadataFilePath.trim() === '<lookup>') {
            if (!packageJson) {
              throw new Error(
                'The "<lookup>" token cannot be used with the "tsdocMetadataFilePath" setting because' +
                  ' the "packageJson" option was not provided'
              );
            }
            if (!packageJsonFullPath) {
              throw new Error(
                'The "<lookup>" token cannot be used with "tsdocMetadataFilePath" because' +
                  'the "packageJsonFullPath" option was not provided'
              );
            }
            tsdocMetadataFilePath = PackageMetadataManager.resolveTsdocMetadataPath(
              path.dirname(packageJsonFullPath),
              packageJson
            );
          } else {
            tsdocMetadataFilePath = ExtractorConfig._resolvePathWithTokens(
              'tsdocMetadataFilePath',
              configObject.tsdocMetadata.tsdocMetadataFilePath,
              tokenContext
            );
          }

          if (!tsdocMetadataFilePath) {
            throw new Error(
              'The "tsdocMetadata.enabled" setting is enabled,' +
                ' but "tsdocMetadataFilePath" is not specified'
            );
          }
        }
      }

      let rollupEnabled: boolean = false;
      let untrimmedFilePath: string = '';
      let betaTrimmedFilePath: string = '';
      let alphaTrimmedFilePath: string = '';
      let publicTrimmedFilePath: string = '';
      let omitTrimmingComments: boolean = false;

      if (configObject.dtsRollup) {
        rollupEnabled = !!configObject.dtsRollup.enabled;
        untrimmedFilePath = ExtractorConfig._resolvePathWithTokens(
          'untrimmedFilePath',
          configObject.dtsRollup.untrimmedFilePath,
          tokenContext
        );
        alphaTrimmedFilePath = ExtractorConfig._resolvePathWithTokens(
          'alphaTrimmedFilePath',
          configObject.dtsRollup.alphaTrimmedFilePath,
          tokenContext
        );
        betaTrimmedFilePath = ExtractorConfig._resolvePathWithTokens(
          'betaTrimmedFilePath',
          configObject.dtsRollup.betaTrimmedFilePath,
          tokenContext
        );
        publicTrimmedFilePath = ExtractorConfig._resolvePathWithTokens(
          'publicTrimmedFilePath',
          configObject.dtsRollup.publicTrimmedFilePath,
          tokenContext
        );
        omitTrimmingComments = !!configObject.dtsRollup.omitTrimmingComments;
      }

      let newlineKind: NewlineKind;
      switch (configObject.newlineKind) {
        case 'lf':
          newlineKind = NewlineKind.Lf;
          break;
        case 'os':
          newlineKind = NewlineKind.OsDefault;
          break;
        default:
          newlineKind = NewlineKind.CrLf;
          break;
      }

      const enumMemberOrder: EnumMemberOrder = configObject.enumMemberOrder ?? EnumMemberOrder.ByName;

      extractorConfigParameters = {
        projectFolder: projectFolder,
        packageJson,
        packageFolder,
        mainEntryPointFilePath,
        bundledPackages,
        tsconfigFilePath,
        overrideTsconfig: configObject.compiler.overrideTsconfig,
        skipLibCheck: !!configObject.compiler.skipLibCheck,
        apiReportEnabled,
        reportFilePath,
        reportTempFilePath,
        apiReportIncludeForgottenExports,
        docModelEnabled,
        apiJsonFilePath,
        docModelIncludeForgottenExports,
        projectFolderUrl,
        rollupEnabled,
        untrimmedFilePath,
        alphaTrimmedFilePath,
        betaTrimmedFilePath,
        publicTrimmedFilePath,
        omitTrimmingComments,
        tsdocMetadataEnabled,
        tsdocMetadataFilePath,
        newlineKind,
        messages: configObject.messages || {},
        testMode: !!configObject.testMode,
        enumMemberOrder
      };
    } catch (e) {
      throw new Error(`Error parsing ${filenameForErrors}:\n` + (e as Error).message);
    }

    let tsdocConfigFile: TSDocConfigFile | undefined = options.tsdocConfigFile;

    if (!tsdocConfigFile) {
      // Example: "my-project/tsdoc.json"
      let packageTSDocConfigPath: string = TSDocConfigFile.findConfigPathForFolder(
        extractorConfigParameters.projectFolder
      );

      if (!packageTSDocConfigPath || !FileSystem.exists(packageTSDocConfigPath)) {
        // If the project does not have a tsdoc.json config file, then use API Extractor's base file.
        packageTSDocConfigPath = ExtractorConfig._tsdocBaseFilePath;
        if (!FileSystem.exists(packageTSDocConfigPath)) {
          throw new InternalError('Unable to load the built-in TSDoc config file: ' + packageTSDocConfigPath);
        }
      }
      tsdocConfigFile = TSDocConfigFile.loadFile(packageTSDocConfigPath);
    }

    // IMPORTANT: After calling TSDocConfigFile.loadFile(), we need to check for errors.
    if (tsdocConfigFile.hasErrors) {
      throw new Error(tsdocConfigFile.getErrorSummary());
    }

    const tsdocConfiguration: TSDocConfiguration = new TSDocConfiguration();
    tsdocConfigFile.configureParser(tsdocConfiguration);

    // IMPORTANT: After calling TSDocConfigFile.configureParser(), we need to check for errors a second time.
    if (tsdocConfigFile.hasErrors) {
      throw new Error(tsdocConfigFile.getErrorSummary());
    }

    return new ExtractorConfig({ ...extractorConfigParameters, tsdocConfigFile, tsdocConfiguration });
  }

  private static _resolvePathWithTokens(
    fieldName: string,
    value: string | undefined,
    tokenContext: IExtractorConfigTokenContext
  ): string {
    value = ExtractorConfig._expandStringWithTokens(fieldName, value, tokenContext);
    if (value !== '') {
      value = path.resolve(tokenContext.projectFolder, value);
    }
    return value;
  }

  private static _expandStringWithTokens(
    fieldName: string,
    value: string | undefined,
    tokenContext: IExtractorConfigTokenContext
  ): string {
    value = value ? value.trim() : '';
    if (value !== '') {
      value = Text.replaceAll(value, '<unscopedPackageName>', tokenContext.unscopedPackageName);
      value = Text.replaceAll(value, '<packageName>', tokenContext.packageName);

      const projectFolderToken: string = '<projectFolder>';
      if (value.indexOf(projectFolderToken) === 0) {
        // Replace "<projectFolder>" at the start of a string
        value = path.join(tokenContext.projectFolder, value.substr(projectFolderToken.length));
      }

      if (value.indexOf(projectFolderToken) >= 0) {
        // If after all replacements, "<projectFolder>" appears somewhere in the string, report an error
        throw new Error(
          `The "${fieldName}" value incorrectly uses the "<projectFolder>" token.` +
            ` It must appear at the start of the string.`
        );
      }

      if (value.indexOf('<lookup>') >= 0) {
        throw new Error(`The "${fieldName}" value incorrectly uses the "<lookup>" token`);
      }
      ExtractorConfig._rejectAnyTokensInPath(value, fieldName);
    }
    return value;
  }

  /**
   * Returns true if the specified file path has the ".d.ts" file extension.
   */
  public static hasDtsFileExtension(filePath: string): boolean {
    return ExtractorConfig._declarationFileExtensionRegExp.test(filePath);
  }

  /**
   * Given a path string that may have originally contained expandable tokens such as `<projectFolder>"`
   * this reports an error if any token-looking substrings remain after expansion (e.g. `c:\blah\<invalid>\blah`).
   */
  private static _rejectAnyTokensInPath(value: string, fieldName: string): void {
    if (value.indexOf('<') < 0 && value.indexOf('>') < 0) {
      return;
    }

    // Can we determine the name of a token?
    const tokenRegExp: RegExp = /(\<[^<]*?\>)/;
    const match: RegExpExecArray | null = tokenRegExp.exec(value);
    if (match) {
      throw new Error(`The "${fieldName}" value contains an unrecognized token "${match[1]}"`);
    }
    throw new Error(`The "${fieldName}" value contains extra token characters ("<" or ">"): ${value}`);
  }
}
