import type { APIApplicationCommandInteraction, InteractionType } from 'discord-api-types/v10';
import type { PartializeInteraction } from './types.js';
import { UserInteraction } from './UserInteraction.js';

/**
 * An incoming application command invocation.
 *
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 * @remarks The raw `data` union distinguishes chat input, user, message, and primary entry point commands.
 * It contains `ApplicationCommandInteractionData`, left for extending classes along with the `Guild`, `Channel`,
 * `GuildMember`, `User`, `Message`, and `Entitlement` substructures in the other raw nested fields.
 */
export class ApplicationCommandInteraction<
	Omitted extends keyof APIApplicationCommandInteraction | '' = 'app_permissions',
> extends UserInteraction<InteractionType.ApplicationCommand, Omitted> {
	public static override readonly DataTemplate: Partial<APIApplicationCommandInteraction> = {
		set app_permissions(_value: string) {},
	};

	/**
	 * @param data - The raw API command interaction
	 */
	public constructor(data: PartializeInteraction<APIApplicationCommandInteraction, Omitted>) {
		super(data);
	}
}
