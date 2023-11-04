// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type { ReleaseTag } from '@discordjs/api-extractor-model';

/**
 * Constructor parameters for `SymbolMetadata`.
 */
export interface ISymbolMetadataOptions {
	maxEffectiveReleaseTag: ReleaseTag;
}

/**
 * Stores the Collector's additional analysis for an `AstSymbol`.  This object is assigned to `AstSymbol.metadata`
 * but consumers must always obtain it by calling `Collector.fetchSymbolMetadata()`.
 */
export class SymbolMetadata {
	// For all declarations associated with this symbol, this is the
	// `ApiItemMetadata.effectiveReleaseTag` value that is most public.
	public readonly maxEffectiveReleaseTag: ReleaseTag;

	public constructor(options: ISymbolMetadataOptions) {
		this.maxEffectiveReleaseTag = options.maxEffectiveReleaseTag;
	}
}
