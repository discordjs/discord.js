import type { APISelectMenuDefaultValue, SelectMenuDefaultValueType } from 'discord-api-types/v10';
import { Structure } from '../../Structure.js';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';

export class SelectMenuDefaultValue<
	Type extends SelectMenuDefaultValueType,
	Omitted extends keyof APISelectMenuDefaultValue<Type> | '' = '',
> extends Structure<APISelectMenuDefaultValue<Type>, Omitted> {
	/**
	 * The template used for removing data from the raw data stored for each SelectMenuDefaultValue.
	 */
	public static override readonly DataTemplate: Partial<APISelectMenuDefaultValue<SelectMenuDefaultValueType>> = {};

	/**
	 * @param data - The raw data received from the API for the select menu default value
	 */
	public constructor(data: Partialize<APISelectMenuDefaultValue<Type>, Omitted>) {
		super(data);
	}

	public get id() {
		return this[kData].id;
	}

	public get type() {
		return this[kData].type;
	}
}
