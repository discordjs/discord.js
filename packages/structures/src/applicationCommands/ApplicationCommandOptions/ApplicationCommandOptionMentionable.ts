import type { APIApplicationCommandMentionableOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import type { Partialize } from '../../utils/types';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase';

/**
 * Represents a mention option type for an application command.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class ApplicationCommandOptionMentionable<
	Omitted extends keyof APIApplicationCommandMentionableOption,
> extends ApplicationCommandOptionBase<ApplicationCommandOptionType.Mentionable, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each mentionable application command option
	 */
	public static override readonly DataTemplate: Partial<APIApplicationCommandMentionableOption> = {};

	/**
	 * @param data - The raw data received from the API for the mentionable application command option
	 */
	public constructor(data: Partialize<APIApplicationCommandMentionableOption, Omitted>) {
		super(data);
	}
}
