// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.
/* eslint-disable sonarjs/no-nested-switch */
import path from 'node:path';
import {
	type PackageJsonLookup,
	FileSystem,
	JsonFile,
	type NewlineKind,
	type INodePackageJson,
	type JsonObject,
	type IPackageJsonExports,
} from '@rushstack/node-core-library';
import semver from 'semver';
import { ConsoleMessageId } from '../api/ConsoleMessageId.js';
import { Extractor } from '../api/Extractor.js';
import type { MessageRouter } from '../collector/MessageRouter.js';

/**
 * Represents analyzed information for a package.json file.
 * This object is constructed and returned by PackageMetadataManager.
 */
export class PackageMetadata {
	/**
	 * The absolute path to the package.json file being analyzed.
	 */
	public readonly packageJsonPath: string;

	/**
	 * The parsed contents of package.json.  Note that PackageJsonLookup
	 * only includes essential fields.
	 */
	public readonly packageJson: INodePackageJson;

	/**
	 * If true, then the package's documentation comments can be assumed
	 * to contain API Extractor compatible TSDoc tags.
	 */
	public readonly aedocSupported: boolean;

	public constructor(packageJsonPath: string, packageJson: INodePackageJson, aedocSupported: boolean) {
		this.packageJsonPath = packageJsonPath;
		this.packageJson = packageJson;
		this.aedocSupported = aedocSupported;
	}
}

const TSDOC_METADATA_FILENAME = 'tsdoc-metadata.json' as const;

/**
 * 1. If package.json a `"tsdocMetadata": "./path1/path2/tsdoc-metadata.json"` field
 * then that takes precedence. This convention will be rarely needed, since the other rules below generally
 * produce a good result.
 */
function _tryResolveTsdocMetadataFromTsdocMetadataField({ tsdocMetadata }: INodePackageJson): string | undefined {
	return tsdocMetadata;
}

/**
 * 2. If package.json contains a `"exports": { ".": { "types": "./path1/path2/index.d.ts" } }` field,
 * then we look for the file under "./path1/path2/tsdoc-metadata.json"
 *
 * This always looks for a "." and then a "*" entry in the exports field, and then evaluates for
 * a "types" field in that entry.
 */

function _tryResolveTsdocMetadataFromExportsField({ exports }: INodePackageJson): string | undefined {
	switch (typeof exports) {
		case 'string': {
			return `${path.dirname(exports)}/${TSDOC_METADATA_FILENAME}`;
		}

		case 'object': {
			if (Array.isArray(exports)) {
				const [firstExport] = exports;
				// Take the first entry in the array
				if (firstExport) {
					return `${path.dirname(firstExport)}/${TSDOC_METADATA_FILENAME}`;
				}
			} else {
				const rootExport: IPackageJsonExports | string | null | undefined = exports['.'] ?? exports['*'];
				switch (typeof rootExport) {
					case 'string': {
						return `${path.dirname(rootExport)}/${TSDOC_METADATA_FILENAME}`;
					}

					case 'object': {
						let typesExport: IPackageJsonExports | string | undefined = rootExport?.types;
						while (typesExport) {
							switch (typeof typesExport) {
								case 'string': {
									return `${path.dirname(typesExport)}/${TSDOC_METADATA_FILENAME}`;
								}

								case 'object': {
									typesExport = typesExport?.types;
									break;
								}
							}
						}
					}
				}
			}

			break;
		}
	}

	return undefined;
}

/**
 * 3. If package.json contains a `typesVersions` field, look for the version
 * matching the highest minimum version that either includes a "." or "*" entry.
 */
function _tryResolveTsdocMetadataFromTypesVersionsField({ typesVersions }: INodePackageJson): string | undefined {
	if (typesVersions) {
		let highestMinimumMatchingSemver: semver.SemVer | undefined;
		let latestMatchingPath: string | undefined;
		for (const [version, paths] of Object.entries(typesVersions)) {
			let range: semver.Range;
			try {
				range = new semver.Range(version);
			} catch {
				continue;
			}

			const minimumMatchingSemver: semver.SemVer | null = semver.minVersion(range);
			if (
				minimumMatchingSemver &&
				(!highestMinimumMatchingSemver || semver.gt(minimumMatchingSemver, highestMinimumMatchingSemver))
			) {
				const pathEntry: string[] | undefined = paths['.'] ?? paths['*'];
				const firstPath: string | undefined = pathEntry?.[0];
				if (firstPath) {
					highestMinimumMatchingSemver = minimumMatchingSemver;
					latestMatchingPath = firstPath;
				}
			}
		}

		if (latestMatchingPath) {
			return `${path.dirname(latestMatchingPath)}/${TSDOC_METADATA_FILENAME}`;
		}
	}

	return undefined;
}

/**
 * 4. If package.json contains a `"types": "./path1/path2/index.d.ts"` or a `"typings": "./path1/path2/index.d.ts"`
 * field, then we look for the file under "./path1/path2/tsdoc-metadata.json".
 *
 * @remarks
 * `types` takes precedence over `typings`.
 */
function _tryResolveTsdocMetadataFromTypesOrTypingsFields({ typings, types }: INodePackageJson): string | undefined {
	const typesField: string | undefined = types ?? typings;
	if (typesField) {
		return `${path.dirname(typesField)}/${TSDOC_METADATA_FILENAME}`;
	}

	return undefined;
}

/**
 * 5. If package.json contains a `"main": "./path1/path2/index.js"` field, then we look for the file under
 * "./path1/path2/tsdoc-metadata.json".
 */
function _tryResolveTsdocMetadataFromMainField({ main }: INodePackageJson): string | undefined {
	if (main) {
		return `${path.dirname(main)}/${TSDOC_METADATA_FILENAME}`;
	}

	return undefined;
}

/**
 * This class maintains a cache of analyzed information obtained from package.json
 * files.  It is built on top of the PackageJsonLookup class.
 *
 * @remarks
 *
 * IMPORTANT: Don't use PackageMetadataManager to analyze source files from the current project:
 * 1. Files such as tsdoc-metadata.json may not have been built yet, and thus may contain incorrect information.
 * 2. The current project is not guaranteed to have a package.json file at all.  For example, API Extractor can
 *    be invoked on a bare .d.ts file.
 *
 * Use ts.program.isSourceFileFromExternalLibrary() to test source files before passing the to PackageMetadataManager.
 */
export class PackageMetadataManager {
	public static tsdocMetadataFilename: string = TSDOC_METADATA_FILENAME;

	private readonly _packageJsonLookup: PackageJsonLookup;

	private readonly _messageRouter: MessageRouter;

	private readonly _packageMetadataByPackageJsonPath: Map<string, PackageMetadata> = new Map<string, PackageMetadata>();

	public constructor(packageJsonLookup: PackageJsonLookup, messageRouter: MessageRouter) {
		this._packageJsonLookup = packageJsonLookup;
		this._messageRouter = messageRouter;
	}

	/**
	 * This feature is still being standardized: https://github.com/microsoft/tsdoc/issues/7
	 * In the future we will use the \@microsoft/tsdoc library to read this file.
	 */
	private static _resolveTsdocMetadataPathFromPackageJson(
		packageFolder: string,
		packageJson: INodePackageJson,
	): string {
		const tsdocMetadataRelativePath: string =
			_tryResolveTsdocMetadataFromTsdocMetadataField(packageJson) ??
			_tryResolveTsdocMetadataFromExportsField(packageJson) ??
			_tryResolveTsdocMetadataFromTypesVersionsField(packageJson) ??
			_tryResolveTsdocMetadataFromTypesOrTypingsFields(packageJson) ??
			_tryResolveTsdocMetadataFromMainField(packageJson) ??
			// As a final fallback, place the file in the root of the package.
			TSDOC_METADATA_FILENAME;

		// Always resolve relative to the package folder.
		const tsdocMetadataPath: string = path.resolve(
			packageFolder,
			// This non-null assertion is safe because the last entry in TSDOC_METADATA_RESOLUTION_FUNCTIONS
			// returns a non-undefined value.
			tsdocMetadataRelativePath!,
		);
		return tsdocMetadataPath;
	}

	/**
	 * @param packageFolder - The package folder
	 * @param packageJson - The package JSON
	 * @param tsdocMetadataPath - An explicit path that can be configured in api-extractor.json.
	 * If this parameter is not an empty string, it overrides the normal path calculation.
	 * @returns the absolute path to the TSDoc metadata file
	 */
	public static resolveTsdocMetadataPath(
		packageFolder: string,
		packageJson: INodePackageJson,
		tsdocMetadataPath?: string,
	): string {
		if (tsdocMetadataPath) {
			return path.resolve(packageFolder, tsdocMetadataPath);
		}

		return PackageMetadataManager._resolveTsdocMetadataPathFromPackageJson(packageFolder, packageJson);
	}

	/**
	 * Writes the TSDoc metadata file to the specified output file.
	 */
	public static writeTsdocMetadataFile(tsdocMetadataPath: string, newlineKind: NewlineKind): void {
		const fileObject: JsonObject = {
			tsdocVersion: '0.12',
			toolPackages: [
				{
					packageName: '@discordjs/api-extractor',
					packageVersion: Extractor.version,
				},
			],
		};

		const fileContent: string =
			'// This file is read by tools that parse documentation comments conforming to the TSDoc standard.\n' +
			'// It should be published with your NPM package.  It should not be tracked by Git.\n' +
			JsonFile.stringify(fileObject);

		FileSystem.writeFile(tsdocMetadataPath, fileContent, {
			convertLineEndings: newlineKind,
			ensureFolderExists: true,
		});
	}

	/**
	 * Finds the package.json in a parent folder of the specified source file, and
	 * returns a PackageMetadata object.  If no package.json was found, then undefined
	 * is returned.  The results are cached.
	 */
	public tryFetchPackageMetadata(sourceFilePath: string): PackageMetadata | undefined {
		const packageJsonFilePath: string | undefined =
			this._packageJsonLookup.tryGetPackageJsonFilePathFor(sourceFilePath);
		if (!packageJsonFilePath) {
			return undefined;
		}

		let packageMetadata: PackageMetadata | undefined = this._packageMetadataByPackageJsonPath.get(packageJsonFilePath);

		if (!packageMetadata) {
			const packageJson: INodePackageJson = this._packageJsonLookup.loadNodePackageJson(packageJsonFilePath);

			const packageJsonFolder: string = path.dirname(packageJsonFilePath);

			let aedocSupported = false;

			const tsdocMetadataPath: string = PackageMetadataManager._resolveTsdocMetadataPathFromPackageJson(
				packageJsonFolder,
				packageJson,
			);

			if (FileSystem.exists(tsdocMetadataPath)) {
				this._messageRouter.logVerbose(ConsoleMessageId.FoundTSDocMetadata, 'Found metadata in ' + tsdocMetadataPath);
				// If the file exists at all, assume it was written by API Extractor
				aedocSupported = true;
			}

			packageMetadata = new PackageMetadata(packageJsonFilePath, packageJson, aedocSupported);
			this._packageMetadataByPackageJsonPath.set(packageJsonFilePath, packageMetadata);
		}

		return packageMetadata;
	}

	/**
	 * Returns true if the source file is part of a package whose .d.ts files support AEDoc annotations.
	 */
	public isAedocSupportedFor(sourceFilePath: string): boolean {
		const packageMetadata: PackageMetadata | undefined = this.tryFetchPackageMetadata(sourceFilePath);
		if (!packageMetadata) {
			return false;
		}

		return packageMetadata.aedocSupported;
	}
}
