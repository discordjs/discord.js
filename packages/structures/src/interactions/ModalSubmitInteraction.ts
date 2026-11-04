import type { APIModalSubmitInteraction, InteractionType } from 'discord-api-types/v10';
import type { PartializeInteraction } from './types.js';
import { UserInteraction } from './UserInteraction.js';

/**
 * An incoming modal submission.
 *
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 * @remarks The raw `data`, `guild`, `channel`, `member`, `user`, `message`, and `entitlements` fields contain
 * `ModalSubmitInteractionData`, `Guild`, `Channel`, `GuildMember`, `User`, `Message`, and `Entitlement`
 * substructures left for extending classes. Submitted components are not component definitions.
 */
export class ModalSubmitInteraction<
	Omitted extends keyof APIModalSubmitInteraction | '' = 'app_permissions',
> extends UserInteraction<InteractionType.ModalSubmit, Omitted> {
	public static override readonly DataTemplate: Partial<APIModalSubmitInteraction> = {
		set app_permissions(_value: string) {},
	};

	/**
	 * @param data - The raw API modal submit interaction
	 */
	public constructor(data: PartializeInteraction<APIModalSubmitInteraction, Omitted>) {
		super(data);
	}
}
