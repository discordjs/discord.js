import type { GatewayActivityAssets } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents any activity assets on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class ActivityAssets<Omitted extends keyof GatewayActivityAssets | '' = ''> extends Structure<
	GatewayActivityAssets,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each activity assets
	 */
	public static override readonly DataTemplate: Partial<GatewayActivityAssets> = {};

	/**
	 * @param data - The raw data received from the API for the activity assets
	 */
	public constructor(data: Partialize<GatewayActivityAssets, Omitted>) {
		super(data);
	}

	/**
	 * @see {@link https://discord.com/developers/docs/events/gateway-events#activity-object-activity-asset-image}
	 */
	public get largeImage() {
		return this[kData].large_image;
	}

	/**
	 * Text displayed when hovering over the large image of the activity
	 */
	public get largeText() {
		return this[kData].large_text;
	}

	/**
	 * URL that is opened when clicking on the large image
	 */
	public get largeURL() {
		return this[kData].large_url;
	}

	/**
	 * @see {@link https://discord.com/developers/docs/events/gateway-events#activity-object-activity-asset-image}
	 */
	public get smallImage() {
		return this[kData].small_image;
	}

	/**
	 * Text displayed when hovering over the small image of the activity
	 */
	public get smallText() {
		return this[kData].small_text;
	}

	/**
	 * URL that is opened when clicking on the small image
	 */
	public get smallURL() {
		return this[kData].small_url;
	}

	/**
	 * URL of the image which is displayed as a banner on a Game Invite
	 */
	public get inviteCoverImage() {
		return this[kData].invite_cover_image;
	}
}
