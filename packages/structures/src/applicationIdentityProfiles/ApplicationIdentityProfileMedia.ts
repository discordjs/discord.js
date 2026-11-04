import type { APIApplicationIdentityProfileMedia } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a media asset in an application identity profile.
 *
 * @typeParam Omitted - Specify properties removed from raw data through `DataTemplate`.
 */
export class ApplicationIdentityProfileMedia<
	Omitted extends keyof APIApplicationIdentityProfileMedia | '' = '',
> extends Structure<APIApplicationIdentityProfileMedia, Omitted> {
	/** The template used to remove properties from the raw media asset. */
	public static override readonly DataTemplate: Partial<APIApplicationIdentityProfileMedia> = {};

	/**
	 * @param data - The raw media asset received from the API.
	 */
	public constructor(data: Partialize<APIApplicationIdentityProfileMedia, Omitted>) {
		super(data);
	}

	/** The URL of the media asset. */
	public get url() {
		return this[kData].url;
	}
}
