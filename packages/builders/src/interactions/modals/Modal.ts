/* eslint-disable jsdoc/check-param-names */

import type { JSONEncodable } from '@discordjs/util';
import type {
	APIActionRowComponent,
	APIModalActionRowComponent,
	APIModalInteractionResponseCallbackData,
} from 'discord-api-types/v10';
import { ActionRowBuilder } from '../../components/ActionRow.js';
import { createComponentBuilder } from '../../components/Components.js';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { resolveBuilder } from '../../util/resolveBuilder.js';
import { validate } from '../../util/validation.js';
import { modalPredicate } from './Assertions.js';

export interface ModalBuilderData extends Partial<Omit<APIModalInteractionResponseCallbackData, 'components'>> {
	components: ActionRowBuilder[];
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
	public get components(): readonly ActionRowBuilder[] {
		return this.data.components;
	}

	/**
	 * Creates a new modal from API data.
	 *
	 * @param data - The API data to create this modal with
	 */
	public constructor({ components = [], ...data }: Partial<APIModalInteractionResponseCallbackData> = {}) {
		this.data = {
			...structuredClone(data),
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
	 * Adds action rows to this modal.
	 *
	 * @param components - The components to add
	 */
	public addActionRows(
		...components: RestOrArray<
			| ActionRowBuilder
			| APIActionRowComponent<APIModalActionRowComponent>
			| ((builder: ActionRowBuilder) => ActionRowBuilder)
		>
	) {
		const normalized = normalizeArray(components);
		const resolved = normalized.map((row) => resolveBuilder(row, ActionRowBuilder));

		this.data.components.push(...resolved);

		return this;
	}

	/**
	 * Sets the action rows for this modal.
	 *
	 * @param components - The components to set
	 */
	public setActionRows(
		...components: RestOrArray<
			| ActionRowBuilder
			| APIActionRowComponent<APIModalActionRowComponent>
			| ((builder: ActionRowBuilder) => ActionRowBuilder)
		>
	) {
		const normalized = normalizeArray(components);
		this.spliceActionRows(0, this.data.components.length, ...normalized);

		return this;
	}

	/**
	 * Removes, replaces, or inserts action rows for this modal.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
	 * The maximum amount of action rows that can be added is 5.
	 *
	 * It's useful for modifying and adjusting order of the already-existing action rows of a modal.
	 * @example
	 * Remove the first action row:
	 * ```ts
	 * embed.spliceActionRows(0, 1);
	 * ```
	 * @example
	 * Remove the first n action rows:
	 * ```ts
	 * const n = 4;
	 * embed.spliceActionRows(0, n);
	 * ```
	 * @example
	 * Remove the last action row:
	 * ```ts
	 * embed.spliceActionRows(-1, 1);
	 * ```
	 * @param index - The index to start at
	 * @param deleteCount - The number of action rows to remove
	 * @param rows - The replacing action row objects
	 */
	public spliceActionRows(
		index: number,
		deleteCount: number,
		...rows: (
			| ActionRowBuilder
			| APIActionRowComponent<APIModalActionRowComponent>
			| ((builder: ActionRowBuilder) => ActionRowBuilder)
		)[]
	): this {
		const resolved = rows.map((row) => resolveBuilder(row, ActionRowBuilder));
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
