import type { APIGuildWelcomeScreen } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a welcome screen on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructure `GuildWelcomeScreenChannel`, which needs to be instantiated and stored by any extending classes using it.
 */
export class GuildWelcomeScreen<Omitted extends keyof APIGuildWelcomeScreen | '' = ''> extends Structure<
	APIGuildWelcomeScreen,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each welcome screen.
	 */
	public static override readonly DataTemplate: Partial<APIGuildWelcomeScreen> = {};

	/**
	 * @param data - The raw data from the API for the welcome screen.
	 */
	public constructor(data: Partialize<APIGuildWelcomeScreen, Omitted>) {
		super(data);
	}

	/**
	 * The description of the welcome screen.
	 */
	public get description() {
		return this[kData].description;
	}
}
