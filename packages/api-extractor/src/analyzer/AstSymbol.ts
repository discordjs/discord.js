// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { InternalError } from '@rushstack/node-core-library';
import type * as ts from 'typescript';
import type { AstDeclaration } from './AstDeclaration.js';
import { AstEntity } from './AstEntity.js';

/**
 * Constructor options for AstSymbol
 */
export interface IAstSymbolOptions {
	readonly followedSymbol: ts.Symbol;
	readonly isExternal: boolean;
	readonly localName: string;
	readonly nominalAnalysis: boolean;
	readonly parentAstSymbol: AstSymbol | undefined;
	readonly rootAstSymbol: AstSymbol | undefined;
}

/**
 * The AstDeclaration and AstSymbol classes are API Extractor's equivalent of the compiler's
 * ts.Declaration and ts.Symbol objects.  They are created by the `AstSymbolTable` class.
 *
 * @remarks
 * The AstSymbol represents the ts.Symbol information for an AstDeclaration.  For example,
 * if a method has 3 overloads, each overloaded signature will have its own AstDeclaration,
 * but they will all share a common AstSymbol.
 *
 * For nested definitions, the AstSymbol has a unique parent (i.e. AstSymbol.rootAstSymbol),
 * but the parent/children for each AstDeclaration may be different.  Consider this example:
 *
 * ```ts
 * export namespace N {
 *   export function f(): void { }
 * }
 *
 * export interface N {
 *   g(): void;
 * }
 * ```
 *
 * Note how the parent/child relationships are different for the symbol tree versus
 * the declaration tree, and the declaration tree has two roots:
 *
 * ```
 * AstSymbol tree:            AstDeclaration tree:
 * - N                        - N (namespace)
 *   - f                        - f
 *   - g                      - N (interface)
 *                              - g
 * ```
 */
export class AstSymbol extends AstEntity {
	/**
	 * {@inheritdoc}
	 */
	public readonly localName: string; // abstract

	/**
	 * If true, then the `followedSymbol` (i.e. original declaration) of this symbol
	 * is not part of the working package.  The working package may still export this symbol,
	 * but if so it should be emitted as an alias such as `export { X } from "package1";`.
	 */
	public readonly isExternal: boolean;

	/**
	 * The compiler symbol where this type was defined, after following any aliases.
	 *
	 * @remarks
	 * This is a normal form that can be reached from any symbol alias by calling
	 * `TypeScriptHelpers.followAliases()`.  It can be compared to determine whether two
	 * symbols refer to the same underlying type.
	 */
	public readonly followedSymbol: ts.Symbol;

	/**
	 * If true, then this AstSymbol represents a foreign object whose structure will be
	 * ignored.  The AstDeclaration objects will not have any parent or children, and its references
	 * will not be analyzed.
	 *
	 * Nominal symbols are tracked e.g. when they are reexported by the working package.
	 */
	public readonly nominalAnalysis: boolean;

	/**
	 * Returns the symbol of the parent of this AstSymbol, or undefined if there is no parent.
	 *
	 * @remarks
	 * If a symbol has multiple declarations, we assume (as an axiom) that their parent
	 * declarations will belong to the same symbol.  This means that the "parent" of a
	 * symbol is a well-defined concept.  However, the "children" of a symbol are not very
	 * meaningful, because different declarations may have different nested members,
	 * so we usually need to traverse declarations to find children.
	 */
	public readonly parentAstSymbol: AstSymbol | undefined;

	/**
	 * Returns the symbol of the root of the AstDeclaration hierarchy.
	 *
	 * @remarks
	 * NOTE: If this AstSymbol is the root, then rootAstSymbol will point to itself.
	 */
	public readonly rootAstSymbol: AstSymbol;

	/**
	 * Additional information that is calculated later by the `Collector`.  The actual type is `SymbolMetadata`,
	 * but we declare it as `unknown` because consumers must obtain this object by calling
	 * `Collector.fetchSymbolMetadata()`.
	 */
	public symbolMetadata: unknown;

	private readonly _astDeclarations: AstDeclaration[];

	// This flag is unused if this is not the root symbol.
	// Being "analyzed" is a property of the root symbol.
	private _analyzed: boolean = false;

	public constructor(options: IAstSymbolOptions) {
		super();

		this.followedSymbol = options.followedSymbol;
		this.localName = options.localName;
		this.isExternal = options.isExternal;
		this.nominalAnalysis = options.nominalAnalysis;
		this.parentAstSymbol = options.parentAstSymbol;
		this.rootAstSymbol = options.rootAstSymbol ?? this;
		this._astDeclarations = [];
	}

	/**
	 * The one or more declarations for this symbol.
	 *
	 * @remarks
	 * For example, if this symbol is a method, then the declarations might be
	 * various method overloads.  If this symbol is a namespace, then the declarations
	 * might be separate namespace blocks with the same name that get combined via
	 * declaration merging.
	 */
	public get astDeclarations(): readonly AstDeclaration[] {
		return this._astDeclarations;
	}

	/**
	 * Returns true if the AstSymbolTable.analyze() was called for this object.
	 * See that function for details.
	 *
	 * @remarks
	 * AstSymbolTable.analyze() is always performed on the root AstSymbol.  This function
	 * returns true if-and-only-if the root symbol was analyzed.
	 */
	public get analyzed(): boolean {
		return this.rootAstSymbol._analyzed;
	}

	/**
	 * This is an internal callback used when the AstSymbolTable attaches a new
	 * AstDeclaration to this object.
	 *
	 * @internal
	 */
	public _notifyDeclarationAttach(astDeclaration: AstDeclaration): void {
		if (this.analyzed) {
			throw new InternalError('_notifyDeclarationAttach() called after analysis is already complete');
		}

		this._astDeclarations.push(astDeclaration);
	}

	/**
	 * This is an internal callback used when the AstSymbolTable.analyze()
	 * has processed this object.
	 *
	 * @internal
	 */
	public _notifyAnalyzed(): void {
		if (this.parentAstSymbol) {
			throw new InternalError('_notifyAnalyzed() called for an AstSymbol which is not the root');
		}

		this._analyzed = true;
	}

	/**
	 * Helper that calls AstDeclaration.forEachDeclarationRecursive() for each AstDeclaration.
	 */
	public forEachDeclarationRecursive(action: (astDeclaration: AstDeclaration) => void): void {
		for (const astDeclaration of this.astDeclarations) {
			astDeclaration.forEachDeclarationRecursive(action);
		}
	}
}
