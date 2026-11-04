import type { APIApplicationCommandAutocompleteInteraction } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * Autocomplete data as received in an interaction, including its required options array.
 */
export type AutocompleteInteractionDataType = APIApplicationCommandAutocompleteInteraction['data'];

/**
 * Data describing an autocomplete request for a chat input command.
 *
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 * @remarks The raw `options` array contains `ApplicationCommandInteractionDataOption` substructures,
 * including `AutocompleteInteractionDataOption` for focusable inputs. The raw `resolved` field contains
 * `ResolvedInteractionData`. These are left for extending classes.
 * Options retain Discord's autocomplete types, including string input for incomplete numeric values.
 */
export class AutocompleteInteractionData<
	Omitted extends keyof AutocompleteInteractionDataType | '' = '',
> extends Structure<AutocompleteInteractionDataType, Omitted> {
	public static override readonly DataTemplate: Partial<AutocompleteInteractionDataType> = {};

	/**
	 * @param data - The raw autocomplete data from the interaction
	 */
	public constructor(data: Partialize<AutocompleteInteractionDataType, Omitted>) {
		super(data);
	}

	/**
	 * The id of the invoked command
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The name of the invoked command
	 */
	public get name() {
		return this[kData].name;
	}

	/**
	 * The command type, always chat input
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * The guild in which the command is registered, if any
	 */
	public get guildId() {
		return this[kData].guild_id;
	}
}
