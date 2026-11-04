import type { APIMessageComponentInteraction, InteractionType } from 'discord-api-types/v10';
import type { PartializeInteraction } from './types.js';
import { UserInteraction } from './UserInteraction.js';

/**
 * An incoming button or select menu interaction.
 *
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 * @remarks The raw `data`, `guild`, `channel`, `member`, `user`, `message`, and `entitlements` fields contain
 * `MessageComponentInteractionData`, `Guild`, `Channel`, `GuildMember`, `User`, `Message`, and `Entitlement`
 * substructures left for extending classes. No message components are constructed here.
 */
export class MessageComponentInteraction<
	Omitted extends keyof APIMessageComponentInteraction | '' = 'app_permissions',
> extends UserInteraction<InteractionType.MessageComponent, Omitted> {
	public static override readonly DataTemplate: Partial<APIMessageComponentInteraction> = {
		set app_permissions(_value: string) {},
	};

	/**
	 * @param data - The raw API message component interaction
	 */
	public constructor(data: PartializeInteraction<APIMessageComponentInteraction, Omitted>) {
		super(data);
	}
}
