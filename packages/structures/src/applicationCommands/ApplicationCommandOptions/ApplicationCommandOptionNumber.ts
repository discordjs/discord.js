import type { APIApplicationCommandNumberOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import type { Partialize } from '../../utils/types';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase';

/**
 * Represents a number option type for an application command.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class ApplicationCommandOptionNumber<
	Omitted extends keyof APIApplicationCommandNumberOption,
> extends ApplicationCommandOptionBase<ApplicationCommandOptionType.Number, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each number application command option
	 */
	public static override readonly DataTemplate: Partial<APIApplicationCommandNumberOption> = {};

	/**
	 * @param data - The raw data received from the API for the number application command option
	 */
	public constructor(data: Partialize<APIApplicationCommandNumberOption, Omitted>) {
		super(data);
	}
}
