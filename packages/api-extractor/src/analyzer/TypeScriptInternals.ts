// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

// import { InternalError } from '@rushstack/node-core-library';
import * as ts from 'typescript/unstable/ast';
import * as tsAPI from 'typescript/unstable/sync';

/**
 * Exposes the TypeScript compiler internals for detecting global variable names.
 */
export interface IGlobalVariableAnalyzer {
	hasGlobalName(name: string): boolean;
}

export class TypeScriptInternals {
	/**
	 * Returns the Symbol for the provided Declaration.  This is a workaround for a missing
	 * feature of the TypeScript Compiler API.   It is the only apparent way to reach
	 * certain data structures, and seems to always work, but is not officially documented.
	 *
	 * @returns The associated Symbol.  If there is no semantic information (e.g. if the
	 * declaration is an extra semicolon somewhere), then "undefined" is returned.
	 */
	public static tryGetSymbolForDeclaration(
		declaration: ts.Declaration,
		checker: tsAPI.Checker,
	): tsAPI.Symbol | undefined {
		let symbol: tsAPI.Symbol | undefined = tsAPI.getSymbol(declaration);
		if (symbol?.escapedName === ts.InternalSymbolName.Computed) {
			const name: ts.DeclarationName | undefined = ts.getNameOfDeclaration(declaration);
			symbol = (name && checker.getSymbolAtLocation(name)) || symbol;
		}

		return symbol;
	}

	/**
	 * Returns whether the provided Symbol is a TypeScript "late-bound" Symbol (i.e. was created by the Checker
	 * for a computed property based on its type, rather than by the Binder).
	 */
	public static isLateBoundSymbol(symbol: tsAPI.Symbol): boolean {
		return (symbol.flags & tsAPI.SymbolFlags.Transient) !== 0 && symbol.checkFlags === tsAPI.CheckFlags.Late;
	}

	/**
	 * Retrieves the comment ranges associated with the specified node.
	 */
	// public static getJSDocCommentRanges(node: ts.Node, text: string): ts.CommentRange[] | undefined {
	// 	// Compiler internal:
	// 	// https://github.com/microsoft/TypeScript/blob/v2.4.2/src/compiler/utilities.ts#L616

	// 	return Reflect.apply((tsAPI as any).getJSDocCommentRanges, this, [node, text]);
	// }

	/**
	 * Retrieves the (unescaped) value of an string literal, numeric literal, or identifier.
	 */
	// public static getTextOfIdentifierOrLiteral(
	// 	node: ts.Identifier | ts.NumericLiteral | ts.StringLiteralLikeNode,
	// ): string {
	// 	// Compiler internal:
	// 	// https://github.com/microsoft/TypeScript/blob/v3.2.2/src/compiler/utilities.ts#L2721

	// 	return (tsAPI as any).getTextOfIdentifierOrLiteral(node);
	// }

	/**
	 * Retrieves the (cached) module resolution information for a module name that was exported from a SourceFile.
	 * The compiler populates this cache as part of analyzing the source file.
	 */
	// public static getResolvedModule(
	// 	program: tsAPI.Program,
	// 	sourceFile: ts.SourceFile,
	// 	moduleNameText: string,
	// 	mode: tsAPI.ModuleKind.CommonJS | tsAPI.ModuleKind.ESNext | tsAPI.ModuleKind.None,
	// ): tsAPI.ResolvedModule | undefined {
	// 	// Compiler internal:
	// 	// https://github.com/microsoft/TypeScript/blob/v5.3.3/src/compiler/types.ts#L4698
	// 	const result: tsAPI.ResolvedModule | undefined = program.getResolvedModule(sourceFile.path, moduleNameText, mode);
	// 	return result;
	// }

	/**
	 * Returns ts.Symbol.parent if it exists.
	 */
	// public static getSymbolParent(symbol: tsAPI.Symbol): tsAPI.Symbol | undefined {
	// 	return symbol.getParent();
	// }

	/**
	 * In an statement like `export default class X { }`, the `Symbol.name` will be `default`
	 * whereas the `localSymbol` is `X`.
	 */
	// public static tryGetLocalSymbol(declaration: ts.Declaration): tsAPI.Symbol | undefined {
	// 	return (declaration as any).localSymbol;
	// }

	// public static getGlobalVariableAnalyzer(program: tsAPI.Program): IGlobalVariableAnalyzer {
	// 	// Compiler internals: `getEmitResolver` and `hasGlobalName` are accessed via `any` and
	// 	// guarded below at runtime.
	// 	// https://github.com/microsoft/TypeScript/blob/v6.0.3/src/compiler/checker.ts#L51221
	// 	const typeChecker: any = program.getProject().checker;
	// 	if (!typeChecker.getEmitResolver) {
	// 		throw new InternalError('Missing TypeChecker.getEmitResolver');
	// 	}

	// 	const resolver: any = typeChecker.getEmitResolver();
	// 	if (!resolver.hasGlobalName) {
	// 		throw new InternalError('Missing EmitResolver.hasGlobalName');
	// 	}

	// 	return resolver;
	// }

	/**
	 * Returns whether a variable is declared with the const keyword
	 */
	public static isVarConst(node: ts.VariableDeclaration | ts.VariableDeclarationList): boolean {
		// Compiler internal: https://github.com/microsoft/TypeScript/blob/71286e3d49c10e0e99faac360a6bbd40f12db7b6/src/compiler/utilities.ts#L925
		return Boolean(node.flags & ts.NodeFlags.Const);
	}
}
