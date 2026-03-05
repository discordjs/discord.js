import type { JSONEncodable } from '@discordjs/util';
import type {
	APILabelComponent,
	APIModalInteractionResponseCallbackData,
	APITextDisplayComponent,
} from 'discord-api-types/v10';
import type { ActionRowBuilder } from '../../components/ActionRow.js';
import type { AnyModalComponentBuilder } from '../../components/Components.js';
import { createComponentBuilder } from '../../components/Components.js';
import { LabelBuilder } from '../../components/label/Label.js';
import { TextDisplayBuilder } from '../../components/v2/TextDisplay.js';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { resolveBuilder } from '../../util/resolveBuilder.js';
import { validate } from '../../util/validation.js';
import { modalPredicate } from './Assertions.js';

export interface ModalBuilderData extends Partial<Omit<APIModalInteractionResponseCallbackData, 'components'>> {
	components: (ActionRowBuilder | AnyModalComponentBuilder)[];
}

/**
 * A builder that creates API-compatible JSON data for modals.
 */
export class ModalBuilder implements JSONEncodable<APIModalInteractionResponseCallbackData> {
	/**
	 * The API data associated with this modal.
	 */
	private readonly data: ModalBuilderData;

	/**
	 * The components within this modal.
	 */
	public get components(): readonly (ActionRowBuilder | AnyModalComponentBuilder)[] {
		return this.data.components;
	}

	/**
	 * Creates a new modal.
	 *
	 * @param data - The API data to create this modal with
	 */
	public constructor(data: Partial<APIModalInteractionResponseCallbackData> = {}) {
		const { components = [], ...rest } = data;

		this.data = {
			...structuredClone(rest),
			components: components.map((component) => createComponentBuilder(component)),
		};
	}

	/**
	 * Sets the title of this modal.
	 *
	 * @param title - The title to use
	 */
	public setTitle(title: string) {
		this.data.title = title;
		return this;
	}

	/**
	 * Sets the custom id of this modal.
	 *
	 * @param customId - The custom id to use
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customId;
		return this;
	}

	/**
	 * Adds label components to this modal.
	 *
	 * @param components - The components to add
	 */
	public addLabelComponents(
		...components: RestOrArray<APILabelComponent | LabelBuilder | ((builder: LabelBuilder) => LabelBuilder)>
	) {
		const normalized = normalizeArray(components);
		const resolved = normalized.map((label) => resolveBuilder(label, LabelBuilder));

		this.data.components.push(...resolved);

		return this;
	}

	/**
	 * Adds text display components to this modal.
	 *
	 * @param components - The components to add
	 */
	public addTextDisplayComponents(
		...components: RestOrArray<
			APITextDisplayComponent | TextDisplayBuilder | ((builder: TextDisplayBuilder) => TextDisplayBuilder)
		>
	) {
		const normalized = normalizeArray(components);
		const resolved = normalized.map((row) => resolveBuilder(row, TextDisplayBuilder));

		this.data.components.push(...resolved);

		return this;
	}

	/**
	 * Removes, replaces, or inserts components for this modal.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
	 * The maximum amount of components that can be added is 5.
	 *
	 * It's useful for modifying and adjusting order of the already-existing components of a modal.
	 * @example
	 * Remove the first component:
	 * ```ts
	 * modal.spliceComponents(0, 1);
	 * ```
	 * @example
	 * Remove the first n components:
	 * ```ts
	 * const n = 4;
	 * modal.spliceComponents(0, n);
	 * ```
	 * @example
	 * Remove the last component:
	 * ```ts
	 * modal.spliceComponents(-1, 1);
	 * ```
	 * @param index - The index to start at
	 * @param deleteCount - The number of components to remove
	 * @param components - The replacing components
	 */
	public spliceComponents(index: number, deleteCount: number, ...components: AnyModalComponentBuilder[]): this {
		this.data.components.splice(index, deleteCount, ...components);
		return this;
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public toJSON(validationOverride?: boolean): APIModalInteractionResponseCallbackData {
		const { components, ...rest } = this.data;

		const data = {
			...structuredClone(rest),
			components: components.map((component) => component.toJSON(validationOverride)),
		};

		validate(modalPredicate, data, validationOverride);

		return data as APIModalInteractionResponseCallbackData;
	}
}
