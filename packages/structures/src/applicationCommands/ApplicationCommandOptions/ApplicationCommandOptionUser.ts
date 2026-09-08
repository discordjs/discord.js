import type { APIApplicationCommandUserOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import type { Partialize } from '../../utils/types';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase';

/**
 * Represents a user option type for an application command.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class ApplicationCommandOptionUser<
	Omitted extends keyof APIApplicationCommandUserOption,
> extends ApplicationCommandOptionBase<ApplicationCommandOptionType.User, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each user application command option
	 */
	public static override readonly DataTemplate: Partial<APIApplicationCommandUserOption> = {};

	/**
	 * @param data - The raw data received from the API for the user application command option
	 */
	public constructor(data: Partialize<APIApplicationCommandUserOption, Omitted>) {
		super(data);
	}
}
