import type { APIApplicationCommandBooleanOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import type { Partialize } from '../../utils/types';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase';

/**
 * Represents a boolean option type for an application command.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class ApplicationCommandOptionBoolean<
	Omitted extends keyof APIApplicationCommandBooleanOption,
> extends ApplicationCommandOptionBase<ApplicationCommandOptionType.Boolean, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each boolean application command option
	 */
	public static override readonly DataTemplate: Partial<APIApplicationCommandBooleanOption> = {};

	/**
	 * @param data - The raw data received from the API for the boolean application command option
	 */
	public constructor(data: Partialize<APIApplicationCommandBooleanOption, Omitted>) {
		super(data);
	}
}
