import type { APIApplicationCommandIntegerOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import type { Partialize } from '../../utils/types';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase';

/**
 * Represents an integer option type for an application command.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class ApplicationCommandOptionInteger<
	Omitted extends keyof APIApplicationCommandIntegerOption,
> extends ApplicationCommandOptionBase<ApplicationCommandOptionType.Integer, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each integer application command option type.
	 */
	public static override readonly DataTemplate: Partial<APIApplicationCommandIntegerOption> = {};

	/**
	 * @param data - The raw data received from the API for the integer option type
	 */
	public constructor(data: Partialize<APIApplicationCommandIntegerOption, Omitted>) {
		super(data);
	}
}
