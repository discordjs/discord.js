// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type * as ts from 'typescript';
import type { Collector } from '../collector/Collector.js';
import { AstSyntheticEntity } from './AstEntity.js';
import type { AstModule, AstModuleExportInfo } from './AstModule.js';

export interface IAstNamespaceImportOptions {
	readonly astModule: AstModule;
	readonly declaration: ts.Declaration;
	readonly namespaceName: string;
	readonly symbol: ts.Symbol;
}

/**
 * `AstNamespaceImport` represents a namespace that is created implicitly by a statement
 * such as `import * as example from "./file";`
 *
 * @remarks
 *
 * A typical input looks like this:
 * ```ts
 * // Suppose that example.ts exports two functions f1() and f2().
 * import * as example from "./file";
 * export { example };
 * ```
 *
 * API Extractor's .d.ts rollup will transform it into an explicit namespace, like this:
 * ```ts
 * declare f1(): void;
 * declare f2(): void;
 *
 * declare namespace example {
 *   export {
 *     f1,
 *     f2
 *   }
 * }
 * ```
 *
 * The current implementation does not attempt to relocate f1()/f2() to be inside the `namespace`
 * because other type signatures may reference them directly (without using the namespace qualifier).
 * The `declare namespace example` is a synthetic construct represented by `AstNamespaceImport`.
 */
export class AstNamespaceImport extends AstSyntheticEntity {
	/**
	 * Returns true if the AstSymbolTable.analyze() was called for this object.
	 * See that function for details.
	 */
	public analyzed: boolean = false;

	/**
	 * For example, if the original statement was `import * as example from "./file";`
	 * then `astModule` refers to the `./file.d.ts` file.
	 */
	public readonly astModule: AstModule;

	/**
	 * For example, if the original statement was `import * as example from "./file";`
	 * then `namespaceName` would be `example`.
	 */
	public readonly namespaceName: string;

	/**
	 * The original `ts.SyntaxKind.NamespaceImport` which can be used as a location for error messages.
	 */
	public readonly declaration: ts.Declaration;

	/**
	 * The original `ts.SymbolFlags.Namespace` symbol.
	 */
	public readonly symbol: ts.Symbol;

	public constructor(options: IAstNamespaceImportOptions) {
		super();
		this.astModule = options.astModule;
		this.namespaceName = options.namespaceName;
		this.declaration = options.declaration;
		this.symbol = options.symbol;
	}

	/**
	 * {@inheritdoc}
	 */
	public get localName(): string {
		// abstract
		return this.namespaceName;
	}

	public fetchAstModuleExportInfo(collector: Collector): AstModuleExportInfo {
		const astModuleExportInfo: AstModuleExportInfo = collector.astSymbolTable.fetchAstModuleExportInfo(this.astModule);
		return astModuleExportInfo;
	}
}
