import type { JSONEncodable } from '@discordjs/util';
import type { APILabelComponent, APIModalInteractionResponseCallbackData } from 'discord-api-types/v10';
import type { ActionRowBuilder } from '../../components/ActionRow.js';
import { createComponentBuilder } from '../../components/Components.js';
import { LabelBuilder } from '../../components/label/Label.js';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { resolveBuilder } from '../../util/resolveBuilder.js';
import { validate } from '../../util/validation.js';
import { modalPredicate } from './Assertions.js';

export interface ModalBuilderData extends Partial<Omit<APIModalInteractionResponseCallbackData, 'components'>> {
	components: (ActionRowBuilder | LabelBuilder)[];
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
	public get components(): readonly (ActionRowBuilder | LabelBuilder)[] {
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
			// @ts-expect-error https://github.com/discordjs/discord.js/pull/11078
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
	 * Sets the labels for this modal.
	 *
	 * @param components - The components to set
	 */
	public setLabelComponents(
		...components: RestOrArray<APILabelComponent | LabelBuilder | ((builder: LabelBuilder) => LabelBuilder)>
	) {
		const normalized = normalizeArray(components);
		this.spliceLabelComponents(0, this.data.components.length, ...normalized);

		return this;
	}

	/**
	 * Removes, replaces, or inserts labels for this modal.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
	 * The maximum amount of labels that can be added is 5.
	 *
	 * It's useful for modifying and adjusting order of the already-existing labels of a modal.
	 * @example
	 * Remove the first label:
	 * ```ts
	 * modal.spliceLabelComponents(0, 1);
	 * ```
	 * @example
	 * Remove the first n labels:
	 * ```ts
	 * const n = 4;
	 * modal.spliceLabelComponents(0, n);
	 * ```
	 * @example
	 * Remove the last label:
	 * ```ts
	 * modal.spliceLabelComponents(-1, 1);
	 * ```
	 * @param index - The index to start at
	 * @param deleteCount - The number of labels to remove
	 * @param labels - The replacing label objects
	 */
	public spliceLabelComponents(
		index: number,
		deleteCount: number,
		...labels: (APILabelComponent | LabelBuilder | ((builder: LabelBuilder) => LabelBuilder))[]
	): this {
		const resolved = labels.map((label) => resolveBuilder(label, LabelBuilder));
		this.data.components.splice(index, deleteCount, ...resolved);

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
