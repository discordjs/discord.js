import type {
	APIEmbed,
	APIEmbedAuthor,
	APIEmbedField,
	APIEmbedFooter,
	APIEmbedImage,
	APIEmbedProvider,
	APIEmbedThumbnail,
	APIEmbedVideo,
} from 'discord-api-types/v9';
import {
	authorNamePredicate,
	colorPredicate,
	descriptionPredicate,
	embedFieldsArrayPredicate,
	fieldInlinePredicate,
	fieldNamePredicate,
	fieldValuePredicate,
	footerTextPredicate,
	timestampPredicate,
	titlePredicate,
	urlPredicate,
	validateFieldLength,
} from './Assertions';

export interface AuthorOptions {
	name: string;
	url?: string;
	iconURL?: string;
}

export interface FooterOptions {
	text: string;
	iconURL?: string;
}

/**
 * Represents an embed in a message (image/video preview, rich embed, etc.)
 */
export class Embed implements APIEmbed {
	/**
	 * An array of fields of this embed
	 */
	public fields: APIEmbedField[];

	/**
	 * The embed title
	 */
	public title?: string;

	/**
	 * The embed description
	 */
	public description?: string;

	/**
	 * The embed url
	 */
	public url?: string;

	/**
	 * The embed color
	 */
	public color?: number;

	/**
	 * The timestamp of the embed in the ISO format
	 */
	public timestamp?: string;

	/**
	 * The embed thumbnail data
	 */
	public thumbnail?: APIEmbedThumbnail;

	/**
	 * The embed image data
	 */
	public image?: APIEmbedImage;

	/**
	 * Received video data
	 */
	public video?: APIEmbedVideo;

	/**
	 * The embed author data
	 */
	public author?: APIEmbedAuthor;

	/**
	 * Received data about the embed provider
	 */
	public provider?: APIEmbedProvider;

	/**
	 * The embed footer data
	 */
	public footer?: APIEmbedFooter;

	public constructor(data: APIEmbed = {}) {
		this.title = data.title;
		this.description = data.description;
		this.url = data.url;
		this.color = data.color;
		this.thumbnail = data.thumbnail;
		this.image = data.image;
		this.video = data.video;
		this.author = data.author;
		this.provider = data.provider;
		this.footer = data.footer;
		this.fields = data.fields ?? [];

		if (data.timestamp) this.timestamp = new Date(data.timestamp).toISOString();
	}

	/**
	 * The accumulated length for the embed title, description, fields, footer text, and author name
	 */
	public get length(): number {
		return (
			(this.title?.length ?? 0) +
			(this.description?.length ?? 0) +
			this.fields.reduce((prev, curr) => prev + curr.name.length + curr.value.length, 0) +
			(this.footer?.text.length ?? 0) +
			(this.author?.name.length ?? 0)
		);
	}

	/**
	 * Adds a field to the embed (max 25)
	 *
	 * @param field The field to add.
	 */
	public addField(field: APIEmbedField): this {
		return this.addFields(field);
	}

	/**
	 * Adds fields to the embed (max 25)
	 *
	 * @param fields The fields to add
	 */
	public addFields(...fields: APIEmbedField[]): this {
		// Data assertions
		embedFieldsArrayPredicate.parse(fields);

		// Ensure adding these fields won't exceed the 25 field limit
		validateFieldLength(this.fields, fields.length);

		this.fields.push(...Embed.normalizeFields(...fields));
		return this;
	}

	/**
	 * Removes, replaces, or inserts fields in the embed (max 25)
	 *
	 * @param index The index to start at
	 * @param deleteCount The number of fields to remove
	 * @param fields The replacing field objects
	 */
	public spliceFields(index: number, deleteCount: number, ...fields: APIEmbedField[]): this {
		// Data assertions
		embedFieldsArrayPredicate.parse(fields);

		// Ensure adding these fields won't exceed the 25 field limit
		validateFieldLength(this.fields, fields.length - deleteCount);

		this.fields.splice(index, deleteCount, ...Embed.normalizeFields(...fields));
		return this;
	}

	/**
	 * Sets the author of this embed
	 *
	 * @param options The options for the author
	 */
	public setAuthor(options: AuthorOptions | null): this {
		if (options === null) {
			this.author = undefined;
			return this;
		}

		const { name, iconURL, url } = options;
		// Data assertions
		authorNamePredicate.parse(name);
		urlPredicate.parse(iconURL);
		urlPredicate.parse(url);

		this.author = { name, url, icon_url: iconURL };
		return this;
	}

	/**
	 * Sets the color of this embed
	 *
	 * @param color The color of the embed
	 */
	public setColor(color: number | null): this {
		// Data assertions
		colorPredicate.parse(color);

		this.color = color ?? undefined;
		return this;
	}

	/**
	 * Sets the description of this embed
	 *
	 * @param description The description
	 */
	public setDescription(description: string | null): this {
		// Data assertions
		descriptionPredicate.parse(description);

		this.description = description ?? undefined;
		return this;
	}

	/**
	 * Sets the footer of this embed
	 *
	 * @param options The options for the footer
	 */
	public setFooter(options: FooterOptions | null): this {
		if (options === null) {
			this.footer = undefined;
			return this;
		}

		const { text, iconURL } = options;
		// Data assertions
		footerTextPredicate.parse(text);
		urlPredicate.parse(iconURL);

		this.footer = { text, icon_url: iconURL };
		return this;
	}

	/**
	 * Sets the image of this embed
	 *
	 * @param url The URL of the image
	 */
	public setImage(url: string | null): this {
		// Data assertions
		urlPredicate.parse(url);

		this.image = url ? { url } : undefined;
		return this;
	}

	/**
	 * Sets the thumbnail of this embed
	 *
	 * @param url The URL of the thumbnail
	 */
	public setThumbnail(url: string | null): this {
		// Data assertions
		urlPredicate.parse(url);

		this.thumbnail = url ? { url } : undefined;
		return this;
	}

	/**
	 * Sets the timestamp of this embed
	 *
	 * @param timestamp The timestamp or date
	 */
	public setTimestamp(timestamp: number | Date | null = Date.now()): this {
		// Data assertions
		timestampPredicate.parse(timestamp);

		this.timestamp = timestamp ? new Date(timestamp).toISOString() : undefined;
		return this;
	}

	/**
	 * Sets the title of this embed
	 *
	 * @param title The title
	 */
	public setTitle(title: string | null): this {
		// Data assertions
		titlePredicate.parse(title);

		this.title = title ?? undefined;
		return this;
	}

	/**
	 * Sets the URL of this embed
	 *
	 * @param url The URL
	 */
	public setURL(url: string | null): this {
		// Data assertions
		urlPredicate.parse(url);

		this.url = url ?? undefined;
		return this;
	}

	/**
	 * Transforms the embed to a plain object
	 */
	public toJSON(): APIEmbed {
		return { ...this };
	}

	/**
	 * Normalizes field input and resolves strings
	 *
	 * @param fields Fields to normalize
	 */
	public static normalizeFields(...fields: APIEmbedField[]): APIEmbedField[] {
		return fields.flat(Infinity).map((field) => {
			fieldNamePredicate.parse(field.name);
			fieldValuePredicate.parse(field.value);
			fieldInlinePredicate.parse(field.inline);

			return { name: field.name, value: field.value, inline: field.inline ?? undefined };
		});
	}
}
