// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { DeclarationReference } from '@microsoft/tsdoc/lib-commonjs/beta/DeclarationReference.js';
import { ApiItem, ApiItemKind } from '../items/ApiItem.js';
import { ApiItemContainerMixin, type IApiItemContainerMixinOptions } from '../mixins/ApiItemContainerMixin.js';
import { type IApiNameMixinOptions, ApiNameMixin } from '../mixins/ApiNameMixin.js';
import { ApiPackage } from './ApiPackage.js';

/**
 * Constructor options for {@link ApiEntryPoint}.
 *
 * @public
 */
export interface IApiEntryPointOptions extends IApiItemContainerMixinOptions, IApiNameMixinOptions {}

/**
 * Represents the entry point for an NPM package.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 *
 * `ApiEntryPoint` represents the entry point to an NPM package.  API Extractor does not currently support
 * analysis of multiple entry points, but the `ApiEntryPoint` object is included to support a future feature.
 * In the current implementation, `ApiEntryPoint.importPath` is always the empty string.
 *
 * For example, suppose the package.json file looks like this:
 *
 * ```json
 * {
 *   "name": "example-library",
 *   "version": "1.0.0",
 *   "main": "./lib/index.js",
 *   "typings": "./lib/index.d.ts"
 * }
 * ```
 *
 * In this example, the `ApiEntryPoint` would represent the TypeScript module for `./lib/index.js`.
 * @public
 */
export class ApiEntryPoint extends ApiItemContainerMixin(ApiNameMixin(ApiItem)) {
	public constructor(options: IApiEntryPointOptions) {
		super(options);
	}

	/**
	 * @override
	 */
	public override get kind(): ApiItemKind {
		return ApiItemKind.EntryPoint;
	}

	/**
	 * @override
	 */
	public override get containerKey(): string {
		// No prefix needed, because ApiEntryPoint is the only possible member of an ApiPackage
		return this.name;
	}

	/**
	 * The module path for this entry point, relative to the parent `ApiPackage`.  In the current implementation,
	 * this is always the empty string, indicating the default entry point.
	 *
	 * @remarks
	 *
	 * API Extractor does not currently support analysis of multiple entry points.  If that feature is implemented
	 * in the future, then the `ApiEntryPoint.importPath` will be used to distinguish different entry points,
	 * for example: `controls/Button` in `import { Button } from "example-package/controls/Button";`.
	 *
	 * The `ApiEntryPoint.name` property stores the same value as `ApiEntryPoint.importPath`.
	 */
	public get importPath(): string {
		return this.name;
	}

	/**
	 * @beta @override
	 */
	public override buildCanonicalReference(): DeclarationReference {
		if (this.parent instanceof ApiPackage) {
			return DeclarationReference.package(this.parent.name, this.importPath);
		}

		return DeclarationReference.empty();
	}
}
