import type { APIApplicationCommandChannelOption, ApplicationCommandOptionAllowedChannelType, ApplicationCommandOptionType } from 'discord-api-types/v10';
import type { Partialize } from '../../utils/types';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase';

/**
 * Represents a channel option type for an application command.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class ApplicationCommandOptionChannel<
	Omitted extends keyof { channel_types?: ApplicationCommandOptionAllowedChannelType[] } & keyof APIApplicationCommandChannelOption,
> extends ApplicationCommandOptionBase<ApplicationCommandOptionType.Channel, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each channel application command option
	 */
	public static override readonly DataTemplate: Partial<APIApplicationCommandChannelOption> = {};

	/**
	 * @param data - The raw data received from the API for the channel application command option
	 */
	public constructor(data: Partialize<APIApplicationCommandChannelOption, Omitted>) {
		super(data);
	}
}
