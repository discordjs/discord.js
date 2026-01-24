import type { APIAutoModerationAction } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

/**
 * Represents an auto moderation action on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks has substructure `ActionMetadata` which needs to be instantiated and stored by an extending class using it
 */
export class AutoModerationAction<Omitted extends keyof APIAutoModerationAction | '' = ''> extends Structure<
	APIAutoModerationAction,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each auto moderation action
	 */
	public static override DataTemplate: Partial<APIAutoModerationAction> = {};

	/**
	 * @param data - The raw data received from the API for the auto moderation action
	 */
	public constructor(data: Partialize<APIAutoModerationAction, Omitted>) {
		super(data);
	}

	/**
	 * The {@link https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-action-object-action-types | action type}
	 */
	public get type() {
		return this[kData].type;
	}
}
