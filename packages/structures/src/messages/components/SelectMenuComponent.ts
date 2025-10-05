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

	public get customId() {
		return this[kData].custom_id;
	}

	public get disabled() {
		return this[kData].disabled;
	}

	public get maxValues() {
		return this[kData].max_values;
	}

	public get minValues() {
		return this[kData].min_values;
	}

	public get placeholder() {
		return this[kData].placeholder;
	}
}
