import type { APIFileUploadComponent } from 'discord-api-types/v10';
import { kData } from '../../utils/symbols.js';
import type { Partialize } from '../../utils/types.js';
import { Component } from './Component.js';

/**
 * Represents a file upload component on a modal.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class FileUploadComponent<Omitted extends keyof APIFileUploadComponent | '' = ''> extends Component<
	APIFileUploadComponent,
	Omitted
> {
	/**
	 * The template used for removing data from the raw data stored for each FileUploadComponent.
	 */
	public static override readonly DataTemplate: Partial<APIFileUploadComponent> = {};

	/**
	 * @param data - The raw data received from the API for the file upload component
	 */
	public constructor(data: Partialize<APIFileUploadComponent, Omitted>) {
		super(data);
	}

	/**
	 * The customId to be sent in the interaction when the modal gets submitted
	 */
	public get customId() {
		return this[kData].custom_id;
	}

	/**
	 * The maximum number of items that can be uploaded
	 */
	public get maxValues() {
		return this[kData].max_values;
	}

	/**
	 * The minimum number of items that must be uploaded
	 */
	public get minValues() {
		return this[kData].min_values;
	}

	/**
	 * Whether the file upload requires files to be uploaded before submitting the modal
	 */
	public get required() {
		return this[kData].required;
	}
}
