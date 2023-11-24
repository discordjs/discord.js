// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { Buffer } from 'node:buffer';
import path from 'node:path';
import util from 'node:util';
import { TSDocConfiguration } from '@microsoft/tsdoc';
import { DeclarationReference } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import { TSDocConfigFile } from '@microsoft/tsdoc-config';
import {
	JsonFile,
	type IJsonFileSaveOptions,
	PackageJsonLookup,
	type IPackageJson,
	type JsonObject,
	FileSystem,
} from '@rushstack/node-core-library';
import { ApiDocumentedItem, type IApiDocumentedItemOptions } from '../items/ApiDocumentedItem.js';
import { ApiItem, ApiItemKind, type IApiItemJson } from '../items/ApiItem.js';
import { ApiItemContainerMixin, type IApiItemContainerMixinOptions } from '../mixins/ApiItemContainerMixin.js';
import { type IApiNameMixinOptions, ApiNameMixin } from '../mixins/ApiNameMixin.js';
import type { ApiEntryPoint } from './ApiEntryPoint.js';
import { DeserializerContext, ApiJsonSchemaVersion } from './DeserializerContext.js';

/**
 * Constructor options for {@link ApiPackage}.
 *
 * @public
 */
export interface IApiPackageOptions
	extends IApiItemContainerMixinOptions,
		IApiNameMixinOptions,
		IApiDocumentedItemOptions {
	dependencies?: Record<string, string> | undefined;
	projectFolderUrl?: string | undefined;
	tsdocConfiguration: TSDocConfiguration;
}

const MinifyJSONMapping = {
	canonicalReference: 'c',
	constraintTokenRange: 'ctr',
	dependencies: 'dp',
	defaultTypeTokenRange: 'dtr',
	docComment: 'd',
	endIndex: 'en',
	excerptTokens: 'ex',
	extendsTokenRange: 'etr',
	extendsTokenRanges: 'etrs',
	fileColumn: 'co',
	fileLine: 'l',
	fileUrlPath: 'pat',
	implementsTokenRanges: 'itrs',
	initializerTokenRange: 'itr',
	isAbstract: 'ab',
	isOptional: 'op',
	isProtected: 'pr',
	isReadonly: 'ro',
	isRest: 'rs',
	isStatic: 'sta',
	kind: 'k',
	members: 'ms',
	metadata: 'meta',
	name: 'n',
	oldestForwardsCompatibleVersion: 'ov',
	overloadIndex: 'oi',
	parameterName: 'pn',
	parameterTypeTokenRange: 'ptr',
	parameters: 'ps',
	preserveMemberOrder: 'pmo',
	projectFolderUrl: 'pdir',
	propertyTypeTokenRange: 'prtr',
	releaseTag: 'r',
	returnTypeTokenRange: 'rtr',
	schemaVersion: 'v',
	startIndex: 'st',
	text: 't',
	toolPackage: 'tpk',
	toolVersion: 'tv',
	tsdocConfig: 'ts',
	typeParameterName: 'tp',
	typeParameters: 'tps',
	typeTokenRange: 'ttr',
	variableTypeTokenRange: 'vtr',
};

export interface IApiPackageMetadataJson {
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
	 * The schema version for the .api.json file format.  Used for determining whether the file format is
	 * supported, and for backwards compatibility.
	 */
	schemaVersion: ApiJsonSchemaVersion;

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
	 * The TSDoc configuration that was used when analyzing the API for this package.
	 *
	 * @remarks
	 *
	 * The structure of this objet is defined by the `@microsoft/tsdoc-config` library.
	 * Normally this configuration is loaded from the project's tsdoc.json file.  It is stored
	 * in the .api.json file so that doc comments can be parsed accurately when loading the file.
	 */
	tsdocConfig?: JsonObject;
}

export interface IApiPackageJson extends IApiItemJson {
	/**
	 * Names of packages in the same monorepo this one uses mapped to the version of said package.
	 */
	dependencies?: Record<string, string>;

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
 *
 * @public
 */
export interface IApiPackageSaveOptions extends IJsonFileSaveOptions {
	/**
	 * Set to true to not have indentation or newlines in resulting JSON.
	 */
	minify?: boolean;

	/**
	 * Set to true only when invoking API Extractor's test harness.
	 *
	 * @remarks
	 * When `testMode` is true, the `toolVersion` field in the .api.json file is assigned an empty string
	 * to prevent spurious diffs in output files tracked for tests.
	 */
	testMode?: boolean;

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
}

/**
 * Represents an NPM package containing API declarations.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 * @public
 */
export class ApiPackage extends ApiItemContainerMixin(ApiNameMixin(ApiDocumentedItem)) {
	private readonly _tsdocConfiguration: TSDocConfiguration;

	private readonly _projectFolderUrl?: string | undefined;

	private readonly _dependencies?: Record<string, string> | undefined;

	public constructor(options: IApiPackageOptions) {
		super(options);

		this._tsdocConfiguration = options.tsdocConfiguration;
		this._projectFolderUrl = options.projectFolderUrl;

		if (options.dependencies) {
			this._dependencies = options.dependencies;
		} else {
			const packageJson = PackageJsonLookup.instance.tryLoadPackageJsonFor('.');
			if (packageJson?.dependencies) {
				this._dependencies = {};
				for (const [pack, semVer] of Object.entries(packageJson.dependencies)) {
					const pathToPackage = path.join('..', pack.includes('/') ? pack.slice(pack.lastIndexOf('/')) : pack);
					if (semVer === 'workspace:^') {
						this._dependencies[pack] =
							PackageJsonLookup.instance.tryLoadPackageJsonFor(pathToPackage)?.version ?? 'unknown';
					} else if (FileSystem.exists(pathToPackage)) {
						this._dependencies[pack] = semVer;
					}
				}
			}
		}
	}

	/**
	 * @override
	 */
	public static override onDeserializeInto(
		options: Partial<IApiPackageOptions>,
		context: DeserializerContext,
		jsonObject: IApiPackageJson,
	): void {
		super.onDeserializeInto(options, context, jsonObject);

		options.projectFolderUrl = jsonObject.projectFolderUrl;
		options.dependencies = jsonObject.dependencies;
	}

	public static loadFromJsonFile(apiJsonFilename: string): ApiPackage {
		return this.loadFromJson(JsonFile.load(apiJsonFilename), apiJsonFilename);
	}

	public static loadFromJson(rawJson: any, apiJsonFilename: string = ''): ApiPackage {
		const jsonObject =
			MinifyJSONMapping.metadata in rawJson ? this._mapFromMinified(rawJson) : (rawJson as IApiPackageJson);
		if (!jsonObject?.metadata) throw new Error(util.inspect(rawJson, { depth: 2 }));
		if (!jsonObject?.metadata || typeof jsonObject.metadata.schemaVersion !== 'number') {
			throw new Error(
				`Error loading ${apiJsonFilename}:` +
					`\nThe file format is not recognized; the "metadata.schemaVersion" field is missing or invalid`,
			);
		}

		const schemaVersion: number = jsonObject.metadata.schemaVersion;

		if (schemaVersion < ApiJsonSchemaVersion.OLDEST_SUPPORTED) {
			throw new Error(
				`Error loading ${apiJsonFilename}:` +
					`\nThe file format is version ${schemaVersion},` +
					` whereas ${ApiJsonSchemaVersion.OLDEST_SUPPORTED} is the oldest version supported by this tool`,
			);
		}

		let oldestForwardsCompatibleVersion: number = schemaVersion;
		if (jsonObject.metadata.oldestForwardsCompatibleVersion) {
			// Sanity check
			if (jsonObject.metadata.oldestForwardsCompatibleVersion > schemaVersion) {
				throw new Error(
					`Error loading ${apiJsonFilename}:` +
						`\nInvalid file format; "oldestForwardsCompatibleVersion" cannot be newer than "schemaVersion"`,
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
						` the api-extractor-model library; you may need to upgrade your software`,
				);
			}
		}

		const tsdocConfiguration: TSDocConfiguration = new TSDocConfiguration();

		if (versionToDeserialize >= ApiJsonSchemaVersion.V_1004 && 'tsdocConfiguration' in jsonObject) {
			const tsdocConfigFile: TSDocConfigFile = TSDocConfigFile.loadFromObject(jsonObject.metadata.tsdocConfig);
			if (tsdocConfigFile.hasErrors) {
				throw new Error(`Error loading ${apiJsonFilename}:\n` + tsdocConfigFile.getErrorSummary());
			}

			tsdocConfigFile.configureParser(tsdocConfiguration);
		}

		const context: DeserializerContext = new DeserializerContext({
			apiJsonFilename,
			toolPackage: jsonObject.metadata.toolPackage,
			toolVersion: jsonObject.metadata.toolVersion,
			versionToDeserialize,
			tsdocConfiguration,
		});

		return ApiItem.deserialize(jsonObject, context) as ApiPackage;
	}

	/**
	 * @override
	 */
	public override get kind(): ApiItemKind {
		return ApiItemKind.Package;
	}

	/**
	 * @override
	 */
	public override get containerKey(): string {
		// No prefix needed, because ApiPackage is the only possible member of an ApiModel
		return this.name;
	}

	public get entryPoints(): readonly ApiEntryPoint[] {
		return this.members as readonly ApiEntryPoint[];
	}

	public get dependencies(): Record<string, string> | undefined {
		return this._dependencies;
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

	/**
	 * @override
	 */
	public override addMember(member: ApiEntryPoint): void {
		if (member.kind !== ApiItemKind.EntryPoint) {
			throw new Error('Only items of type ApiEntryPoint may be added to an ApiPackage');
		}

		super.addMember(member);
	}

	public findEntryPointsByPath(importPath: string): readonly ApiEntryPoint[] {
		return this.findMembersByName(importPath) as readonly ApiEntryPoint[];
	}

	public saveToJsonFile(apiJsonFilename: string, options?: IApiPackageSaveOptions): void {
		const ioptions = options ?? {};

		const packageJson: IPackageJson = PackageJsonLookup.loadOwnPackageJson(__dirname);

		const tsdocConfigFile: TSDocConfigFile = TSDocConfigFile.loadFromParser(this.tsdocConfiguration);
		const tsdocConfig: JsonObject = tsdocConfigFile.saveToObject();

		const jsonObject: IApiPackageJson = {
			metadata: {
				toolPackage: ioptions.toolPackage ?? packageJson.name,
				// In test mode, we don't write the real version, since that would cause spurious diffs whenever
				// the version is bumped.  Instead we write a placeholder string.
				toolVersion: ioptions.testMode ? '[test mode]' : ioptions.toolVersion ?? packageJson.version,
				schemaVersion: ApiJsonSchemaVersion.LATEST,
				oldestForwardsCompatibleVersion: ApiJsonSchemaVersion.OLDEST_FORWARDS_COMPATIBLE,
				tsdocConfig,
			},
		} as IApiPackageJson;

		if (this.projectFolderUrl) {
			jsonObject.projectFolderUrl = this.projectFolderUrl;
		}

		if (this._dependencies) {
			jsonObject.dependencies = this._dependencies;
		}

		this.serializeInto(jsonObject);
		if (ioptions.minify) {
			FileSystem.writeFile(apiJsonFilename, Buffer.from(JSON.stringify(this._mapToMinified(jsonObject)), 'utf8'), {
				ensureFolderExists: ioptions.ensureFolderExists ?? true,
			});
		} else {
			JsonFile.save(jsonObject, apiJsonFilename, ioptions);
		}
	}

	/**
	 * @beta @override
	 */
	public override buildCanonicalReference(): DeclarationReference {
		return DeclarationReference.package(this.name);
	}

	private _mapToMinified(jsonObject: IApiPackageJson) {
		const mapper = (item: any): any => {
			if (Array.isArray(item)) return item.map(mapper);
			else {
				const result: any = {};
				for (const key of Object.keys(item)) {
					if (key === 'dependencies') {
						result[MinifyJSONMapping.dependencies] = item.dependencies;
					} else
						result[MinifyJSONMapping[key as keyof typeof MinifyJSONMapping]] =
							typeof item[key] === 'object' ? mapper(item[key]) : item[key];
				}

				return result;
			}
		};

		return mapper(jsonObject);
	}

	private static _mapFromMinified(jsonObject: any): IApiPackageJson {
		const mapper = (item: any): any => {
			if (Array.isArray(item)) return item.map(mapper);
			else {
				const result: any = {};
				for (const key of Object.keys(item)) {
					if (key === MinifyJSONMapping.dependencies) {
						result.dependencies = item[MinifyJSONMapping.dependencies];
					} else
						result[
							Object.keys(MinifyJSONMapping).find(
								(look) => MinifyJSONMapping[look as keyof typeof MinifyJSONMapping] === key,
							)!
						] = typeof item[key] === 'object' ? mapper(item[key]) : item[key];
				}

				return result;
			}
		};

		return mapper(jsonObject) as IApiPackageJson;
	}
}
