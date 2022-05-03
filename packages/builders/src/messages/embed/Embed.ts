import type { APIEmbedField } from 'discord-api-types/v10';
import {
	colorPredicate,
	descriptionPredicate,
	embedAuthorPredicate,
	embedFieldsArrayPredicate,
	embedFooterPredicate,
	imageURLPredicate,
	timestampPredicate,
	titlePredicate,
	urlPredicate,
	validateFieldLength,
} from './Assertions';
import { EmbedAuthorOptions, EmbedFooterOptions, RGBTuple, UnsafeEmbedBuilder } from './UnsafeEmbed';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray';

/**
 * Represents a validated embed in a message (image/video preview, rich embed, etc.)
 */
export class EmbedBuilder extends UnsafeEmbedBuilder {
	public override addFields(...fields: RestOrArray<APIEmbedField>): this {
		fields = normalizeArray(fields);
		// Ensure adding these fields won't exceed the 25 field limit
		validateFieldLength(fields.length, this.data.fields);

		// Data assertions
		return super.addFields(...embedFieldsArrayPredicate.parse(fields));
	}

	public override spliceFields(index: number, deleteCount: number, ...fields: APIEmbedField[]): this {
		// Ensure adding these fields won't exceed the 25 field limit
		validateFieldLength(fields.length - deleteCount, this.data.fields);

		// Data assertions
		return super.spliceFields(index, deleteCount, ...embedFieldsArrayPredicate.parse(fields));
	}

	public override setAuthor(options: EmbedAuthorOptions | null): this {
		if (options === null) {
			return super.setAuthor(null);
		}

		// Data assertions
		embedAuthorPredicate.parse(options);

		return super.setAuthor(options);
	}

	public override setColor(color: number | RGBTuple | null): this {
		// Data assertions
		return super.setColor(colorPredicate.parse(color));
	}

	public override setDescription(description: string | null): this {
		// Data assertions
		return super.setDescription(descriptionPredicate.parse(description));
	}

	public override setFooter(options: EmbedFooterOptions | null): this {
		if (options === null) {
			return super.setFooter(null);
		}

		// Data assertions
		embedFooterPredicate.parse(options);

		return super.setFooter(options);
	}

	public override setImage(url: string | null): this {
		// Data assertions
		return super.setImage(imageURLPredicate.parse(url)!);
	}

	public override setThumbnail(url: string | null): this {
		// Data assertions
		return super.setThumbnail(imageURLPredicate.parse(url)!);
	}

	public override setTimestamp(timestamp: number | Date | null = Date.now()): this {
		// Data assertions
		return super.setTimestamp(timestampPredicate.parse(timestamp));
	}

	public override setTitle(title: string | null): this {
		// Data assertions
		return super.setTitle(titlePredicate.parse(title));
	}

	public override setURL(url: string | null): this {
		// Data assertions
		return super.setURL(urlPredicate.parse(url)!);
	}
}
