// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

/**
 * Unique identifiers for messages reported by API Extractor during its analysis.
 *
 * @remarks
 *
 * These strings are possible values for the {@link ExtractorMessage.messageId} property
 * when the `ExtractorMessage.category` is {@link ExtractorMessageCategory.Extractor}.
 * @public
 */
export const enum ExtractorMessageId {
	/**
	 * "The `@inheritDoc` tag for ___ refers to its own declaration."
	 */
	CyclicInheritDoc = 'ae-cyclic-inherit-doc',

	/**
	 * "This symbol has another declaration with a different release tag."
	 */
	DifferentReleaseTags = 'ae-different-release-tags',

	/**
	 * "The doc comment should not contain more than one release tag."
	 */
	ExtraReleaseTag = 'ae-extra-release-tag',

	/**
	 * "The symbol ___ needs to be exported by the entry point ___."
	 */
	ForgottenExport = 'ae-forgotten-export',

	/**
	 * "The symbol ___ is marked as ___, but its signature references ___ which is marked as ___."
	 */
	IncompatibleReleaseTags = 'ae-incompatible-release-tags',

	/**
	 * "The name ___ should be prefixed with an underscore because the declaration is marked as `@internal`."
	 */
	InternalMissingUnderscore = 'ae-internal-missing-underscore',

	/**
	 * "Mixed release tags are not allowed for ___ because one of its declarations is marked as `@internal`."
	 */
	InternalMixedReleaseTag = 'ae-internal-mixed-release-tag',

	/**
	 * "The `@packageDocumentation` comment must appear at the top of entry point *.d.ts file."
	 */
	MisplacedPackageTag = 'ae-misplaced-package-tag',

	/**
	 * "The property ___ has a setter but no getter."
	 */
	MissingGetter = 'ae-missing-getter',

	/**
	 * "___ is part of the package's API, but it is missing a release tag (`@alpha`, `@beta`, `@public`, or `@internal`)."
	 */
	MissingReleaseTag = 'ae-missing-release-tag',

	/**
	 * "The `@preapproved` tag cannot be applied to ___ without an `@internal` release tag."
	 */
	PreapprovedBadReleaseTag = 'ae-preapproved-bad-release-tag',

	/**
	 * "The `@preapproved` tag cannot be applied to ___ because it is not a supported declaration type."
	 */
	PreapprovedUnsupportedType = 'ae-preapproved-unsupported-type',

	/**
	 * "The doc comment for the property ___ must appear on the getter, not the setter."
	 */
	SetterWithDocs = 'ae-setter-with-docs',

	/**
	 * "Missing documentation for ___."
	 *
	 * @remarks
	 * The `ae-undocumented` message is only generated if the API report feature is enabled.
	 *
	 * Because the API report file already annotates undocumented items with `// (undocumented)`,
	 * the `ae-undocumented` message is not logged by default.  To see it, add a setting such as:
	 * ```json
	 * "messages": {
	 *   "extractorMessageReporting": {
	 *     "ae-undocumented": {
	 *       "logLevel": "warning"
	 *     }
	 *   }
	 *  }
	 * ```
	 */
	Undocumented = 'ae-undocumented',

	/**
	 * "The `@inheritDoc` tag needs a TSDoc declaration reference; signature matching is not supported yet."
	 *
	 * @privateRemarks
	 * In the future, we will implement signature matching so that you can write `{@inheritDoc}` and API Extractor
	 * will find a corresponding member from a base class (or implemented interface).  Until then, the tag
	 * always needs an explicit declaration reference such as `{@inhertDoc MyBaseClass.sameMethod}`.
	 */
	UnresolvedInheritDocBase = 'ae-unresolved-inheritdoc-base',

	/**
	 * "The `@inheritDoc` reference could not be resolved."
	 */
	UnresolvedInheritDocReference = 'ae-unresolved-inheritdoc-reference',

	/**
	 * "The `@link` reference could not be resolved."
	 */
	UnresolvedLink = 'ae-unresolved-link',

	/**
	 * "Incorrect file type; API Extractor expects to analyze compiler outputs with the .d.ts file extension.
	 * Troubleshooting tips: `https://api-extractor.com/link/dts-error`"
	 */
	WrongInputFileType = 'ae-wrong-input-file-type',
}

export const allExtractorMessageIds: Set<string> = new Set<string>([
	'ae-extra-release-tag',
	'ae-undocumented',
	'ae-different-release-tags',
	'ae-incompatible-release-tags',
	'ae-missing-release-tag',
	'ae-misplaced-package-tag',
	'ae-forgotten-export',
	'ae-internal-missing-underscore',
	'ae-internal-mixed-release-tag',
	'ae-preapproved-unsupported-type',
	'ae-preapproved-bad-release-tag',
	'ae-unresolved-inheritdoc-reference',
	'ae-unresolved-inheritdoc-base',
	'ae-cyclic-inherit-doc',
	'ae-unresolved-link',
	'ae-setter-with-docs',
	'ae-missing-getter',
	'ae-wrong-input-file-type',
]);
