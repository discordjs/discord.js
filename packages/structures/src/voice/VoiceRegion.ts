import type { APIVoiceRegion } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents any voice region on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class VoiceRegion<Omitted extends keyof APIVoiceRegion | '' = ''> extends Structure<APIVoiceRegion, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each voice region
	 */
	public static override readonly DataTemplate: Partial<APIVoiceRegion> = {};

	/**
	 * @param data - The raw data received from the API for the voice region
	 */
	public constructor(data: Partialize<APIVoiceRegion, Omitted>) {
		super(data);
	}

	/**
	 * Unique id for the region
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * Name of the region
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * `true` for a single server that is closest to the current user's client
	 */
	public get optimal() {
		return this[kData].optimal;
	}

	/**
	 * Whether this is a deprecated voice region (avoid switching to these)
	 */
	public get deprecated() {
		return this[kData].deprecated;
	}

	/**
	 * Whether this is a custom voice region (used for events/etc)
	 */
	public get custom() {
		return this[kData].custom;
	}
}
