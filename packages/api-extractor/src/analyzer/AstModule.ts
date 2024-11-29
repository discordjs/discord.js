// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type * as ts from 'typescript';
import type { AstEntity } from './AstEntity.js';
import type { AstSymbol } from './AstSymbol.js';

/**
 * Represents information collected by {@link AstSymbolTable.fetchAstModuleExportInfo}
 */
export class AstModuleExportInfo {
	public readonly exportedLocalEntities: Map<string, AstEntity> = new Map<string, AstEntity>();

	public readonly starExportedExternalModules: Set<AstModule> = new Set<AstModule>();
}

/**
 * Constructor parameters for AstModule
 *
 * @privateRemarks
 * Our naming convention is to use I____Parameters for constructor options and
 * I____Options for general function options.  However the word "parameters" is
 * confusingly similar to the terminology for function parameters modeled by API Extractor,
 * so we use I____Options for both cases in this code base.
 */
export interface IAstModuleOptions {
	externalModulePath: string | undefined;
	moduleSymbol: ts.Symbol;
	sourceFile: ts.SourceFile;
}

/**
 * An internal data structure that represents a source file that is analyzed by AstSymbolTable.
 */
export class AstModule {
	/**
	 * The source file that declares this TypeScript module.  In most cases, the source file's
	 * top-level exports constitute the module.
	 */
	public readonly sourceFile: ts.SourceFile;

	/**
	 * The symbol for the module.  Typically this corresponds to ts.SourceFile itself, however
	 * in some cases the ts.SourceFile may contain multiple modules declared using the `module` keyword.
	 */
	public readonly moduleSymbol: ts.Symbol;

	/**
	 * Example:  "\@rushstack/node-core-library/lib/FileSystem"
	 * but never: "./FileSystem"
	 */
	public readonly externalModulePath: string | undefined;

	/**
	 * A list of other `AstModule` objects that appear in `export * from "___";` statements.
	 */
	public readonly starExportedModules: Set<AstModule>;

	/**
	 * A partial map of entities exported by this module.  The key is the exported name.
	 */
	public readonly cachedExportedEntities: Map<string, AstEntity>; // exportName --> entity

	/**
	 * Additional state calculated by `AstSymbolTable.fetchWorkingPackageModule()`.
	 */
	public astModuleExportInfo: AstModuleExportInfo | undefined;

	public constructor(options: IAstModuleOptions) {
		this.sourceFile = options.sourceFile;
		this.moduleSymbol = options.moduleSymbol;

		this.externalModulePath = options.externalModulePath;

		this.starExportedModules = new Set<AstModule>();

		this.cachedExportedEntities = new Map<string, AstSymbol>();

		this.astModuleExportInfo = undefined;
	}

	/**
	 * If false, then this source file is part of the working package being processed by the `Collector`.
	 */
	public get isExternal(): boolean {
		return this.externalModulePath !== undefined;
	}
}
