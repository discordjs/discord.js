import type { APIModalSubmission } from 'discord-api-types/v10';
import { Structure } from '../Structure.js';
import { kData } from '../utils/symbols.js';
import type { Partialize } from '../utils/types.js';

/**
 * The submitted data of a modal, without constructing its component responses.
 *
 * @typeParam Omitted - Properties removed from raw data by `DataTemplate`
 * @remarks The raw `components` and `resolved` fields contain `ModalSubmitComponent` and `ResolvedInteractionData`
 * left for extending classes. They are preserved by `toJSON()`, including null submitted values.
 */
export class ModalSubmitInteractionData<Omitted extends keyof APIModalSubmission | '' = ''> extends Structure<
	APIModalSubmission,
	Omitted
> {
	public static override readonly DataTemplate: Partial<APIModalSubmission> = {};

	/**
	 * @param data - The raw modal submission data
	 */
	public constructor(data: Partialize<APIModalSubmission, Omitted>) {
		super(data);
	}

	/**
	 * The developer-defined identifier of the submitted modal
	 */
	public get customId() {
		return this[kData].custom_id;
	}
}
