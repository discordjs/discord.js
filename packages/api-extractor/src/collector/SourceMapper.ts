// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as path from 'node:path';
import { FileSystem, InternalError, JsonFile, NewlineKind } from '@rushstack/node-core-library';
import { SourceMapConsumer, type RawSourceMap, type MappingItem, type Position } from 'source-map';
import type ts from 'typescript';

interface ISourceMap {
	// SourceMapConsumer.originalPositionFor() is useless because the mapping contains numerous gaps,
	// and the API provides no way to find the nearest match.  So instead we extract all the mapping items
	// and search them using SourceMapper._findNearestMappingItem().
	mappingItems: MappingItem[];

	sourceMapConsumer: SourceMapConsumer;
}

interface IOriginalFileInfo {
	// Whether the .ts file exists
	fileExists: boolean;

	// This is used to check whether the guessed position is out of bounds.
	// Since column/line numbers are 1-based, the 0th item in this array is unused.
	maxColumnForLine: number[];
}

export interface ISourceLocation {
	/**
	 * The column number in the source file. The first column number is 1.
	 */
	sourceFileColumn: number;

	/**
	 * The line number in the source file. The first line number is 1.
	 */
	sourceFileLine: number;

	/**
	 * The absolute path to the source file.
	 */
	sourceFilePath: string;
}

export interface IGetSourceLocationOptions {
	/**
	 * The position within the source file to get the source location from.
	 */
	pos: number;

	/**
	 * The source file to get the source location from.
	 */
	sourceFile: ts.SourceFile;

	/**
	 * If `false` or not provided, then we attempt to follow source maps in order to resolve the
	 * location to the original `.ts` file. If resolution isn't possible for some reason, we fall
	 * back to the `.d.ts` location.
	 *
	 * If `true`, then we don't bother following source maps, and the location refers to the `.d.ts`
	 * location.
	 */
	useDtsLocation?: boolean;
}

export class SourceMapper {
	// Map from .d.ts file path --> ISourceMap if a source map was found, or null if not found
	private _sourceMapByFilePath: Map<string, ISourceMap | null> = new Map<string, ISourceMap | null>();

	// Cache the FileSystem.exists() result for mapped .ts files
	private _originalFileInfoByPath: Map<string, IOriginalFileInfo> = new Map<string, IOriginalFileInfo>();

	/**
	 * Given a `.d.ts` source file and a specific position within the file, return the corresponding
	 * `ISourceLocation`.
	 */
	public getSourceLocation(options: IGetSourceLocationOptions): ISourceLocation {
		const lineAndCharacter: ts.LineAndCharacter = options.sourceFile.getLineAndCharacterOfPosition(options.pos);
		const sourceLocation: ISourceLocation = {
			sourceFilePath: options.sourceFile.fileName,
			sourceFileLine: lineAndCharacter.line + 1,
			sourceFileColumn: lineAndCharacter.character + 1,
		};

		if (options.useDtsLocation) {
			return sourceLocation;
		}

		const mappedSourceLocation: ISourceLocation | undefined = this._getMappedSourceLocation(sourceLocation);
		return mappedSourceLocation ?? sourceLocation;
	}

	private _getMappedSourceLocation(sourceLocation: ISourceLocation): ISourceLocation | undefined {
		const { sourceFilePath, sourceFileLine, sourceFileColumn } = sourceLocation;

		if (!FileSystem.exists(sourceFilePath)) {
			// Sanity check
			throw new InternalError('The referenced path was not found: ' + sourceFilePath);
		}

		const sourceMap: ISourceMap | null = this._getSourceMap(sourceFilePath);
		if (!sourceMap) return;

		const nearestMappingItem: MappingItem | undefined = SourceMapper._findNearestMappingItem(sourceMap.mappingItems, {
			line: sourceFileLine,
			column: sourceFileColumn,
		});

		if (!nearestMappingItem) return;

		const mappedFilePath: string = path.resolve(path.dirname(sourceFilePath), nearestMappingItem.source);

		// Does the mapped filename exist?  Use a cache to remember the answer.
		let originalFileInfo: IOriginalFileInfo | undefined = this._originalFileInfoByPath.get(mappedFilePath);
		if (originalFileInfo === undefined) {
			originalFileInfo = {
				fileExists: FileSystem.exists(mappedFilePath),
				maxColumnForLine: [],
			};

			if (originalFileInfo.fileExists) {
				// Read the file and measure the length of each line
				originalFileInfo.maxColumnForLine = FileSystem.readFile(mappedFilePath, {
					convertLineEndings: NewlineKind.Lf,
				})
					.split('\n')
					.map((x) => x.length + 1); // +1 since columns are 1-based
				originalFileInfo.maxColumnForLine.unshift(0); // Extra item since lines are 1-based
			}

			this._originalFileInfoByPath.set(mappedFilePath, originalFileInfo);
		}

		// Don't translate coordinates to a file that doesn't exist
		if (!originalFileInfo.fileExists) return;

		// The nearestMappingItem anchor may be above/left of the real position, due to gaps in the mapping.  Calculate
		// the delta and apply it to the original position.
		const guessedPosition: Position = {
			line: nearestMappingItem.originalLine + sourceFileLine - nearestMappingItem.generatedLine,
			column: nearestMappingItem.originalColumn + sourceFileColumn - nearestMappingItem.generatedColumn,
		};

		// Verify that the result is not out of bounds, in cause our heuristic failed
		if (
			guessedPosition.line >= 1 &&
			guessedPosition.line < originalFileInfo.maxColumnForLine.length &&
			guessedPosition.column >= 1 &&
			guessedPosition.column <= originalFileInfo.maxColumnForLine[guessedPosition.line]!
		) {
			return {
				sourceFilePath: mappedFilePath,
				sourceFileLine: guessedPosition.line,
				sourceFileColumn: guessedPosition.column,
			};
		} else {
			// The guessed position was out of bounds, so use the nearestMappingItem position instead.
			return {
				sourceFilePath: mappedFilePath,
				sourceFileLine: nearestMappingItem.originalLine,
				sourceFileColumn: nearestMappingItem.originalColumn,
			};
		}
	}

	private _getSourceMap(sourceFilePath: string): ISourceMap | null {
		let sourceMap: ISourceMap | null | undefined = this._sourceMapByFilePath.get(sourceFilePath);

		if (sourceMap === undefined) {
			// Normalize the path and redo the lookup
			const normalizedPath: string = FileSystem.getRealPath(sourceFilePath);

			sourceMap = this._sourceMapByFilePath.get(normalizedPath);
			if (sourceMap === undefined) {
				// Given "folder/file.d.ts", check for a corresponding "folder/file.d.ts.map"
				const sourceMapPath: string = normalizedPath + '.map';
				if (FileSystem.exists(sourceMapPath)) {
					// Load up the source map
					const rawSourceMap: RawSourceMap = JsonFile.load(sourceMapPath) as RawSourceMap;

					const sourceMapConsumer: SourceMapConsumer = new SourceMapConsumer(rawSourceMap);
					const mappingItems: MappingItem[] = [];

					// Extract the list of mapping items
					sourceMapConsumer.eachMapping(
						(mappingItem: MappingItem) => {
							mappingItems.push({
								...mappingItem,
								// The "source-map" package inexplicably uses 1-based line numbers but 0-based column numbers.
								// Fix that up proactively so we don't have to deal with it later.
								generatedColumn: mappingItem.generatedColumn + 1,
								originalColumn: mappingItem.originalColumn + 1,
							});
						},
						this,
						SourceMapConsumer.GENERATED_ORDER,
					);

					sourceMap = { sourceMapConsumer, mappingItems };
				} else {
					// No source map for this filename
					sourceMap = null;
				}

				this._sourceMapByFilePath.set(normalizedPath, sourceMap);
				if (sourceFilePath !== normalizedPath) {
					// Add both keys to the map
					this._sourceMapByFilePath.set(sourceFilePath, sourceMap);
				}
			} else {
				// Copy the result from the normalized to the non-normalized key
				this._sourceMapByFilePath.set(sourceFilePath, sourceMap);
			}
		}

		return sourceMap;
	}

	// The `mappingItems` array is sorted by generatedLine/generatedColumn (GENERATED_ORDER).
	// The _findNearestMappingItem() lookup is a simple binary search that returns the previous item
	// if there is no exact match.
	private static _findNearestMappingItem(mappingItems: MappingItem[], position: Position): MappingItem | undefined {
		if (mappingItems.length === 0) {
			return undefined;
		}

		let startIndex = 0;
		let endIndex: number = mappingItems.length - 1;

		while (startIndex <= endIndex) {
			const middleIndex: number = startIndex + Math.floor((endIndex - startIndex) / 2);

			const diff: number = SourceMapper._compareMappingItem(mappingItems[middleIndex]!, position);

			if (diff < 0) {
				startIndex = middleIndex + 1;
			} else if (diff > 0) {
				endIndex = middleIndex - 1;
			} else {
				// Exact match
				return mappingItems[middleIndex];
			}
		}

		// If we didn't find an exact match, then endIndex < startIndex.
		// Take endIndex because it's the smaller value.
		return mappingItems[endIndex];
	}

	private static _compareMappingItem(mappingItem: MappingItem, position: Position): number {
		const diff: number = mappingItem.generatedLine - position.line;
		if (diff !== 0) {
			return diff;
		}

		return mappingItem.generatedColumn - position.column;
	}
}
