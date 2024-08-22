// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { InternalError } from '@rushstack/node-core-library';
import * as ts from 'typescript';
import { SourceFileLocationFormatter } from './SourceFileLocationFormatter.js';
import { TypeScriptInternals } from './TypeScriptInternals.js';

export class TypeScriptHelpers {
	// Matches TypeScript's encoded names for well-known ECMAScript symbols like
	// "__@iterator" or "__@toStringTag".
	private static readonly _wellKnownSymbolNameRegExp: RegExp = /^__@(?<identifier>\w+)$/;

	// Matches TypeScript's encoded names for late-bound symbols derived from `unique symbol` declarations
	// which have the form of "__@<variableName>@<symbolId>", i.e. "__@someSymbol@12345".
	private static readonly _uniqueSymbolNameRegExp: RegExp = /^__@.*@\d+$/;

	/**
	 * This traverses any symbol aliases to find the original place where an item was defined.
	 * For example, suppose a class is defined as "export default class MyClass \{ \}"
	 * but exported from the package's index.ts like this:
	 *
	 *    export \{ default as _MyClass \} from './MyClass';
	 *
	 * In this example, calling followAliases() on the _MyClass symbol will return the
	 * original definition of MyClass, traversing any intermediary places where the
	 * symbol was imported and re-exported.
	 */
	public static followAliases(symbol: ts.Symbol, typeChecker: ts.TypeChecker): ts.Symbol {
		let current: ts.Symbol = symbol;
		for (;;) {
			if (!(current.flags & ts.SymbolFlags.Alias)) {
				break;
			}

			const currentAlias: ts.Symbol = typeChecker.getAliasedSymbol(current);
			if (!currentAlias || currentAlias === current) {
				break;
			}

			current = currentAlias;
		}

		return current;
	}

	/**
	 * Returns true if TypeScriptHelpers.followAliases() would return something different
	 * from the input `symbol`.
	 */
	public static isFollowableAlias(symbol: ts.Symbol, typeChecker: ts.TypeChecker): boolean {
		if (!(symbol.flags & ts.SymbolFlags.Alias)) {
			return false;
		}

		const alias: ts.Symbol = typeChecker.getAliasedSymbol(symbol);

		return alias && alias !== symbol;
	}

	/**
	 * Certain virtual symbols do not have any declarations.  For example, `ts.TypeChecker.getExportsOfModule()` can
	 * sometimes return a "prototype" symbol for an object, even though there is no corresponding declaration in the
	 * source code.  API Extractor generally ignores such symbols.
	 */
	public static tryGetADeclaration(symbol: ts.Symbol): ts.Declaration | undefined {
		if (symbol.declarations && symbol.declarations.length > 0) {
			return symbol.declarations[0];
		}

		return undefined;
	}

	/**
	 * Returns true if the specified symbol is an ambient declaration.
	 */
	public static isAmbient(symbol: ts.Symbol, typeChecker: ts.TypeChecker): boolean {
		const followedSymbol: ts.Symbol = TypeScriptHelpers.followAliases(symbol, typeChecker);

		if (followedSymbol.declarations && followedSymbol.declarations.length > 0) {
			const firstDeclaration: ts.Declaration = followedSymbol.declarations[0]!;

			// Test 1: Are we inside the sinister "declare global {" construct?
			const highestModuleDeclaration: ts.ModuleDeclaration | undefined = TypeScriptHelpers.findHighestParent(
				firstDeclaration,
				ts.SyntaxKind.ModuleDeclaration,
			);
			if (highestModuleDeclaration && highestModuleDeclaration.name.getText().trim() === 'global') {
				return true;
			}

			// Test 2: Otherwise, the main heuristic for ambient declarations is by looking at the
			// ts.SyntaxKind.SourceFile node to see whether it has a symbol or not (i.e. whether it
			// is acting as a module or not).
			const sourceFile: ts.SourceFile = firstDeclaration.getSourceFile();

			if (typeChecker.getSymbolAtLocation(sourceFile)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * Same semantics as tryGetSymbolForDeclaration(), but throws an exception if the symbol
	 * cannot be found.
	 */
	public static getSymbolForDeclaration(declaration: ts.Declaration, checker: ts.TypeChecker): ts.Symbol {
		const symbol: ts.Symbol | undefined = TypeScriptInternals.tryGetSymbolForDeclaration(declaration, checker);
		if (!symbol) {
			throw new InternalError(
				'Unable to determine semantic information for declaration:\n' +
					SourceFileLocationFormatter.formatDeclaration(declaration),
			);
		}

		return symbol;
	}

	// Return name of the module, which could be like "./SomeLocalFile' or like 'external-package/entry/point'
	public static getModuleSpecifier(
		nodeWithModuleSpecifier: ts.ExportDeclaration | ts.ImportDeclaration | ts.ImportTypeNode,
	): string | undefined {
		if (nodeWithModuleSpecifier.kind === ts.SyntaxKind.ImportType) {
			// As specified internally in typescript:/src/compiler/types.ts#ValidImportTypeNode
			if (
				nodeWithModuleSpecifier.argument.kind !== ts.SyntaxKind.LiteralType ||
				(nodeWithModuleSpecifier.argument as ts.LiteralTypeNode).literal.kind !== ts.SyntaxKind.StringLiteral
			) {
				throw new InternalError(
					`Invalid ImportTypeNode: ${nodeWithModuleSpecifier.getText()}\n` +
						SourceFileLocationFormatter.formatDeclaration(nodeWithModuleSpecifier),
				);
			}

			const literalTypeNode: ts.LiteralTypeNode = nodeWithModuleSpecifier.argument as ts.LiteralTypeNode;
			const stringLiteral: ts.StringLiteral = literalTypeNode.literal as ts.StringLiteral;
			return stringLiteral.text.trim();
		}

		// Node is a declaration
		if (nodeWithModuleSpecifier.moduleSpecifier && ts.isStringLiteralLike(nodeWithModuleSpecifier.moduleSpecifier)) {
			return TypeScriptInternals.getTextOfIdentifierOrLiteral(nodeWithModuleSpecifier.moduleSpecifier);
		}

		return undefined;
	}

	/**
	 * Returns an ancestor of "node", such that the ancestor, any intermediary nodes,
	 * and the starting node match a list of expected kinds.  Undefined is returned
	 * if there aren't enough ancestors, or if the kinds are incorrect.
	 *
	 * For example, suppose child "C" has parents A --\> B --\> C.
	 *
	 * Calling _matchAncestor(C, [ExportSpecifier, NamedExports, ExportDeclaration])
	 * would return A only if A is of kind ExportSpecifier, B is of kind NamedExports,
	 * and C is of kind ExportDeclaration.
	 *
	 * Calling _matchAncestor(C, [ExportDeclaration]) would return C.
	 */
	public static matchAncestor<T extends ts.Node>(node: ts.Node, kindsToMatch: ts.SyntaxKind[]): T | undefined {
		// (slice(0) clones an array)
		const reversedParentKinds: ts.SyntaxKind[] = kindsToMatch.slice(0).reverse();

		let current: ts.Node | undefined;

		for (const parentKind of reversedParentKinds) {
			if (current) {
				// Then walk the parents
				current = current.parent;
			} else {
				// The first time through, start with node
				current = node;
			}

			// If we ran out of items, or if the kind doesn't match, then fail
			if (!current || current.kind !== parentKind) {
				return undefined;
			}
		}

		// If we matched everything, then return the node that matched the last parentKinds item
		return current as T;
	}

	/**
	 * Does a depth-first search of the children of the specified node.  Returns the first child
	 * with the specified kind, or undefined if there is no match.
	 */
	public static findFirstChildNode<T extends ts.Node>(node: ts.Node, kindToMatch: ts.SyntaxKind): T | undefined {
		for (const child of node.getChildren()) {
			if (child.kind === kindToMatch) {
				return child as T;
			}

			const recursiveMatch: T | undefined = TypeScriptHelpers.findFirstChildNode(child, kindToMatch);
			if (recursiveMatch) {
				return recursiveMatch;
			}
		}

		return undefined;
	}

	/**
	 * Returns the first parent node with the specified  SyntaxKind, or undefined if there is no match.
	 */
	public static findFirstParent<T extends ts.Node>(node: ts.Node, kindToMatch: ts.SyntaxKind): T | undefined {
		let current: ts.Node | undefined = node.parent;

		while (current) {
			if (current.kind === kindToMatch) {
				return current as T;
			}

			current = current.parent;
		}

		return undefined;
	}

	/**
	 * Returns the highest parent node with the specified SyntaxKind, or undefined if there is no match.
	 *
	 * @remarks
	 * Whereas findFirstParent() returns the first match, findHighestParent() returns the last match.
	 */
	public static findHighestParent<T extends ts.Node>(node: ts.Node, kindToMatch: ts.SyntaxKind): T | undefined {
		let current: ts.Node | undefined = node;
		let highest: T | undefined;

		for (;;) {
			current = TypeScriptHelpers.findFirstParent<T>(current, kindToMatch);
			if (!current) {
				break;
			}

			highest = current as T;
		}

		return highest;
	}

	/**
	 * Decodes the names that the compiler generates for a built-in ECMAScript symbol.
	 *
	 * @remarks
	 * TypeScript binds well-known ECMAScript symbols like `[Symbol.iterator]` as `__@iterator`.
	 * If `name` is of this form, then `tryGetWellKnownSymbolName()` converts it back into e.g. `[Symbol.iterator]`.
	 * If the string does not start with `__@` then `undefined` is returned.
	 */
	public static tryDecodeWellKnownSymbolName(name: ts.__String): string | undefined {
		const match = TypeScriptHelpers._wellKnownSymbolNameRegExp.exec(name as string);
		if (match?.groups?.identifier) {
			const identifier: string = match.groups.identifier;
			return `[Symbol.${identifier}]`;
		}

		return undefined;
	}

	/**
	 * Returns whether the provided name was generated for a TypeScript `unique symbol`.
	 */
	public static isUniqueSymbolName(name: ts.__String): boolean {
		return TypeScriptHelpers._uniqueSymbolNameRegExp.test(name as string);
	}

	/**
	 * Derives the string representation of a TypeScript late-bound symbol.
	 */
	public static tryGetLateBoundName(declarationName: ts.ComputedPropertyName): string | undefined {
		// Create a node printer that ignores comments and indentation that we can use to convert
		// declarationName to a string.
		const printer: ts.Printer = ts.createPrinter(
			{ removeComments: true },
			{
				onEmitNode(hint: ts.EmitHint, node: ts.Node, emitCallback: (hint: ts.EmitHint, node: ts.Node) => void): void {
					ts.setEmitFlags(declarationName, ts.EmitFlags.NoIndentation | ts.EmitFlags.SingleLine);
					emitCallback(hint, node);
				},
			},
		);
		const sourceFile: ts.SourceFile = declarationName.getSourceFile();
		const text: string = printer.printNode(ts.EmitHint.Unspecified, declarationName, sourceFile);
		// clean up any emit flags we've set on any nodes in the tree.
		ts.disposeEmitNodes(sourceFile);
		return text;
	}
}
