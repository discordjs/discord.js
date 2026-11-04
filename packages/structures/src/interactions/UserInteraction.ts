import type { InteractionType } from 'discord-api-types/v10';
import { kData } from '../utils/symbols.js';
import { Interaction } from './Interaction.js';
import type { InteractionDataType, PartializeInteraction } from './types.js';

/**
 * Common metadata for interactions triggered by a user, excluding endpoint pings.
 *
 * @typeParam Type - The incoming user interaction type
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 * @remarks The raw nested fields documented on {@link Interaction} contain `ApplicationCommandInteractionData`,
 * `AutocompleteInteractionData`, `MessageComponentInteractionData`, `ModalSubmitInteractionData`, `Guild`, `Channel`,
 * `GuildMember`, `User`, `Message`, and `Entitlement` substructures. These are left for extending classes.
 */
export abstract class UserInteraction<
	Type extends Exclude<InteractionType, InteractionType.Ping> = Exclude<InteractionType, InteractionType.Ping>,
	Omitted extends keyof InteractionDataType<Type> | '' = 'app_permissions',
> extends Interaction<Type, Omitted> {
	public static override readonly DataTemplate: Partial<
		InteractionDataType<Exclude<InteractionType, InteractionType.Ping>>
	> = {
		set app_permissions(_value: string) {},
	};

	/**
	 * @param data - The raw incoming API interaction
	 */
	public constructor(data: PartializeInteraction<InteractionDataType<Type>, Omitted>) {
		super(data);
	}

	/**
	 * The selected language of the invoking user
	 */
	public get locale() {
		return this[kData].locale;
	}
}
