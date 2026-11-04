import type { APIInteraction, InteractionType } from 'discord-api-types/v10';
import type { Partialize } from '../utils/types.js';

/**
 * The raw API envelope for a particular incoming interaction type.
 */
export type InteractionDataType<Type extends InteractionType> = {
	[Kind in InteractionType]: Extract<APIInteraction, { type: Kind }>;
}[Type];

/**
 * Applies omissions to each member of an API union without losing its discriminants or variant fields.
 */
export type PartializeInteraction<Data, Omitted extends keyof Data | ''> = Partial<Data> &
	(Data extends unknown ? Partialize<Data, Omitted> : never);
