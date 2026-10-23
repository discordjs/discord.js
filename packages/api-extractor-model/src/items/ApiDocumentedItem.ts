// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as tsdoc from '@microsoft/tsdoc';
import type { DeserializerContext } from '../model/DeserializerContext.js';
import { ApiItem, type IApiItemOptions, type IApiItemJson } from './ApiItem.js';

/**
 * Constructor options for {@link ApiDocumentedItem}.
 *
 * @public
 */
export interface IApiDocumentedItemOptions extends IApiItemOptions {
	docComment: tsdoc.DocComment | undefined;
}

export interface IApiDocumentedItemJson extends IApiItemJson {
	docComment: string;
}

/**
 * An abstract base class for API declarations that can have an associated TSDoc comment.
 *
 * @remarks
 *
 * This is part of the {@link ApiModel} hierarchy of classes, which are serializable representations of
 * API declarations.
 * @public
 */
export class ApiDocumentedItem extends ApiItem {
	private readonly _tsdocComment: tsdoc.DocComment | undefined;

	public constructor(options: IApiDocumentedItemOptions) {
		super(options);
		this._tsdocComment = options.docComment;
	}

	/**
	 * @override
	 */
	public static override onDeserializeInto(
		options: Partial<IApiDocumentedItemOptions>,
		context: DeserializerContext,
		jsonObject: IApiItemJson,
	): void {
		super.onDeserializeInto(options, context, jsonObject);

		const documentedJson: IApiDocumentedItemJson = jsonObject as IApiDocumentedItemJson;

		if (documentedJson.docComment) {
			const tsdocParser: tsdoc.TSDocParser = new tsdoc.TSDocParser(context.tsdocConfiguration);

			// NOTE: For now, we ignore TSDoc errors found in a serialized .api.json file.
			// Normally these errors would have already been reported by API Extractor during analysis.
			// However, they could also arise if the JSON file was edited manually, or if the file was saved
			// using a different release of the software that used an incompatible syntax.
			const parserContext: tsdoc.ParserContext = tsdocParser.parseString(documentedJson.docComment);

			options.docComment = parserContext.docComment;
		}
	}

	public get tsdocComment(): tsdoc.DocComment | undefined {
		return this._tsdocComment;
	}

	/**
	 * @override
	 */
	public override serializeInto(jsonObject: Partial<IApiDocumentedItemJson>): void {
		super.serializeInto(jsonObject);
		if (this.tsdocComment === undefined) {
			jsonObject.docComment = '';
		} else {
			jsonObject.docComment = this.tsdocComment.emitAsTsdoc();
		}
	}
}
