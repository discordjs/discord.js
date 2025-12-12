import type { APIGuildWelcomeScreen } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Represents a guild's welcome screen.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has a substructure `WelcomeChannel`, which needs to be instantiated and stored by an extending class using it
 */
export abstract class WelcomeScreen<Omitted extends keyof APIGuildWelcomeScreen | '' = ''> extends Structure<
	APIGuildWelcomeScreen,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each WelcomeScreen
	 */
	public static override readonly DataTemplate: Partial<APIGuildWelcomeScreen> = {};

	/**
	 * @param data - The raw data received from the API for the welcome screen
	 */
	public constructor(data: Partialize<APIGuildWelcomeScreen, Omitted>) {
		super(data);
	}

	/**
	 * The server description shown in the welcome screen
	 */
	public get description() {
		return this[kData].description;
	}
}
