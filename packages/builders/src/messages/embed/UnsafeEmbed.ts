import type {
	APIEmbed,
	APIEmbedAuthor,
	APIEmbedField,
	APIEmbedFooter,
	APIEmbedImage,
	APIEmbedVideo,
} from 'discord-api-types/v9';
import type { Equatable } from '../../util/equatable';
import isEqual from 'fast-deep-equal';

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
 * Represents a non-validated embed in a message (image/video preview, rich embed, etc.)
 */
export class UnsafeEmbed implements Equatable<APIEmbed | UnsafeEmbed> {
	public readonly data: APIEmbed;

	public constructor(data: APIEmbed = {}) {
		this.data = { ...data };
		if (data.timestamp) this.data.timestamp = new Date(data.timestamp).toISOString();
	}

	/**
	 * An array of fields of this embed
	 */
	public get fields() {
		return this.data.fields;
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
	 * The embed URL
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
	 * The timestamp of the embed in an ISO 8601 format
	 */
	public get timestamp() {
		return this.data.timestamp;
	}

	/**
	 * The embed thumbnail data
	 */
	public get thumbnail(): EmbedImageData | undefined {
		if (!this.data.thumbnail) return undefined;
		return {
			url: this.data.thumbnail.url,
			proxyURL: this.data.thumbnail.proxy_url,
			height: this.data.thumbnail.height,
			width: this.data.thumbnail.width,
		};
	}

	/**
	 * The embed image data
	 */
	public get image(): EmbedImageData | undefined {
		if (!this.data.image) return undefined;
		return {
			url: this.data.image.url,
			proxyURL: this.data.image.proxy_url,
			height: this.data.image.height,
			width: this.data.image.width,
		};
	}

	/**
	 * Received video data
	 */
	public get video(): APIEmbedVideo | undefined {
		return this.data.video;
	}

	/**
	 * The embed author data
	 */
	public get author(): EmbedAuthorData | undefined {
		if (!this.data.author) return undefined;
		return {
			name: this.data.author.name,
			url: this.data.author.url,
			iconURL: this.data.author.icon_url,
			proxyIconURL: this.data.author.proxy_icon_url,
		};
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
	public get footer(): EmbedFooterData | undefined {
		if (!this.data.footer) return undefined;
		return {
			text: this.data.footer.text,
			iconURL: this.data.footer.icon_url,
			proxyIconURL: this.data.footer.proxy_icon_url,
		};
	}

	/**
	 * The accumulated length for the embed title, description, fields, footer text, and author name
	 */
	public get length(): number {
		return (
			(this.data.title?.length ?? 0) +
			(this.data.description?.length ?? 0) +
			(this.data.fields?.reduce((prev, curr) => prev + curr.name.length + curr.value.length, 0) ?? 0) +
			(this.data.footer?.text.length ?? 0) +
			(this.data.author?.name.length ?? 0)
		);
	}

	/**
	 * The hex color of the current color of the embed
	 */
	public get hexColor() {
		return typeof this.data.color === 'number' ? `#${this.data.color.toString(16).padStart(6, '0')}` : this.data.color;
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
		if (this.data.fields) this.data.fields.push(...fields);
		else this.data.fields = fields;
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
		if (this.data.fields) this.data.fields.splice(index, deleteCount, ...fields);
		else this.data.fields = fields;
		return this;
	}

	/**
	 * Sets the embed's fields (max 25).
	 * @param fields The fields to set
	 */
	public setFields(...fields: APIEmbedField[]) {
		this.spliceFields(0, this.fields?.length ?? 0, ...fields);
		return this;
	}

	/**
	 * Sets the author of this embed
	 *
	 * @param options The options for the author
	 */
	public setAuthor(options: EmbedAuthorOptions | null): this {
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
	public setColor(color: number | RGBTuple | null): this {
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
	public setFooter(options: EmbedFooterOptions | null): this {
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

	public equals(other: UnsafeEmbed | APIEmbed) {
		const { image: thisImage, thumbnail: thisThumbnail, ...thisData } = this.data;
		const data = other instanceof UnsafeEmbed ? other.data : other;
		const { image, thumbnail, ...otherData } = data;
		return isEqual(otherData, thisData) && image?.url === thisImage?.url && thumbnail?.url === thisThumbnail?.url;
	}
}
