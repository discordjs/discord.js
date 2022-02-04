import type { APIEmbed, APIEmbedField } from 'discord-api-types/v9';

export interface AuthorOptions {
	name: string;
	url?: string;
	iconURL?: string;
}

export interface FooterOptions {
	text: string;
	iconURL?: string;
}

export class UnsafeEmbed implements APIEmbed {
	protected data!: APIEmbed;

	public constructor(data: APIEmbed = {}) {
		this.data = data;
		this.data.fields = data.fields ?? [];

		if (data.timestamp) this.data.timestamp = new Date(data.timestamp).toISOString();
	}

	/**
	 * An array of fields of this embed
	 */
	public get fields() {
		return this.data.fields ?? [];
	}

	/**
	 * The embed title
	 */
	public get title() {
		return this.data.title;
	}

	/**
	 * The embed description
	 */
	public get description() {
		return this.data.description;
	}

	/**
	 * The embed url
	 */
	public get url() {
		return this.data.url;
	}

	/**
	 * The embed color
	 */
	public get color() {
		return this.data.color;
	}

	/**
	 * The timestamp of the embed in the ISO format
	 */
	public get timestamp() {
		return this.data.timestamp;
	}

	/**
	 * The embed thumbnail data
	 */
	public get thumbnail() {
		return this.data.thumbnail;
	}

	/**
	 * The embed image data
	 */
	public get image() {
		return this.data.image;
	}

	/**
	 * Received video data
	 */
	public get video() {
		return this.data.video;
	}

	/**
	 * The embed author data
	 */
	public get author() {
		return this.data.author;
	}

	/**
	 * Received data about the embed provider
	 */
	public get provider() {
		return this.data.provider;
	}

	/**
	 * The embed footer data
	 */
	public get footer() {
		return this.data.footer;
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
		this.fields.push(...UnsafeEmbed.normalizeFields(...fields));
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
		this.fields.splice(index, deleteCount, ...UnsafeEmbed.normalizeFields(...fields));
		return this;
	}

	/**
	 * Sets the embed's fields (max 25).
	 * @param fields The fields to set
	 */
	public setFields(...fields: APIEmbedField[]) {
		this.spliceFields(0, this.fields.length, ...fields);
		return this;
	}

	/**
	 * Sets the author of this embed
	 *
	 * @param options The options for the author
	 */
	public setAuthor(options: AuthorOptions | null): this {
		if (options === null) {
			this.data.author = undefined;
			return this;
		}

		this.data.author = { name: options.name, url: options.url, icon_url: options.iconURL };
		return this;
	}

	/**
	 * Sets the color of this embed
	 *
	 * @param color The color of the embed
	 */
	public setColor(color: number | null): this {
		this.data.color = color ?? undefined;
		return this;
	}

	/**
	 * Sets the description of this embed
	 *
	 * @param description The description
	 */
	public setDescription(description: string | null): this {
		this.data.description = description ?? undefined;
		return this;
	}

	/**
	 * Sets the footer of this embed
	 *
	 * @param options The options for the footer
	 */
	public setFooter(options: FooterOptions | null): this {
		if (options === null) {
			this.data.footer = undefined;
			return this;
		}

		this.data.footer = { text: options.text, icon_url: options.iconURL };
		return this;
	}

	/**
	 * Sets the image of this embed
	 *
	 * @param url The URL of the image
	 */
	public setImage(url: string | null): this {
		this.data.image = url ? { url } : undefined;
		return this;
	}

	/**
	 * Sets the thumbnail of this embed
	 *
	 * @param url The URL of the thumbnail
	 */
	public setThumbnail(url: string | null): this {
		this.data.thumbnail = url ? { url } : undefined;
		return this;
	}

	/**
	 * Sets the timestamp of this embed
	 *
	 * @param timestamp The timestamp or date
	 */
	public setTimestamp(timestamp: number | Date | null = Date.now()): this {
		this.data.timestamp = timestamp ? new Date(timestamp).toISOString() : undefined;
		return this;
	}

	/**
	 * Sets the title of this embed
	 *
	 * @param title The title
	 */
	public setTitle(title: string | null): this {
		this.data.title = title ?? undefined;
		return this;
	}

	/**
	 * Sets the URL of this embed
	 *
	 * @param url The URL
	 */
	public setURL(url: string | null): this {
		this.data.url = url ?? undefined;
		return this;
	}

	/**
	 * Transforms the embed to a plain object
	 */
	public toJSON(): APIEmbed {
		return { ...this.data };
	}

	/**
	 * Normalizes field input and resolves strings
	 *
	 * @param fields Fields to normalize
	 */
	public static normalizeFields(...fields: APIEmbedField[]): APIEmbedField[] {
		return fields
			.flat(Infinity)
			.map((field) => ({ name: field.name, value: field.value, inline: field.inline ?? undefined }));
	}
}
