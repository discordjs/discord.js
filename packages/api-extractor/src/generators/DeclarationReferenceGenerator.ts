// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { Navigation, Meaning } from '@discordjs/api-extractor-model';
import {
	DeclarationReference,
	ModuleSource,
	GlobalSource,
} from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import { type INodePackageJson, InternalError } from '@rushstack/node-core-library';
import * as ts from 'typescript';
import { AstNamespaceImport } from '../analyzer/AstNamespaceImport.js';
import { TypeScriptHelpers } from '../analyzer/TypeScriptHelpers.js';
import { TypeScriptInternals } from '../analyzer/TypeScriptInternals.js';
import type { Collector } from '../collector/Collector.js';
import type { CollectorEntity } from '../collector/CollectorEntity.js';

export class DeclarationReferenceGenerator {
	public static readonly unknownReference: string = '?';

	private readonly _collector: Collector;

	public constructor(collector: Collector) {
		this._collector = collector;
	}

	/**
	 * Gets the UID for a TypeScript Identifier that references a type.
	 */
	public getDeclarationReferenceForIdentifier(node: ts.Identifier): DeclarationReference | undefined {
		const symbol: ts.Symbol | undefined = this._collector.typeChecker.getSymbolAtLocation(node);
		if (symbol !== undefined) {
			const isExpression: boolean = DeclarationReferenceGenerator._isInExpressionContext(node);
			return (
				this.getDeclarationReferenceForSymbol(symbol, isExpression ? ts.SymbolFlags.Value : ts.SymbolFlags.Type) ??
				this.getDeclarationReferenceForSymbol(symbol, isExpression ? ts.SymbolFlags.Type : ts.SymbolFlags.Value) ??
				this.getDeclarationReferenceForSymbol(symbol, ts.SymbolFlags.Namespace)
			);
		}

		return undefined;
	}

	/**
	 * Gets the DeclarationReference for a TypeScript Symbol for a given meaning.
	 */
	public getDeclarationReferenceForSymbol(
		symbol: ts.Symbol,
		meaning: ts.SymbolFlags,
	): DeclarationReference | undefined {
		return this._symbolToDeclarationReference(symbol, meaning, /* includeModuleSymbols*/ false);
	}

	private static _isInExpressionContext(node: ts.Node): boolean {
		switch (node.parent.kind) {
			case ts.SyntaxKind.TypeQuery:
			case ts.SyntaxKind.ComputedPropertyName:
				return true;
			case ts.SyntaxKind.QualifiedName:
				return DeclarationReferenceGenerator._isInExpressionContext(node.parent);
			default:
				return false;
		}
	}

	private static _isExternalModuleSymbol(symbol: ts.Symbol): boolean {
		return (
			Boolean(symbol.flags & ts.SymbolFlags.ValueModule) &&
			symbol.valueDeclaration !== undefined &&
			ts.isSourceFile(symbol.valueDeclaration)
		);
	}

	private static _isSameSymbol(left: ts.Symbol | undefined, right: ts.Symbol): boolean {
		return (
			left === right ||
			Boolean(left?.valueDeclaration && right.valueDeclaration && left.valueDeclaration === right.valueDeclaration)
		);
	}

	private _getNavigationToSymbol(symbol: ts.Symbol): Navigation {
		const declaration: ts.Declaration | undefined = TypeScriptHelpers.tryGetADeclaration(symbol);
		const sourceFile: ts.SourceFile | undefined = declaration?.getSourceFile();
		const parent: ts.Symbol | undefined = TypeScriptInternals.getSymbolParent(symbol);

		// If it's global or from an external library, then use either Members or Exports. It's not possible for
		// global symbols or external library symbols to be Locals.
		const isGlobal: boolean = Boolean(sourceFile) && !ts.isExternalModule(sourceFile!);
		const isFromExternalLibrary: boolean =
			Boolean(sourceFile) && this._collector.program.isSourceFileFromExternalLibrary(sourceFile!);
		if (isGlobal || isFromExternalLibrary) {
			if (
				parent?.members &&
				DeclarationReferenceGenerator._isSameSymbol(parent.members.get(symbol.escapedName), symbol)
			) {
				return Navigation.Members;
			}

			return Navigation.Exports;
		}

		// Otherwise, this symbol is from the current package. If we've found an associated consumable
		// `CollectorEntity`, then use Exports. We use `consumable` here instead of `exported` because
		// if the symbol is exported from a non-consumable `AstNamespaceImport`, we don't want to use
		// Exports. We should use Locals instead.
		const entity: CollectorEntity | undefined = this._collector.tryGetEntityForSymbol(symbol);
		if (entity?.consumable) {
			return Navigation.Exports;
		}

		// If its parent symbol is not a source file, then use either Exports or Members. If the parent symbol
		// is a source file, but it wasn't exported from the package entry point (in the check above), then the
		// symbol is a local, so fall through below.
		if (parent && !DeclarationReferenceGenerator._isExternalModuleSymbol(parent)) {
			if (
				parent.members &&
				DeclarationReferenceGenerator._isSameSymbol(parent.members.get(symbol.escapedName), symbol)
			) {
				return Navigation.Members;
			}

			return Navigation.Exports;
		}

		// Otherwise, we have a local symbol, so use a Locals navigation. These are either:
		//
		// 1. Symbols that are exported from a file module but not the package entry point.
		// 2. Symbols that are not exported from their parent module.
		return Navigation.Locals;
	}

	private static _getMeaningOfSymbol(symbol: ts.Symbol, meaning: ts.SymbolFlags): Meaning | undefined {
		if (symbol.flags & meaning & ts.SymbolFlags.Class) {
			return Meaning.Class;
		}

		if (symbol.flags & meaning & ts.SymbolFlags.Enum) {
			return Meaning.Enum;
		}

		if (symbol.flags & meaning & ts.SymbolFlags.Interface) {
			return Meaning.Interface;
		}

		if (symbol.flags & meaning & ts.SymbolFlags.TypeAlias) {
			return Meaning.TypeAlias;
		}

		if (symbol.flags & meaning & ts.SymbolFlags.Function) {
			return Meaning.Function;
		}

		if (symbol.flags & meaning & ts.SymbolFlags.Variable) {
			return Meaning.Variable;
		}

		if (symbol.flags & meaning & ts.SymbolFlags.Module) {
			return Meaning.Namespace;
		}

		if (symbol.flags & meaning & ts.SymbolFlags.ClassMember) {
			return Meaning.Member;
		}

		if (symbol.flags & meaning & ts.SymbolFlags.Constructor) {
			return Meaning.Constructor;
		}

		if (symbol.flags & meaning & ts.SymbolFlags.EnumMember) {
			return Meaning.Member;
		}

		if (symbol.flags & meaning & ts.SymbolFlags.Signature) {
			if (symbol.escapedName === ts.InternalSymbolName.Call) {
				return Meaning.CallSignature;
			}

			if (symbol.escapedName === ts.InternalSymbolName.New) {
				return Meaning.ConstructSignature;
			}

			if (symbol.escapedName === ts.InternalSymbolName.Index) {
				return Meaning.IndexSignature;
			}
		}

		if (symbol.flags & meaning & ts.SymbolFlags.TypeParameter) {
			// This should have already been handled in `getDeclarationReferenceOfSymbol`.
			throw new InternalError('Not supported.');
		}

		return undefined;
	}

	private _symbolToDeclarationReference(
		symbol: ts.Symbol,
		meaning: ts.SymbolFlags,
		includeModuleSymbols: boolean,
	): DeclarationReference | undefined {
		const declaration: ts.Node | undefined = TypeScriptHelpers.tryGetADeclaration(symbol);
		const sourceFile: ts.SourceFile | undefined = declaration?.getSourceFile();

		let followedSymbol: ts.Symbol = symbol;
		if (followedSymbol.flags & ts.SymbolFlags.ExportValue) {
			followedSymbol = this._collector.typeChecker.getExportSymbolOfSymbol(followedSymbol);
		}

		if (followedSymbol.flags & ts.SymbolFlags.Alias) {
			followedSymbol = this._collector.typeChecker.getAliasedSymbol(followedSymbol);

			// Without this logic, we end up following the symbol `ns` in `import * as ns from './file'` to
			// the actual file `file.ts`. We don't want to do this, so revert to the original symbol.
			if (followedSymbol.flags & ts.SymbolFlags.ValueModule) {
				followedSymbol = symbol;
			}
		}

		if (DeclarationReferenceGenerator._isExternalModuleSymbol(followedSymbol)) {
			if (!includeModuleSymbols) {
				return undefined;
			}

			return new DeclarationReference(this._sourceFileToModuleSource(sourceFile));
		}

		// Do not generate a declaration reference for a type parameter.
		if (followedSymbol.flags & ts.SymbolFlags.TypeParameter) {
			return undefined;
		}

		let parentRef: DeclarationReference | undefined = this._getParentReference(followedSymbol);
		if (!parentRef) {
			return undefined;
		}

		let localName: string = followedSymbol.name;
		const entity: CollectorEntity | undefined = this._collector.tryGetEntityForSymbol(followedSymbol);
		if (entity?.nameForEmit) {
			localName = entity.nameForEmit;
		}

		if (followedSymbol.escapedName === ts.InternalSymbolName.Constructor) {
			localName = 'constructor';
		} else {
			const wellKnownName: string | undefined = TypeScriptHelpers.tryDecodeWellKnownSymbolName(
				followedSymbol.escapedName,
			);
			if (wellKnownName) {
				// TypeScript binds well-known ECMAScript symbols like 'Symbol.iterator' as '__@iterator'.
				// This converts a string like '__@iterator' into the property name '[Symbol.iterator]'.
				localName = wellKnownName;
			} else if (TypeScriptHelpers.isUniqueSymbolName(followedSymbol.escapedName)) {
				for (const decl of followedSymbol.declarations ?? []) {
					const declName: ts.DeclarationName | undefined = ts.getNameOfDeclaration(decl);
					if (declName && ts.isComputedPropertyName(declName)) {
						const lateName: string | undefined = TypeScriptHelpers.tryGetLateBoundName(declName);
						if (lateName !== undefined) {
							localName = lateName;
							break;
						}
					}
				}
			}
		}

		const navigation: Navigation = this._getNavigationToSymbol(followedSymbol);

		// If the symbol is a global, ensure the source is global.
		if (sourceFile && !ts.isExternalModule(sourceFile) && parentRef.source !== GlobalSource.instance) {
			parentRef = new DeclarationReference(GlobalSource.instance);
		}

		return parentRef
			.addNavigationStep(navigation as any, localName)
			.withMeaning(DeclarationReferenceGenerator._getMeaningOfSymbol(followedSymbol, meaning) as any);
	}

	private _getParentReference(symbol: ts.Symbol): DeclarationReference | undefined {
		const declaration: ts.Node | undefined = TypeScriptHelpers.tryGetADeclaration(symbol);
		const sourceFile: ts.SourceFile | undefined = declaration?.getSourceFile();

		// Note that it's possible for a symbol to be exported from an entry point as well as one or more
		// namespaces. In that case, it's not clear what to choose as its parent. Today's logic is neither
		// perfect nor particularly stable to API items being renamed and shuffled around.
		const entity: CollectorEntity | undefined = this._collector.tryGetEntityForSymbol(symbol);
		if (entity) {
			if (entity.exportedFromEntryPoint) {
				return new DeclarationReference(this._sourceFileToModuleSource(sourceFile));
			}

			const firstExportingConsumableParent: CollectorEntity | undefined = entity.getFirstExportingConsumableParent();
			if (firstExportingConsumableParent && firstExportingConsumableParent.astEntity instanceof AstNamespaceImport) {
				const parentSymbol: ts.Symbol | undefined = TypeScriptInternals.tryGetSymbolForDeclaration(
					firstExportingConsumableParent.astEntity.declaration,
					this._collector.typeChecker,
				);
				if (parentSymbol) {
					return this._symbolToDeclarationReference(parentSymbol, parentSymbol.flags, /* includeModuleSymbols*/ true);
				}
			}
		}

		// Next, try to find a parent symbol via the symbol tree.
		const parentSymbol: ts.Symbol | undefined = TypeScriptInternals.getSymbolParent(symbol);
		if (parentSymbol) {
			return this._symbolToDeclarationReference(parentSymbol, parentSymbol.flags, /* includeModuleSymbols*/ true);
		}

		// If that doesn't work, try to find a parent symbol via the node tree. As far as we can tell,
		// this logic is only needed for local symbols within namespaces. For example:
		//
		// ```
		// export namespace n {
		//   type SomeType = number;
		//   export function someFunction(): SomeType { return 5; }
		// }
		// ```
		//
		// In the example above, `SomeType` doesn't have a parent symbol per the TS internal API above,
		// but its reference still needs to be qualified with the parent reference for `n`.
		const grandParent: ts.Node | undefined = declaration?.parent?.parent;
		if (grandParent && ts.isModuleDeclaration(grandParent)) {
			const grandParentSymbol: ts.Symbol | undefined = TypeScriptInternals.tryGetSymbolForDeclaration(
				grandParent,
				this._collector.typeChecker,
			);
			if (grandParentSymbol) {
				return this._symbolToDeclarationReference(
					grandParentSymbol,
					grandParentSymbol.flags,
					/* includeModuleSymbols*/ true,
				);
			}
		}

		// At this point, we have a local symbol in a module.
		if (sourceFile && ts.isExternalModule(sourceFile)) {
			return new DeclarationReference(this._sourceFileToModuleSource(sourceFile));
		} else {
			return new DeclarationReference(GlobalSource.instance);
		}
	}

	private _getPackageName(sourceFile: ts.SourceFile): string {
		if (this._collector.program.isSourceFileFromExternalLibrary(sourceFile)) {
			const packageJson: INodePackageJson | undefined = this._collector.packageJsonLookup.tryLoadNodePackageJsonFor(
				sourceFile.fileName,
			);

			if (packageJson?.name) {
				return packageJson.name;
			}

			return DeclarationReferenceGenerator.unknownReference;
		}

		return this._collector.workingPackage.name;
	}

	private _sourceFileToModuleSource(sourceFile: ts.SourceFile | undefined): GlobalSource | ModuleSource {
		if (sourceFile && ts.isExternalModule(sourceFile)) {
			const packageName: string = this._getPackageName(sourceFile);

			if (this._collector.bundledPackageNames.has(packageName)) {
				// The api-extractor.json config file has a "bundledPackages" setting, which causes imports from
				// certain NPM packages to be treated as part of the working project.  In this case, we need to
				// substitute the working package name.
				return new ModuleSource(this._collector.workingPackage.name);
			} else {
				return new ModuleSource(packageName);
			}
		}

		return GlobalSource.instance;
	}
}
