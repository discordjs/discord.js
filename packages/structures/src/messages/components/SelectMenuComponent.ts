import type { APISelectMenuComponent } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';
import { Component } from './Component.js';

export abstract class SelectMenuComponent<
	Type extends APISelectMenuComponent,
	Omitted extends keyof Type | '' = '',
> extends Component<Type, Omitted> {
	/**
	 * @param data - The raw data received from the API for the select menu
	 */
	public constructor(data: Partialize<Type, Omitted>) {
		super(data);
	}

	/**
	 * The customId to be sent in the interaction when a selection is made
	 */
	public get customId() {
		return this[kData].custom_id;
	}

	/**
	 * Whether the select menu is disabled
	 */
	public get disabled() {
		return this[kData].disabled;
	}

	/**
	 * The maximum number of items that can be chosen
	 */
	public get maxValues() {
		return this[kData].max_values;
	}

	/**
	 * The minimum number of items that must be chosen
	 */
	public get minValues() {
		return this[kData].min_values;
	}

	/**
	 * Custom placeholder text if nothing is selected
	 */
	public get placeholder() {
		return this[kData].placeholder;
	}

	/**
	 * Whether a selection is required
	 */
	public get required() {
		return this[kData].required;
	}
}
