import type { APIApplicationCommandRoleOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import type { Partialize } from '../../utils/types';
import { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase';

/**
 * Represents a role option type for an application command.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class ApplicationCommandOptionRole<
	Omitted extends keyof APIApplicationCommandRoleOption,
> extends ApplicationCommandOptionBase<ApplicationCommandOptionType.Role, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each number application command option
	 */
	public static override readonly DataTemplate: Partial<APIApplicationCommandRoleOption> = {};

	/**
	 * @param data - The raw data received from the API for the role application command option
	 */
	public constructor(data: Partialize<APIApplicationCommandRoleOption, Omitted>) {
		super(data);
	}
}
