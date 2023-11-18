/* eslint-disable @typescript-eslint/prefer-literal-enum-member */
// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import type { TSDocConfiguration } from '@microsoft/tsdoc';

export enum ApiJsonSchemaVersion {
	/**
	 * The initial release.
	 */
	V_1000 = 1_000,

	/**
	 * Add support for type parameters and type alias types.
	 */
	V_1001 = 1_001,

	/**
	 * Remove `canonicalReference` field.  This field was for diagnostic purposes only and was never deserialized.
	 */
	V_1002 = 1_002,

	/**
	 * Reintroduce the `canonicalReference` field using the experimental new TSDoc declaration reference notation.
	 *
	 * This is not a breaking change because this field is never deserialized; it is provided for informational
	 * purposes only.
	 */
	V_1003 = 1_003,

	/**
	 * Add a `tsdocConfig` field that tracks the TSDoc configuration for parsing doc comments.
	 *
	 * This is not a breaking change because an older implementation will still work correctly.  The
	 * custom tags will be skipped over by the parser.
	 */
	V_1004 = 1_004,

	/**
	 * Add an `isOptional` field to `Parameter` and `TypeParameter` to track whether a function parameter is optional.
	 *
	 * When loading older JSON files, the value defaults to `false`.
	 */
	V_1005 = 1_005,

	/**
	 * Add an `isProtected` field to `ApiConstructor`, `ApiMethod`, and `ApiProperty` to
	 * track whether a class member has the `protected` modifier.
	 *
	 * Add an `isReadonly` field to `ApiProperty`, `ApiPropertySignature`, and `ApiVariable` to
	 * track whether the item is readonly.
	 *
	 * When loading older JSON files, the values default to `false`.
	 */
	V_1006 = 1_006,

	/**
	 * Add `ApiItemContainerMixin.preserveMemberOrder` to support enums that preserve their original sort order.
	 *
	 * When loading older JSON files, the value default to `false`.
	 */
	V_1007 = 1_007,

	/**
	 * Add an `initializerTokenRange` field to `ApiProperty` and `ApiVariable` to track the item's
	 * initializer.
	 *
	 * When loading older JSON files, this range is empty.
	 */
	V_1008 = 1_008,

	/**
	 * Add an `isReadonly` field to `ApiIndexSignature` to track whether the item is readonly.
	 *
	 * When loading older JSON files, the values defaults to `false`.
	 */
	V_1009 = 1_009,

	/**
	 * Add a `fileUrlPath` field to `ApiDeclaredItem` to track the URL to a declared item's source file.
	 *
	 * When loading older JSON files, the value defaults to `undefined`.
	 */
	V_1010 = 1_010,

	/**
	 * Add an `isAbstract` field to `ApiClass`, `ApiMethod`, and `ApiProperty` to
	 * track whether the item is abstract.
	 *
	 * When loading older JSON files, the value defaults to `false`.
	 */
	V_1011 = 1_011,

	/**
	 * Add a `fileLine`and `fileColumn` field to track source code location
	 */
	V_1012 = 1_012,

	/**
	 * Make tsdocConfiguration optional
	 */
	V_1013 = 1_013,

	/**
	 * The current latest .api.json schema version.
	 *
	 * IMPORTANT: When incrementing this number, consider whether `OLDEST_SUPPORTED` or `OLDEST_FORWARDS_COMPATIBLE`
	 * should be updated.
	 */
	LATEST = V_1013,

	/**
	 * The oldest .api.json schema version that is still supported for backwards compatibility.
	 *
	 * This must be updated if you change to the file format and do not implement compatibility logic for
	 * deserializing the older representation.
	 */
	OLDEST_SUPPORTED = V_1001,

	/**
	 * Used to assign `IApiPackageMetadataJson.oldestForwardsCompatibleVersion`.
	 *
	 * This value must be \<= `ApiJsonSchemaVersion.LATEST`.  It must be reset to the `LATEST` value
	 * if the older library would not be able to deserialize your new file format.  Adding a nonessential field
	 * is generally okay.  Removing, modifying, or reinterpreting existing fields is NOT safe.
	 */
	OLDEST_FORWARDS_COMPATIBLE = V_1013,
}

export class DeserializerContext {
	/**
	 * The path of the file being deserialized, which may be useful for diagnostic purposes.
	 */
	public readonly apiJsonFilename: string;

	/**
	 * Metadata from `IApiPackageMetadataJson.toolPackage`.
	 */
	public readonly toolPackage: string;

	/**
	 * Metadata from `IApiPackageMetadataJson.toolVersion`.
	 */
	public readonly toolVersion: string;

	/**
	 * The version of the schema being deserialized, as obtained from `IApiPackageMetadataJson.schemaVersion`.
	 */
	public readonly versionToDeserialize: ApiJsonSchemaVersion;

	/**
	 * The TSDoc configuration for the context.
	 */
	public readonly tsdocConfiguration: TSDocConfiguration;

	public constructor(options: DeserializerContext) {
		this.apiJsonFilename = options.apiJsonFilename;
		this.toolPackage = options.toolPackage;
		this.toolVersion = options.toolVersion;
		this.versionToDeserialize = options.versionToDeserialize;
		this.tsdocConfiguration = options.tsdocConfiguration;
	}
}
