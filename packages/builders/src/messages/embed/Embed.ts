import type { APIEmbed, APIEmbedAuthor, APIEmbedField, APIEmbedFooter, APIEmbedImage } from 'discord-api-types/v10';
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
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray';

export type RGBTuple = [red: number, green: number, blue: number];

export interface IconData {
	/**
	 * The URL of the icon
	 */
	iconURL?: string;
	/**
	 * The proxy URL of the icon
	 */
	proxyIconURL?: string;
}

export type EmbedAuthorData = Omit<APIEmbedAuthor, 'icon_url' | 'proxy_icon_url'> & IconData;

export type EmbedAuthorOptions = Omit<EmbedAuthorData, 'proxyIconURL'>;

export type EmbedFooterData = Omit<APIEmbedFooter, 'icon_url' | 'proxy_icon_url'> & IconData;

export type EmbedFooterOptions = Omit<EmbedFooterData, 'proxyIconURL'>;

export interface EmbedImageData extends Omit<APIEmbedImage, 'proxy_url'> {
	/**
	 * The proxy URL for the image
	 */
	proxyURL?: string;
}
/**
 * Represents a embed in a message (image/video preview, rich embed, etc.)
 */
export class EmbedBuilder {
	public readonly data: APIEmbed;

	public constructor(data: APIEmbed = {}) {
		this.data = { ...data };
		if (data.timestamp) this.data.timestamp = new Date(data.timestamp).toISOString();
	}

	/**
	 * Appends fields to the embed
	 *
	 * @remarks
	 * This method accepts either an array of fields or a variable number of field parameters.
	 * The maximum amount of fields that can be added is 25.
	 *
	 * @example
	 * Using an array
	 * ```ts
	 * const fields: APIEmbedField[] = ...;
	 * const embed = new EmbedBuilder()
	 * 	.addFields(fields);
	 * ```
	 *
	 * @example
	 * Using rest parameters (variadic)
	 * ```ts
	 * const embed = new EmbedBuilder()
	 * 	.addFields(
	 * 		{ name: 'Field 1', value: 'Value 1' },
	 * 		{ name: 'Field 2', value: 'Value 2' },
	 * 	);
	 * ```
	 *
	 * @param fields - The fields to add
	 */
	public addFields(...fields: RestOrArray<APIEmbedField>): this {
		fields = normalizeArray(fields);
		// Ensure adding these fields won't exceed the 25 field limit
		validateFieldLength(fields.length, this.data.fields);

		// Data assertions
		embedFieldsArrayPredicate.parse(fields);

		if (this.data.fields) this.data.fields.push(...fields);
		else this.data.fields = fields;
		return this;
	}

	/**
	 * Removes, replaces, or inserts fields in the embed.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice | Array.prototype.splice}.
	 * The maximum amount of fields that can be added is 25.
	 *
	 * It's useful for modifying and adjusting order of the already-existing fields of an embed.
	 *
	 * @example
	 * Remove the first field
	 * ```ts
	 * embed.spliceFields(0, 1);
	 * ```
	 *
	 * @example
	 * Remove the first n fields
	 * ```ts
	 * const n = 4
	 * embed.spliceFields(0, n);
	 * ```
	 *
	 * @example
	 * Remove the last field
	 * ```ts
	 * embed.spliceFields(-1, 1);
	 * ```
	 *
	 * @param index - The index to start at
	 * @param deleteCount - The number of fields to remove
	 * @param fields - The replacing field objects
	 */
	public spliceFields(index: number, deleteCount: number, ...fields: APIEmbedField[]): this {
		// Ensure adding these fields won't exceed the 25 field limit
		validateFieldLength(fields.length - deleteCount, this.data.fields);

		// Data assertions
		embedFieldsArrayPredicate.parse(fields);
		if (this.data.fields) this.data.fields.splice(index, deleteCount, ...fields);
		else this.data.fields = fields;
		return this;
	}

	/**
	 * Sets the embed's fields
	 *
	 * @remarks
	 * This method is an alias for {@link EmbedBuilder.spliceFields}. More specifically,
	 * it splices the entire array of fields, replacing them with the provided fields.
	 *
	 * You can set a maximum of 25 fields.
	 *
	 * @param fields - The fields to set
	 */
	public setFields(...fields: RestOrArray<APIEmbedField>) {
		this.spliceFields(0, this.data.fields?.length ?? 0, ...normalizeArray(fields));
		return this;
	}

	/**
	 * Sets the author of this embed
	 *
	 * @param options - The options for the author
	 */

	public setAuthor(options: EmbedAuthorOptions | null): this {
		if (options === null) {
			this.data.author = undefined;
			return this;
		}

		// Data assertions
		embedAuthorPredicate.parse(options);

		this.data.author = { name: options.name, url: options.url, icon_url: options.iconURL };
		return this;
	}

	/**
	 * Sets the color of this embed
	 *
	 * @param color - The color of the embed
	 */
	public setColor(color: number | RGBTuple | null): this {
		// Data assertions
		colorPredicate.parse(color);

		if (Array.isArray(color)) {
			const [red, green, blue] = color;
			this.data.color = (red << 16) + (green << 8) + blue;
			return this;
		}
		this.data.color = color ?? undefined;
		return this;
	}

	/**
	 * Sets the description of this embed
	 *
	 * @param description - The description
	 */
	public setDescription(description: string | null): this {
		// Data assertions
		descriptionPredicate.parse(description);

		this.data.description = description ?? undefined;
		return this;
	}

	/**
	 * Sets the footer of this embed
	 *
	 * @param options - The options for the footer
	 */
	public setFooter(options: EmbedFooterOptions | null): this {
		if (options === null) {
			this.data.footer = undefined;
			return this;
		}

		// Data assertions
		embedFooterPredicate.parse(options);

		this.data.footer = { text: options.text, icon_url: options.iconURL };
		return this;
	}

	/**
	 * Sets the image of this embed
	 *
	 * @param url - The URL of the image
	 */
	public setImage(url: string | null): this {
		// Data assertions
		imageURLPredicate.parse(url);

		this.data.image = url ? { url } : undefined;
		return this;
	}

	/**
	 * Sets the thumbnail of this embed
	 *
	 * @param url - The URL of the thumbnail
	 */
	public setThumbnail(url: string | null): this {
		// Data assertions
		imageURLPredicate.parse(url);

		this.data.thumbnail = url ? { url } : undefined;
		return this;
	}

	/**
	 * Sets the timestamp of this embed
	 *
	 * @param timestamp - The timestamp or date
	 */
	public setTimestamp(timestamp: number | Date | null = Date.now()): this {
		// Data assertions
		timestampPredicate.parse(timestamp);

		this.data.timestamp = timestamp ? new Date(timestamp).toISOString() : undefined;
		return this;
	}

	/**
	 * Sets the title of this embed
	 *
	 * @param title - The title
	 */
	public setTitle(title: string | null): this {
		// Data assertions
		titlePredicate.parse(title);

		this.data.title = title ?? undefined;
		return this;
	}

	/**
	 * Sets the URL of this embed
	 *
	 * @param url - The URL
	 */
	public setURL(url: string | null): this {
		// Data assertions
		urlPredicate.parse(url);

		this.data.url = url ?? undefined;
		return this;
	}

	/**
	 * Transforms the embed to a plain object
	 */
	public toJSON(): APIEmbed {
		return { ...this.data };
	}
}
