import type { APIPingInteraction, InteractionType } from 'discord-api-types/v10';
import { Interaction } from './Interaction.js';
import type { PartializeInteraction } from './types.js';

/**
 * An incoming endpoint verification ping.
 *
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 * @remarks Uses the API ping envelope; a ping has no user locale or interaction data payload.
 */
export class PingInteraction<Omitted extends keyof APIPingInteraction | '' = 'app_permissions'> extends Interaction<
	InteractionType.Ping,
	Omitted
> {
	public static override readonly DataTemplate: Partial<APIPingInteraction> = {
		set app_permissions(_value: string) {},
	};

	/**
	 * @param data - The raw API ping
	 */
	public constructor(data: PartializeInteraction<APIPingInteraction, Omitted>) {
		super(data);
	}
}
