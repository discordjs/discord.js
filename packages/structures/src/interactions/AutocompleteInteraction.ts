import type { APIApplicationCommandAutocompleteInteraction, InteractionType } from 'discord-api-types/v10';
import type { PartializeInteraction } from './types.js';
import { UserInteraction } from './UserInteraction.js';

/**
 * An incoming application command autocomplete request.
 *
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 * @remarks The raw `data`, `guild`, `channel`, `member`, `user`, `message`, and `entitlements` fields contain
 * `AutocompleteInteractionData`, `Guild`, `Channel`, `GuildMember`, `User`, `Message`, and `Entitlement`
 * substructures left for extending classes. Autocomplete options retain partial input values.
 */
export class AutocompleteInteraction<
	Omitted extends keyof APIApplicationCommandAutocompleteInteraction | '' = 'app_permissions',
> extends UserInteraction<InteractionType.ApplicationCommandAutocomplete, Omitted> {
	public static override readonly DataTemplate: Partial<APIApplicationCommandAutocompleteInteraction> = {
		set app_permissions(_value: string) {},
	};

	/**
	 * @param data - The raw API autocomplete interaction
	 */
	public constructor(data: PartializeInteraction<APIApplicationCommandAutocompleteInteraction, Omitted>) {
		super(data);
	}
}
