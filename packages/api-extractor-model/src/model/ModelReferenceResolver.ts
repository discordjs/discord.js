// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { type DocDeclarationReference, type DocMemberSelector, SelectorKind } from '@microsoft/tsdoc';
import { type ApiItem, ApiItemKind } from '../items/ApiItem.js';
import { ApiItemContainerMixin } from '../mixins/ApiItemContainerMixin.js';
import { ApiParameterListMixin } from '../mixins/ApiParameterListMixin.js';
import type { ApiEntryPoint } from './ApiEntryPoint.js';
import type { ApiMethod } from './ApiMethod.js';
import type { ApiModel } from './ApiModel.js';
import type { ApiPackage } from './ApiPackage.js';

/**
 * Result object for {@link ApiModel.resolveDeclarationReference}.
 *
 * @public
 */
export interface IResolveDeclarationReferenceResult {
	/**
	 * If resolvedApiItem is undefined, then this will always contain an error message explaining why the
	 * resolution failed.
	 */
	errorMessage: string | undefined;

	/**
	 * The referenced ApiItem, if the declaration reference could be resolved.
	 */
	resolvedApiItem: ApiItem | undefined;
}

/**
 * This resolves a TSDoc declaration reference by walking the `ApiModel` hierarchy.
 *
 * @remarks
 *
 * This class is analogous to `AstReferenceResolver` from the `@microsoft/api-extractor` project,
 * which resolves declaration references by walking the compiler state.
 */
export class ModelReferenceResolver {
	private readonly _apiModel: ApiModel;

	public constructor(apiModel: ApiModel) {
		this._apiModel = apiModel;
	}

	public resolve(
		declarationReference: DocDeclarationReference,
		contextApiItem: ApiItem | undefined,
	): IResolveDeclarationReferenceResult {
		const result: IResolveDeclarationReferenceResult = {
			resolvedApiItem: undefined,
			errorMessage: undefined,
		};

		let apiPackage: ApiPackage | undefined;

		// Is this an absolute reference?
		if (declarationReference.packageName === undefined) {
			// If the package name is omitted, try to infer it from the context
			if (contextApiItem !== undefined) {
				apiPackage = contextApiItem.getAssociatedPackage();
			}

			if (apiPackage === undefined) {
				result.errorMessage = `The reference does not include a package name, and the package could not be inferred from the context`;
				return result;
			}
		} else {
			apiPackage = this._apiModel.tryGetPackageByName(declarationReference.packageName);
			if (apiPackage === undefined) {
				result.errorMessage = `The package "${declarationReference.packageName}" could not be located`;
				return result;
			}
		}

		const importPath: string = declarationReference.importPath ?? '';

		const foundEntryPoints: readonly ApiEntryPoint[] = apiPackage.findEntryPointsByPath(importPath);
		if (foundEntryPoints.length < 1) {
			result.errorMessage = `The import path "${importPath}" could not be resolved`;
			return result;
		}

		let currentItem: ApiItem = foundEntryPoints[0]!;

		// Now search for the member reference
		for (const memberReference of declarationReference.memberReferences) {
			if (memberReference.memberSymbol !== undefined) {
				result.errorMessage = `Symbols are not yet supported in declaration references`;
				return result;
			}

			if (memberReference.memberIdentifier === undefined) {
				result.errorMessage = `Missing member identifier`;
				return result;
			}

			const identifier: string = memberReference.memberIdentifier.identifier;

			if (!ApiItemContainerMixin.isBaseClassOf(currentItem)) {
				// For example, {@link MyClass.myMethod.X} is invalid because methods cannot contain members
				result.errorMessage = `Unable to resolve ${JSON.stringify(
					identifier,
				)} because ${currentItem.getScopedNameWithinPackage()} cannot act as a container`;
				return result;
			}

			const foundMembers: readonly ApiItem[] = currentItem.findMembersByName(identifier);
			if (foundMembers.length === 0) {
				result.errorMessage = `The member reference ${JSON.stringify(identifier)} was not found`;
				return result;
			}

			const memberSelector: DocMemberSelector | undefined = memberReference.selector;
			if (memberSelector === undefined) {
				if (foundMembers.length > 1) {
					const foundClass: ApiItem | undefined = foundMembers.find((member) => member.kind === ApiItemKind.Class);
					if (
						foundClass &&
						foundMembers.filter((member) => member.kind === ApiItemKind.Interface).length === foundMembers.length - 1
					) {
						currentItem = foundClass;
					} else if (
						foundMembers.every((member) => member.kind === ApiItemKind.Method && (member as ApiMethod).overloadIndex)
					) {
						currentItem = foundMembers.find((member) => (member as ApiMethod).overloadIndex === 1)!;
					} else {
						result.errorMessage = `The member reference ${JSON.stringify(identifier)} was ambiguous`;
						return result;
					}
				} else {
					currentItem = foundMembers[0]!;
				}
			} else {
				let memberSelectorResult: IResolveDeclarationReferenceResult;
				switch (memberSelector.selectorKind) {
					case SelectorKind.System:
						memberSelectorResult = this._selectUsingSystemSelector(foundMembers, memberSelector, identifier);
						break;
					case SelectorKind.Index:
						memberSelectorResult = this._selectUsingIndexSelector(foundMembers, memberSelector, identifier);
						break;
					default:
						result.errorMessage = `The selector "${memberSelector.selector}" is not a supported selector type`;
						return result;
				}

				if (memberSelectorResult.resolvedApiItem === undefined) {
					return memberSelectorResult;
				}

				currentItem = memberSelectorResult.resolvedApiItem;
			}
		}

		result.resolvedApiItem = currentItem;
		return result;
	}

	private _selectUsingSystemSelector(
		foundMembers: readonly ApiItem[],
		memberSelector: DocMemberSelector,
		identifier: string,
	): IResolveDeclarationReferenceResult {
		const result: IResolveDeclarationReferenceResult = {
			resolvedApiItem: undefined,
			errorMessage: undefined,
		};

		const selectorName: string = memberSelector.selector;

		let selectorItemKind: ApiItemKind;
		switch (selectorName) {
			case 'class':
				selectorItemKind = ApiItemKind.Class;
				break;
			case 'enum':
				selectorItemKind = ApiItemKind.Enum;
				break;
			case 'function':
				selectorItemKind = ApiItemKind.Function;
				break;
			case 'interface':
				selectorItemKind = ApiItemKind.Interface;
				break;
			case 'namespace':
				selectorItemKind = ApiItemKind.Namespace;
				break;
			case 'type':
				selectorItemKind = ApiItemKind.TypeAlias;
				break;
			case 'variable':
				selectorItemKind = ApiItemKind.Variable;
				break;
			default:
				result.errorMessage = `Unsupported system selector "${selectorName}"`;
				return result;
		}

		const matches: ApiItem[] = foundMembers.filter((x) => x.kind === selectorItemKind);
		if (matches.length === 0) {
			result.errorMessage = `A declaration for "${identifier}" was not found that matches the TSDoc selector "${selectorName}"`;
			return result;
		}

		if (matches.length > 1) {
			result.errorMessage = `More than one declaration "${identifier}" matches the TSDoc selector "${selectorName}"`;
		}

		result.resolvedApiItem = matches[0];
		return result;
	}

	private _selectUsingIndexSelector(
		foundMembers: readonly ApiItem[],
		memberSelector: DocMemberSelector,
		identifier: string,
	): IResolveDeclarationReferenceResult {
		const result: IResolveDeclarationReferenceResult = {
			resolvedApiItem: undefined,
			errorMessage: undefined,
		};

		const selectedMembers: ApiItem[] = [];

		const selectorOverloadIndex: number = Number.parseInt(memberSelector.selector, 10);
		for (const foundMember of foundMembers) {
			if (ApiParameterListMixin.isBaseClassOf(foundMember) && foundMember.overloadIndex === selectorOverloadIndex) {
				selectedMembers.push(foundMember);
			}
		}

		if (selectedMembers.length === 0) {
			result.errorMessage =
				`An overload for ${JSON.stringify(identifier)} was not found that matches` +
				` the TSDoc selector ":${selectorOverloadIndex}"`;
			return result;
		}

		if (selectedMembers.length === 1) {
			result.resolvedApiItem = selectedMembers[0];
			return result;
		}

		result.errorMessage = `The member reference ${JSON.stringify(identifier)} was ambiguous`;
		return result;
	}
}
