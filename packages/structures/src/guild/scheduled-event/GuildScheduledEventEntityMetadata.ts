import type { APIGuildScheduledEventEntityMetadata } from 'discord-api-types/v10';
import { Structure } from '../../Structure';
import { kData } from '../../utils/symbols';
import type { Partialize } from '../../utils/types';

/**
 * Represents the additional entity metadata of a scheduled event on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class GuildScheduledEventEntityMetadata<
	Omitted extends keyof APIGuildScheduledEventEntityMetadata | '' = '',
> extends Structure<APIGuildScheduledEventEntityMetadata, Omitted> {
	/**
	 * The template used for removing data from the entity metadata.
	 */
	public static override readonly DataTemplate: Partial<APIGuildScheduledEventEntityMetadata> = {};

	/**
	 * @param data - The raw data from the API for the entity metadata.
	 */
	public constructor(data: Partialize<APIGuildScheduledEventEntityMetadata, Omitted>) {
		super(data);
	}

	/**
	 * The location of the event.
	 */
	public get location() {
		return this[kData].location;
	}
}
