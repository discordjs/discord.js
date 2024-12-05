// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { InternalError } from '@rushstack/node-core-library';
import * as ts from 'typescript';
import type { AstEntity } from './AstEntity.js';
import { AstImport, type IAstImportOptions, AstImportKind } from './AstImport.js';
import { AstModule, AstModuleExportInfo } from './AstModule.js';
import { AstNamespaceImport } from './AstNamespaceImport.js';
import { AstSymbol } from './AstSymbol.js';
import type { IFetchAstSymbolOptions } from './AstSymbolTable.js';
import { SourceFileLocationFormatter } from './SourceFileLocationFormatter.js';
import { SyntaxHelpers } from './SyntaxHelpers.js';
import { TypeScriptHelpers } from './TypeScriptHelpers.js';
import { TypeScriptInternals } from './TypeScriptInternals.js';

/**
 * Exposes the minimal APIs from AstSymbolTable that are needed by ExportAnalyzer.
 *
 * In particular, we want ExportAnalyzer to be able to call AstSymbolTable._fetchAstSymbol() even though it
 * is a very private API that should not be exposed to any other components.
 */
export interface IAstSymbolTable {
	analyze(astEntity: AstEntity): void;

	fetchAstSymbol(options: IFetchAstSymbolOptions): AstSymbol | undefined;
}

/**
 * Used with ExportAnalyzer.fetchAstModuleBySourceFile() to provide contextual information about how the source file
 * was imported.
 */
interface IAstModuleReference {
	/**
	 * For example, if we are following a statement like `import { X } from 'some-package'`, this will be the
	 * string `"some-package"`.
	 */
	moduleSpecifier: string;

	/**
	 * For example, if we are following a statement like `import { X } from 'some-package'`, this will be the
	 * symbol for `X`.
	 */
	moduleSpecifierSymbol: ts.Symbol;
}

/**
 * The ExportAnalyzer is an internal part of AstSymbolTable that has been moved out into its own source file
 * because it is a complex and mostly self-contained algorithm.
 *
 * Its job is to build up AstModule objects by crawling import statements to discover where declarations come from.
 * This is conceptually the same as the compiler's own TypeChecker.getExportsOfModule(), except that when
 * ExportAnalyzer encounters a declaration that was imported from an external package, it remembers how it was imported
 * (i.e. the AstImport object).  Today the compiler API does not expose this information, which is crucial for
 * generating .d.ts rollups.
 */
export class ExportAnalyzer {
	private readonly _program: ts.Program;

	private readonly _typeChecker: ts.TypeChecker;

	private readonly _bundledPackageNames: ReadonlySet<string>;

	private readonly _astSymbolTable: IAstSymbolTable;

	private readonly _astModulesByModuleSymbol: Map<ts.Symbol, AstModule> = new Map<ts.Symbol, AstModule>();

	// Used with isImportableAmbientSourceFile()
	private readonly _importableAmbientSourceFiles: Set<ts.SourceFile> = new Set<ts.SourceFile>();

	private readonly _astImportsByKey: Map<string, AstImport> = new Map<string, AstImport>();

	private readonly _astNamespaceImportByModule: Map<AstModule, AstNamespaceImport> = new Map();

	public constructor(
		program: ts.Program,
		typeChecker: ts.TypeChecker,
		bundledPackageNames: ReadonlySet<string>,
		astSymbolTable: IAstSymbolTable,
	) {
		this._program = program;
		this._typeChecker = typeChecker;
		this._bundledPackageNames = bundledPackageNames;
		this._astSymbolTable = astSymbolTable;
	}

	/**
	 * For a given source file, this analyzes all of its exports and produces an AstModule object.
	 *
	 * @param sourceFile - the sourceFile
	 * @param moduleReference - contextual information about the import statement that took us to this source file.
	 * or `undefined` if this source file is the initial entry point
	 * @param isExternal - whether the given `moduleReference` is external.
	 */
	public fetchAstModuleFromSourceFile(
		sourceFile: ts.SourceFile,
		moduleReference: IAstModuleReference | undefined,
		isExternal: boolean,
	): AstModule {
		const moduleSymbol: ts.Symbol = this._getModuleSymbolFromSourceFile(sourceFile, moduleReference);

		// Don't traverse into a module that we already processed before:
		// The compiler allows m1 to have "export * from 'm2'" and "export * from 'm3'",
		// even if m2 and m3 both have "export * from 'm4'".
		let astModule: AstModule | undefined = this._astModulesByModuleSymbol.get(moduleSymbol);
		if (!astModule) {
			// (If moduleReference === undefined, then this is the entry point of the local project being analyzed.)
			const externalModulePath: string | undefined =
				moduleReference !== undefined && isExternal ? moduleReference.moduleSpecifier : undefined;

			astModule = new AstModule({ sourceFile, moduleSymbol, externalModulePath });

			this._astModulesByModuleSymbol.set(moduleSymbol, astModule);

			if (astModule.isExternal) {
				// It's an external package, so do the special simplified analysis that doesn't crawl into referenced modules
				for (const exportedSymbol of this._typeChecker.getExportsOfModule(moduleSymbol)) {
					if (externalModulePath === undefined) {
						throw new InternalError('Failed assertion: externalModulePath=undefined but astModule.isExternal=true');
					}

					const followedSymbol: ts.Symbol = TypeScriptHelpers.followAliases(exportedSymbol, this._typeChecker);

					// Ignore virtual symbols that don't have any declarations
					const arbitraryDeclaration: ts.Declaration | undefined = TypeScriptHelpers.tryGetADeclaration(followedSymbol);
					if (arbitraryDeclaration) {
						const astSymbol: AstSymbol | undefined = this._astSymbolTable.fetchAstSymbol({
							followedSymbol,
							isExternal: astModule.isExternal,
							includeNominalAnalysis: true,
							addIfMissing: true,
						});

						if (!astSymbol) {
							throw new Error(
								`Unsupported export ${JSON.stringify(exportedSymbol.name)}:\n` +
									SourceFileLocationFormatter.formatDeclaration(arbitraryDeclaration),
							);
						}

						astModule.cachedExportedEntities.set(exportedSymbol.name, astSymbol);
					}
				}
			} else if (moduleSymbol.exports) {
				// The module is part of the local project, so do the full analysis
				// The "export * from 'module-name';" declarations are all attached to a single virtual symbol
				// whose name is InternalSymbolName.ExportStar
				const exportStarSymbol: ts.Symbol | undefined = moduleSymbol.exports.get(ts.InternalSymbolName.ExportStar);
				if (exportStarSymbol) {
					for (const exportStarDeclaration of exportStarSymbol.getDeclarations() ?? []) {
						if (ts.isExportDeclaration(exportStarDeclaration)) {
							const starExportedModule: AstModule | undefined = this._fetchSpecifierAstModule(
								exportStarDeclaration,
								exportStarSymbol,
							);

							if (starExportedModule !== undefined) {
								astModule.starExportedModules.add(starExportedModule);
							}
						} else {
							// Ignore ExportDeclaration nodes that don't match the expected pattern
							// Should we report a warning?
						}
					}
				}
			}
		}

		return astModule;
	}

	/**
	 * Retrieves the symbol for the module corresponding to the ts.SourceFile that is being imported/exported.
	 *
	 * @remarks
	 * The `module` keyword can be used to declare multiple TypeScript modules inside a single source file.
	 * (This is a deprecated construct and mainly used for typings such as `@types/node`.)  In this situation,
	 * `moduleReference` helps us to fish out the correct module symbol.
	 */
	private _getModuleSymbolFromSourceFile(
		sourceFile: ts.SourceFile,
		moduleReference: IAstModuleReference | undefined,
	): ts.Symbol {
		const moduleSymbol: ts.Symbol | undefined = TypeScriptInternals.tryGetSymbolForDeclaration(
			sourceFile,
			this._typeChecker,
		);
		if (moduleSymbol !== undefined) {
			// This is the normal case.  The SourceFile acts is a module and has a symbol.
			return moduleSymbol;
		}

		if (
			moduleReference !== undefined && // But there is also an elaborate case where the source file contains one or more "module" declarations,
			// and our moduleReference took us to one of those.

			(moduleReference.moduleSpecifierSymbol.flags & ts.SymbolFlags.Alias) !== 0
		) {
			// Follow the import/export declaration to one hop the exported item inside the target module
			let followedSymbol: ts.Symbol | undefined = this._typeChecker.getImmediateAliasedSymbol(
				moduleReference.moduleSpecifierSymbol,
			);

			if (followedSymbol === undefined) {
				// This is a workaround for a compiler bug where getImmediateAliasedSymbol() sometimes returns undefined
				followedSymbol = this._typeChecker.getAliasedSymbol(moduleReference.moduleSpecifierSymbol);
			}

			if (followedSymbol !== undefined && followedSymbol !== moduleReference.moduleSpecifierSymbol) {
				// The parent of the exported symbol will be the module that we're importing from
				const parent: ts.Symbol | undefined = TypeScriptInternals.getSymbolParent(followedSymbol);
				if (
					parent !== undefined && // Make sure the thing we found is a module
					(parent.flags & ts.SymbolFlags.ValueModule) !== 0
				) {
					// Record that that this is an ambient module that can also be imported from
					this._importableAmbientSourceFiles.add(sourceFile);
					return parent;
				}
			}
		}

		throw new InternalError('Unable to determine module for: ' + sourceFile.fileName);
	}

	/**
	 * Implementation of {@link AstSymbolTable.fetchAstModuleExportInfo}.
	 */
	public fetchAstModuleExportInfo(entryPointAstModule: AstModule): AstModuleExportInfo {
		if (entryPointAstModule.isExternal) {
			throw new Error('fetchAstModuleExportInfo() is not supported for external modules');
		}

		if (entryPointAstModule.astModuleExportInfo === undefined) {
			const astModuleExportInfo: AstModuleExportInfo = new AstModuleExportInfo();

			this._collectAllExportsRecursive(astModuleExportInfo, entryPointAstModule, new Set<AstModule>());

			entryPointAstModule.astModuleExportInfo = astModuleExportInfo;
		}

		return entryPointAstModule.astModuleExportInfo;
	}

	/**
	 * Returns true if the module specifier refers to an external package.  Ignores packages listed in the
	 * "bundledPackages" setting from the api-extractor.json config file.
	 */
	private _isExternalModulePath(
		importOrExportDeclaration: ts.ExportDeclaration | ts.ImportDeclaration | ts.ImportTypeNode,
		moduleSpecifier: string,
	): boolean {
		const specifier: ts.Expression | ts.TypeNode | undefined = ts.isImportTypeNode(importOrExportDeclaration)
			? importOrExportDeclaration.argument
			: importOrExportDeclaration.moduleSpecifier;
		const mode: ts.ModuleKind.CommonJS | ts.ModuleKind.ESNext | undefined =
			specifier && ts.isStringLiteralLike(specifier)
				? ts.getModeForUsageLocation(
						importOrExportDeclaration.getSourceFile(),
						specifier,
						this._program.getCompilerOptions(),
					)
				: undefined;

		const resolvedModule: ts.ResolvedModuleFull | undefined = TypeScriptInternals.getResolvedModule(
			this._program,
			importOrExportDeclaration.getSourceFile(),
			moduleSpecifier,
			mode,
		);

		if (resolvedModule === undefined) {
			// The TS compiler API `getResolvedModule` cannot resolve ambient modules. Thus, to match API Extractor's
			// previous behavior, simply treat all ambient modules as external. This bug is tracked by
			// https://github.com/microsoft/rushstack/issues/3335.
			return true;
		}

		// Either something like `jquery` or `@microsoft/api-extractor`.
		const packageName: string | undefined = resolvedModule.packageId?.name;
		if (packageName !== undefined && this._bundledPackageNames.has(packageName)) {
			return false;
		}

		if (resolvedModule.isExternalLibraryImport === undefined) {
			// This presumably means the compiler couldn't figure out whether the module was external, but we're not
			// sure how this can happen.
			throw new InternalError(
				`Cannot determine whether the module ${JSON.stringify(moduleSpecifier)} is external\n` +
					SourceFileLocationFormatter.formatDeclaration(importOrExportDeclaration),
			);
		}

		return resolvedModule.isExternalLibraryImport;
	}

	/**
	 * Returns true if when we analyzed sourceFile, we found that it contains an "export=" statement that allows
	 * it to behave /either/ as an ambient module /or/ as a regular importable module.  In this case,
	 * `AstSymbolTable._fetchAstSymbol()` will analyze its symbols even though `TypeScriptHelpers.isAmbient()`
	 * returns true.
	 */
	public isImportableAmbientSourceFile(sourceFile: ts.SourceFile): boolean {
		return this._importableAmbientSourceFiles.has(sourceFile);
	}

	private _collectAllExportsRecursive(
		astModuleExportInfo: AstModuleExportInfo,
		astModule: AstModule,
		visitedAstModules: Set<AstModule>,
	): void {
		if (visitedAstModules.has(astModule)) {
			return;
		}

		visitedAstModules.add(astModule);

		if (astModule.isExternal) {
			astModuleExportInfo.starExportedExternalModules.add(astModule);
		} else {
			// Fetch each of the explicit exports for this module
			if (astModule.moduleSymbol.exports) {
				for (const [exportName, exportSymbol] of astModule.moduleSymbol.exports.entries()) {
					switch (exportName) {
						case ts.InternalSymbolName.ExportStar:
						case ts.InternalSymbolName.ExportEquals:
							break;
						default:
							// Don't collect the "export default" symbol unless this is the entry point module
							if (
								(exportName !== ts.InternalSymbolName.Default || visitedAstModules.size === 1) &&
								!astModuleExportInfo.exportedLocalEntities.has(exportSymbol.name)
							) {
								const astEntity: AstEntity = this._getExportOfAstModule(exportSymbol.name, astModule);

								if (astEntity instanceof AstSymbol && !astEntity.isExternal) {
									this._astSymbolTable.analyze(astEntity);
								}

								if (astEntity instanceof AstNamespaceImport && !astEntity.astModule.isExternal) {
									this._astSymbolTable.analyze(astEntity);
								}

								astModuleExportInfo.exportedLocalEntities.set(exportSymbol.name, astEntity);
							}

							break;
					}
				}
			}

			for (const starExportedModule of astModule.starExportedModules) {
				this._collectAllExportsRecursive(astModuleExportInfo, starExportedModule, visitedAstModules);
			}
		}
	}

	/**
	 * For a given symbol (which was encountered in the specified sourceFile), this fetches the AstEntity that it
	 * refers to.  For example, if a particular interface describes the return value of a function, this API can help
	 * us determine a TSDoc declaration reference for that symbol (if the symbol is exported).
	 */
	public fetchReferencedAstEntity(symbol: ts.Symbol, referringModuleIsExternal: boolean): AstEntity | undefined {
		if ((symbol.flags & ts.SymbolFlags.FunctionScopedVariable) !== 0) {
			// If a symbol refers back to part of its own definition, don't follow that rabbit hole
			// Example:
			//
			// function f(x: number): typeof x {
			//    return 123;
			// }
			return undefined;
		}

		let current: ts.Symbol = symbol;

		if (referringModuleIsExternal) {
			current = TypeScriptHelpers.followAliases(symbol, this._typeChecker);
		} else {
			for (;;) {
				// Is this symbol an import/export that we need to follow to find the real declaration?
				for (const declaration of current.declarations ?? []) {
					let matchedAstEntity: AstEntity | undefined;
					matchedAstEntity = this._tryMatchExportDeclaration(declaration, current);
					if (matchedAstEntity !== undefined) {
						return matchedAstEntity;
					}

					matchedAstEntity = this._tryMatchImportDeclaration(declaration, current);
					if (matchedAstEntity !== undefined) {
						return matchedAstEntity;
					}
				}

				if (!(current.flags & ts.SymbolFlags.Alias)) {
					break;
				}

				const currentAlias: ts.Symbol | undefined = this._typeChecker.getImmediateAliasedSymbol(current);
				// Stop if we reach the end of the chain
				if (!currentAlias || currentAlias === current) {
					break;
				}

				current = currentAlias;
			}
		}

		// Otherwise, assume it is a normal declaration
		const astSymbol: AstSymbol | undefined = this._astSymbolTable.fetchAstSymbol({
			followedSymbol: current,
			isExternal: referringModuleIsExternal,
			includeNominalAnalysis: false,
			addIfMissing: true,
		});

		return astSymbol;
	}

	public fetchReferencedAstEntityFromImportTypeNode(
		node: ts.ImportTypeNode,
		referringModuleIsExternal: boolean,
	): AstEntity | undefined {
		const externalModulePath: string | undefined = this._tryGetExternalModulePath(node);

		if (externalModulePath) {
			let exportName: string;
			if (node.qualifier) {
				// Example input:
				//   import('api-extractor-lib1-test').Lib1GenericType<number>
				//
				// Extracted qualifier:
				//   Lib1GenericType
				exportName = node.qualifier.getText().trim();
			} else {
				// Example input:
				//   import('api-extractor-lib1-test')
				//
				// Extracted qualifier:
				//   apiExtractorLib1Test

				exportName = SyntaxHelpers.makeCamelCaseIdentifier(externalModulePath);
			}

			return this._fetchAstImport(undefined, {
				importKind: AstImportKind.ImportType,
				exportName,
				modulePath: externalModulePath,
				isTypeOnly: false,
			});
		}

		// Internal reference: AstSymbol
		const rightMostToken: ts.Identifier | ts.ImportTypeNode = node.qualifier
			? node.qualifier.kind === ts.SyntaxKind.QualifiedName
				? node.qualifier.right
				: node.qualifier
			: node;

		// There is no symbol property in a ImportTypeNode, obtain the associated export symbol
		const exportSymbol: ts.Symbol | undefined = this._typeChecker.getSymbolAtLocation(rightMostToken);
		if (!exportSymbol) {
			throw new InternalError(
				`Symbol not found for identifier: ${node.getText()}\n` + SourceFileLocationFormatter.formatDeclaration(node),
			);
		}

		let followedSymbol: ts.Symbol = exportSymbol;
		for (;;) {
			const referencedAstEntity: AstEntity | undefined = this.fetchReferencedAstEntity(
				followedSymbol,
				referringModuleIsExternal,
			);

			if (referencedAstEntity) {
				return referencedAstEntity;
			}

			const followedSymbolNode: ts.ImportTypeNode | ts.Node | undefined =
				followedSymbol.declarations && (followedSymbol.declarations[0] as ts.Node | undefined);

			if (followedSymbolNode && followedSymbolNode.kind === ts.SyntaxKind.ImportType) {
				return this.fetchReferencedAstEntityFromImportTypeNode(
					followedSymbolNode as ts.ImportTypeNode,
					referringModuleIsExternal,
				);
			}

			if (!(followedSymbol.flags & ts.SymbolFlags.Alias)) {
				break;
			}

			const currentAlias: ts.Symbol = this._typeChecker.getAliasedSymbol(followedSymbol);
			if (!currentAlias || currentAlias === followedSymbol) {
				break;
			}

			followedSymbol = currentAlias;
		}

		const astSymbol: AstSymbol | undefined = this._astSymbolTable.fetchAstSymbol({
			followedSymbol,
			isExternal: referringModuleIsExternal,
			includeNominalAnalysis: false,
			addIfMissing: true,
		});

		return astSymbol;
	}

	private _tryMatchExportDeclaration(declaration: ts.Declaration, declarationSymbol: ts.Symbol): AstEntity | undefined {
		const exportDeclaration: ts.ExportDeclaration | undefined = TypeScriptHelpers.findFirstParent<ts.ExportDeclaration>(
			declaration,
			ts.SyntaxKind.ExportDeclaration,
		);

		if (exportDeclaration) {
			let exportName: string | undefined;

			if (declaration.kind === ts.SyntaxKind.ExportSpecifier) {
				// EXAMPLE:
				// "export { A } from './file-a';"
				//
				// ExportDeclaration:
				//   ExportKeyword:  pre=[export] sep=[ ]
				//   NamedExports:
				//     FirstPunctuation:  pre=[{] sep=[ ]
				//     SyntaxList:
				//       ExportSpecifier:  <------------- declaration
				//         Identifier:  pre=[A] sep=[ ]
				//     CloseBraceToken:  pre=[}] sep=[ ]
				//   FromKeyword:  pre=[from] sep=[ ]
				//   StringLiteral:  pre=['./file-a']
				//   SemicolonToken:  pre=[;]

				// Example: " ExportName as RenamedName"
				const exportSpecifier: ts.ExportSpecifier = declaration as ts.ExportSpecifier;
				exportName = (exportSpecifier.propertyName ?? exportSpecifier.name).getText().trim();
			} else if (declaration.kind === ts.SyntaxKind.NamespaceExport) {
				// EXAMPLE:
				// "export * as theLib from 'the-lib';"
				//
				// ExportDeclaration:
				//   ExportKeyword:  pre=[export] sep=[ ]
				//   NamespaceExport:
				//     AsteriskToken:  pre=[*] sep=[ ]
				//     AsKeyword:  pre=[as] sep=[ ]
				//     Identifier:  pre=[theLib] sep=[ ]
				//   FromKeyword:  pre=[from] sep=[ ]
				//   StringLiteral:  pre=['the-lib']
				//   SemicolonToken:  pre=[;]

				// Issue tracking this feature: https://github.com/microsoft/rushstack/issues/2780
				const namespaceExport: ts.NamespaceExport = declaration as ts.NamespaceExport;
				exportName = namespaceExport.name.getText().trim();
				// throw new Error(
				// 	`The "export * as ___" syntax is not supported yet; as a workaround,` +
				// 		` use "import * as ___" with a separate "export { ___ }" declaration\n` +
				// 		SourceFileLocationFormatter.formatDeclaration(declaration),
				// );
			} else {
				throw new InternalError(
					`Unimplemented export declaration kind: ${declaration.getText()}\n` +
						SourceFileLocationFormatter.formatDeclaration(declaration),
				);
			}

			// Ignore "export { A }" without a module specifier
			if (exportDeclaration.moduleSpecifier) {
				const externalModulePath: string | undefined = this._tryGetExternalModulePath(exportDeclaration);

				if (declaration.kind === ts.SyntaxKind.NamespaceExport) {
					if (externalModulePath === undefined) {
						const astModule: AstModule = this._fetchSpecifierAstModule(exportDeclaration, declarationSymbol);
						let namespaceImport: AstNamespaceImport | undefined = this._astNamespaceImportByModule.get(astModule);
						if (namespaceImport === undefined) {
							namespaceImport = new AstNamespaceImport({
								namespaceName: declarationSymbol.name,
								astModule,
								declaration,
								symbol: declarationSymbol,
							});
							this._astNamespaceImportByModule.set(astModule, namespaceImport);
						}

						return namespaceImport;
					}

					// Here importSymbol=undefined because {@inheritDoc} and such are not going to work correctly for
					// a package or source file.
					return this._fetchAstImport(undefined, {
						importKind: AstImportKind.StarImport,
						exportName,
						modulePath: externalModulePath,
						isTypeOnly: exportDeclaration.isTypeOnly,
					});
				}

				if (externalModulePath !== undefined) {
					return this._fetchAstImport(declarationSymbol, {
						importKind: AstImportKind.NamedImport,
						modulePath: externalModulePath,
						exportName,
						isTypeOnly: false,
					});
				}

				return this._getExportOfSpecifierAstModule(exportName, exportDeclaration, declarationSymbol);
			}
		}

		return undefined;
	}

	private _tryMatchImportDeclaration(declaration: ts.Declaration, declarationSymbol: ts.Symbol): AstEntity | undefined {
		const importDeclaration: ts.ImportDeclaration | undefined = TypeScriptHelpers.findFirstParent<ts.ImportDeclaration>(
			declaration,
			ts.SyntaxKind.ImportDeclaration,
		);

		if (importDeclaration) {
			const externalModulePath: string | undefined = this._tryGetExternalModulePath(importDeclaration);

			if (declaration.kind === ts.SyntaxKind.NamespaceImport) {
				// EXAMPLE:
				// "import * as theLib from 'the-lib';"
				//
				// ImportDeclaration:
				//   ImportKeyword:  pre=[import] sep=[ ]
				//   ImportClause:
				//     NamespaceImport:  <------------- declaration
				//       AsteriskToken:  pre=[*] sep=[ ]
				//       AsKeyword:  pre=[as] sep=[ ]
				//       Identifier:  pre=[theLib] sep=[ ]
				//   FromKeyword:  pre=[from] sep=[ ]
				//   StringLiteral:  pre=['the-lib']
				//   SemicolonToken:  pre=[;]

				if (externalModulePath === undefined) {
					const astModule: AstModule = this._fetchSpecifierAstModule(importDeclaration, declarationSymbol);
					let namespaceImport: AstNamespaceImport | undefined = this._astNamespaceImportByModule.get(astModule);
					if (namespaceImport === undefined) {
						namespaceImport = new AstNamespaceImport({
							namespaceName: declarationSymbol.name,
							astModule,
							declaration,
							symbol: declarationSymbol,
						});
						this._astNamespaceImportByModule.set(astModule, namespaceImport);
					}

					return namespaceImport;
				}

				// Here importSymbol=undefined because {@inheritDoc} and such are not going to work correctly for
				// a package or source file.
				return this._fetchAstImport(undefined, {
					importKind: AstImportKind.StarImport,
					exportName: declarationSymbol.name,
					modulePath: externalModulePath,
					isTypeOnly: ExportAnalyzer._getIsTypeOnly(importDeclaration),
				});
			}

			if (declaration.kind === ts.SyntaxKind.ImportSpecifier) {
				// EXAMPLE:
				// "import { A, B } from 'the-lib';"
				//
				// ImportDeclaration:
				//   ImportKeyword:  pre=[import] sep=[ ]
				//   ImportClause:
				//     NamedImports:
				//       FirstPunctuation:  pre=[{] sep=[ ]
				//       SyntaxList:
				//         ImportSpecifier:  <------------- declaration
				//           Identifier:  pre=[A]
				//         CommaToken:  pre=[,] sep=[ ]
				//         ImportSpecifier:
				//           Identifier:  pre=[B] sep=[ ]
				//       CloseBraceToken:  pre=[}] sep=[ ]
				//   FromKeyword:  pre=[from] sep=[ ]
				//   StringLiteral:  pre=['the-lib']
				//   SemicolonToken:  pre=[;]

				// Example: " ExportName as RenamedName"
				const importSpecifier: ts.ImportSpecifier = declaration as ts.ImportSpecifier;
				const exportName: string = (importSpecifier.propertyName ?? importSpecifier.name).getText().trim();

				if (externalModulePath !== undefined) {
					return this._fetchAstImport(declarationSymbol, {
						importKind: AstImportKind.NamedImport,
						modulePath: externalModulePath,
						exportName,
						isTypeOnly: ExportAnalyzer._getIsTypeOnly(importDeclaration),
					});
				}

				return this._getExportOfSpecifierAstModule(exportName, importDeclaration, declarationSymbol);
			} else if (declaration.kind === ts.SyntaxKind.ImportClause) {
				// EXAMPLE:
				// "import A, { B } from './A';"
				//
				// ImportDeclaration:
				//   ImportKeyword:  pre=[import] sep=[ ]
				//   ImportClause:  <------------- declaration (referring to A)
				//     Identifier:  pre=[A]
				//     CommaToken:  pre=[,] sep=[ ]
				//     NamedImports:
				//       FirstPunctuation:  pre=[{] sep=[ ]
				//       SyntaxList:
				//         ImportSpecifier:
				//           Identifier:  pre=[B] sep=[ ]
				//       CloseBraceToken:  pre=[}] sep=[ ]
				//   FromKeyword:  pre=[from] sep=[ ]
				//   StringLiteral:  pre=['./A']
				//   SemicolonToken:  pre=[;]

				const importClause: ts.ImportClause = declaration as ts.ImportClause;
				const exportName: string = importClause.name
					? importClause.name.getText().trim()
					: ts.InternalSymbolName.Default;

				if (externalModulePath !== undefined) {
					return this._fetchAstImport(declarationSymbol, {
						importKind: AstImportKind.DefaultImport,
						modulePath: externalModulePath,
						exportName,
						isTypeOnly: ExportAnalyzer._getIsTypeOnly(importDeclaration),
					});
				}

				return this._getExportOfSpecifierAstModule(ts.InternalSymbolName.Default, importDeclaration, declarationSymbol);
			} else {
				throw new InternalError(
					`Unimplemented import declaration kind: ${declaration.getText()}\n` +
						SourceFileLocationFormatter.formatDeclaration(declaration),
				);
			}
		}

		if (
			ts.isImportEqualsDeclaration(declaration) && // EXAMPLE:
			// import myLib = require('my-lib');
			//
			// ImportEqualsDeclaration:
			//   ImportKeyword:  pre=[import] sep=[ ]
			//   Identifier:  pre=[myLib] sep=[ ]
			//   FirstAssignment:  pre=[=] sep=[ ]
			//   ExternalModuleReference:
			//     RequireKeyword:  pre=[require]
			//     OpenParenToken:  pre=[(]
			//     StringLiteral:  pre=['my-lib']
			//     CloseParenToken:  pre=[)]
			//   SemicolonToken:  pre=[;]
			ts.isExternalModuleReference(declaration.moduleReference) &&
			ts.isStringLiteralLike(declaration.moduleReference.expression)
		) {
			const variableName: string = TypeScriptInternals.getTextOfIdentifierOrLiteral(declaration.name);
			const externalModuleName: string = TypeScriptInternals.getTextOfIdentifierOrLiteral(
				declaration.moduleReference.expression,
			);

			return this._fetchAstImport(declarationSymbol, {
				importKind: AstImportKind.EqualsImport,
				modulePath: externalModuleName,
				exportName: variableName,
				isTypeOnly: false,
			});
		}

		return undefined;
	}

	private static _getIsTypeOnly(importDeclaration: ts.ImportDeclaration): boolean {
		if (importDeclaration.importClause) {
			return Boolean(importDeclaration.importClause.isTypeOnly);
		}

		return false;
	}

	private _getExportOfSpecifierAstModule(
		exportName: string,
		importOrExportDeclaration: ts.ExportDeclaration | ts.ImportDeclaration,
		exportSymbol: ts.Symbol,
	): AstEntity {
		const specifierAstModule: AstModule = this._fetchSpecifierAstModule(importOrExportDeclaration, exportSymbol);
		const astEntity: AstEntity = this._getExportOfAstModule(exportName, specifierAstModule);
		return astEntity;
	}

	private _getExportOfAstModule(exportName: string, astModule: AstModule): AstEntity {
		const visitedAstModules: Set<AstModule> = new Set<AstModule>();
		const astEntity: AstEntity | undefined = this._tryGetExportOfAstModule(exportName, astModule, visitedAstModules);
		if (astEntity === undefined) {
			throw new InternalError(
				`Unable to analyze the export ${JSON.stringify(exportName)} in\n` + astModule.sourceFile.fileName,
			);
		}

		return astEntity;
	}

	/**
	 * Implementation of {@link AstSymbolTable.tryGetExportOfAstModule}.
	 */
	public tryGetExportOfAstModule(exportName: string, astModule: AstModule): AstEntity | undefined {
		const visitedAstModules: Set<AstModule> = new Set<AstModule>();
		return this._tryGetExportOfAstModule(exportName, astModule, visitedAstModules);
	}

	private _tryGetExportOfAstModule(
		exportName: string,
		astModule: AstModule,
		visitedAstModules: Set<AstModule>,
	): AstEntity | undefined {
		if (visitedAstModules.has(astModule)) {
			return undefined;
		}

		visitedAstModules.add(astModule);

		let astEntity: AstEntity | undefined = astModule.cachedExportedEntities.get(exportName);
		if (astEntity !== undefined) {
			return astEntity;
		}

		// Try the explicit exports
		const escapedExportName: ts.__String = ts.escapeLeadingUnderscores(exportName);
		if (astModule.moduleSymbol.exports) {
			const exportSymbol: ts.Symbol | undefined = astModule.moduleSymbol.exports.get(escapedExportName);
			if (exportSymbol) {
				astEntity = this.fetchReferencedAstEntity(exportSymbol, astModule.isExternal);

				if (astEntity !== undefined) {
					astModule.cachedExportedEntities.set(exportName, astEntity); // cache for next time
					return astEntity;
				}
			}
		}

		// Try each of the star imports
		for (const starExportedModule of astModule.starExportedModules) {
			astEntity = this._tryGetExportOfAstModule(exportName, starExportedModule, visitedAstModules);

			if (astEntity !== undefined) {
				if (starExportedModule.externalModulePath !== undefined) {
					// This entity was obtained from an external module, so return an AstImport instead
					const astSymbol: AstSymbol = astEntity as AstSymbol;
					return this._fetchAstImport(astSymbol.followedSymbol, {
						importKind: AstImportKind.NamedImport,
						modulePath: starExportedModule.externalModulePath,
						exportName,
						isTypeOnly: false,
					});
				}

				return astEntity;
			}
		}

		return undefined;
	}

	private _tryGetExternalModulePath(
		importOrExportDeclaration: ts.ExportDeclaration | ts.ImportDeclaration | ts.ImportTypeNode,
	): string | undefined {
		const moduleSpecifier: string = this._getModuleSpecifier(importOrExportDeclaration);
		if (this._isExternalModulePath(importOrExportDeclaration, moduleSpecifier)) {
			return moduleSpecifier;
		}

		return undefined;
	}

	/**
	 * Given an ImportDeclaration of the form `export { X } from "___";`, this interprets the module specifier (`"___"`)
	 * and fetches the corresponding AstModule object.
	 */
	private _fetchSpecifierAstModule(
		importOrExportDeclaration: ts.ExportDeclaration | ts.ImportDeclaration,
		exportSymbol: ts.Symbol,
	): AstModule {
		const moduleSpecifier: string = this._getModuleSpecifier(importOrExportDeclaration);
		const mode: ts.ModuleKind.CommonJS | ts.ModuleKind.ESNext | undefined =
			importOrExportDeclaration.moduleSpecifier && ts.isStringLiteralLike(importOrExportDeclaration.moduleSpecifier)
				? ts.getModeForUsageLocation(
						importOrExportDeclaration.getSourceFile(),
						importOrExportDeclaration.moduleSpecifier,
						this._program.getCompilerOptions(),
					)
				: undefined;
		const resolvedModule: ts.ResolvedModuleFull | undefined = TypeScriptInternals.getResolvedModule(
			this._program,
			importOrExportDeclaration.getSourceFile(),
			moduleSpecifier,
			mode,
		);

		if (resolvedModule === undefined) {
			// Encountered in https://github.com/microsoft/rushstack/issues/1914.
			//
			// It's also possible for this to occur with ambient modules. However, in practice this doesn't happen
			// as API Extractor treats all ambient modules as external per the logic in `_isExternalModulePath`, and
			// thus this code path is never reached for ambient modules.
			throw new InternalError(
				`getResolvedModule() could not resolve module name ${JSON.stringify(moduleSpecifier)}\n` +
					SourceFileLocationFormatter.formatDeclaration(importOrExportDeclaration),
			);
		}

		// Map the filename back to the corresponding SourceFile. This circuitous approach is needed because
		// we have no way to access the compiler's internal resolveExternalModuleName() function
		const moduleSourceFile: ts.SourceFile | undefined = this._program.getSourceFile(resolvedModule.resolvedFileName);
		if (!moduleSourceFile) {
			// This should not happen, since getResolvedModule() specifically looks up names that the compiler
			// found in export declarations for this source file
			throw new InternalError(
				`getSourceFile() failed to locate ${JSON.stringify(resolvedModule.resolvedFileName)}\n` +
					SourceFileLocationFormatter.formatDeclaration(importOrExportDeclaration),
			);
		}

		const isExternal: boolean = this._isExternalModulePath(importOrExportDeclaration, moduleSpecifier);
		const moduleReference: IAstModuleReference = {
			moduleSpecifier,
			moduleSpecifierSymbol: exportSymbol,
		};
		const specifierAstModule: AstModule = this.fetchAstModuleFromSourceFile(
			moduleSourceFile,
			moduleReference,
			isExternal,
		);

		return specifierAstModule;
	}

	private _fetchAstImport(importSymbol: ts.Symbol | undefined, options: IAstImportOptions): AstImport {
		const key: string = AstImport.getKey(options);

		let astImport: AstImport | undefined = this._astImportsByKey.get(key);

		if (astImport) {
			// If we encounter at least one import that does not use the type-only form,
			// then the .d.ts rollup will NOT use "import type".
			if (!options.isTypeOnly) {
				astImport.isTypeOnlyEverywhere = false;
			}
		} else {
			astImport = new AstImport(options);
			this._astImportsByKey.set(key, astImport);

			if (importSymbol) {
				const followedSymbol: ts.Symbol = TypeScriptHelpers.followAliases(importSymbol, this._typeChecker);

				astImport.astSymbol = this._astSymbolTable.fetchAstSymbol({
					followedSymbol,
					isExternal: true,
					includeNominalAnalysis: false,
					addIfMissing: true,
				});
			}
		}

		return astImport;
	}

	private _getModuleSpecifier(
		importOrExportDeclaration: ts.ExportDeclaration | ts.ImportDeclaration | ts.ImportTypeNode,
	): string {
		// The name of the module, which could be like "./SomeLocalFile' or like 'external-package/entry/point'
		const moduleSpecifier: string | undefined = TypeScriptHelpers.getModuleSpecifier(importOrExportDeclaration);

		if (!moduleSpecifier) {
			throw new InternalError(
				'Unable to parse module specifier\n' + SourceFileLocationFormatter.formatDeclaration(importOrExportDeclaration),
			);
		}

		return moduleSpecifier;
	}
}
