import type { APITextInputComponent } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';
import { Component } from './Component.js';

/**
 * Represents a text input component on a message.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class TextInputComponent<Omitted extends keyof APITextInputComponent | '' = ''> extends Component<
	APITextInputComponent,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each TextInputComponent.
	 */
	public static override readonly DataTemplate: Partial<APITextInputComponent> = {};

	/**
	 * @param data - The raw data received from the API for the text input
	 */
	public constructor(data: Partialize<APITextInputComponent, Omitted>) {
		super(data);
	}

	public get customId() {
		return this[kData].custom_id;
	}

	public get label() {
		return this[kData].label;
	}

	public get maxLength() {
		return this[kData].max_length;
	}

	public get minLength() {
		return this[kData].min_length;
	}

	public get placeholder() {
		return this[kData].placeholder;
	}

	public get required() {
		return this[kData].required;
	}

	public get style() {
		return this[kData].style;
	}

	public get value() {
		return this[kData].value;
	}
}
