import type {
	APIInteractionDataResolved,
	APIMessageApplicationCommandInteractionDataResolved,
} from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import type { Partialize } from '../utils/types.js';

/**
 * Resolved entity maps, including the messages supplied by message context menu commands.
 */
export type ResolvedInteractionDataType = APIInteractionDataResolved &
	Partial<APIMessageApplicationCommandInteractionDataResolved>;

/**
 * Represents resolved entity data from commands, message components, and modal submissions.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks The raw entity maps contain `User`, `Channel`, `Role`, `Message`, `GuildMember`, and `Attachment`
 * substructures. An extending class must construct and store these and may expose its own getters for the maps.
 */
export abstract class ResolvedInteractionData<
	Omitted extends keyof ResolvedInteractionDataType | '' = '',
> extends Structure<ResolvedInteractionDataType, Omitted> {
	public static override readonly DataTemplate: Partial<ResolvedInteractionDataType> = {};

	/**
	 * @param data - The raw resolved entity maps from the API
	 */
	public constructor(data: Partialize<ResolvedInteractionDataType, Omitted>) {
		super(data);
	}
}
