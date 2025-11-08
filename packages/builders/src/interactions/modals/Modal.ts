/* eslint-disable jsdoc/check-param-names */

import type { JSONEncodable } from '@discordjs/util';
import type {
	APITextInputComponent,
	APIActionRowComponent,
	APIComponentInModalActionRow,
	APILabelComponent,
	APIModalInteractionResponseCallbackData,
	APITextDisplayComponent,
} from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { ActionRowBuilder, type ModalActionRowComponentBuilder } from '../../components/ActionRow.js';
import { customIdValidator } from '../../components/Assertions.js';
import { createComponentBuilder, resolveBuilder } from '../../components/Components.js';
import { LabelBuilder } from '../../components/label/Label.js';
import { TextInputBuilder } from '../../components/textInput/TextInput.js';
import { TextDisplayBuilder } from '../../components/v2/TextDisplay.js';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { titleValidator, validateRequiredParameters } from './Assertions.js';

/**
 * A builder that creates API-compatible JSON data for modals.
 */
export class ModalBuilder implements JSONEncodable<APIModalInteractionResponseCallbackData> {
	/**
	 * The API data associated with this modal.
	 */
	public readonly data: Partial<APIModalInteractionResponseCallbackData>;

	/**
	 * The components within this modal.
	 */
	public readonly components: (ActionRowBuilder<ModalActionRowComponentBuilder> | LabelBuilder | TextDisplayBuilder)[] =
		[];

	/**
	 * Creates a new modal from API data.
	 *
	 * @param data - The API data to create this modal with
	 */
	public constructor({ components, ...data }: Partial<APIModalInteractionResponseCallbackData> = {}) {
		this.data = { ...data };
		this.components = (components?.map((component) => createComponentBuilder(component)) ?? []) as (
			| ActionRowBuilder<ModalActionRowComponentBuilder>
			| LabelBuilder
		)[];
	}

	/**
	 * Sets the title of this modal.
	 *
	 * @param title - The title to use
	 */
	public setTitle(title: string) {
		this.data.title = titleValidator.parse(title);
		return this;
	}

	/**
	 * Sets the custom id of this modal.
	 *
	 * @param customId - The custom id to use
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customIdValidator.parse(customId);
		return this;
	}

	/**
	 * Adds components to this modal.
	 *
	 * @param components - The components to add
	 * @deprecated Use {@link ModalBuilder.addLabelComponents} or {@link ModalBuilder.addTextDisplayComponents} instead
	 */
	public addComponents(
		...components: RestOrArray<
			| ActionRowBuilder<ModalActionRowComponentBuilder>
			| APIActionRowComponent<APIComponentInModalActionRow>
			| APILabelComponent
			| APITextDisplayComponent
			| APITextInputComponent
			| LabelBuilder
			| TextDisplayBuilder
			| TextInputBuilder
		>
	) {
		this.components.push(
			...normalizeArray(components).map((component, idx) => {
				if (
					component instanceof ActionRowBuilder ||
					component instanceof LabelBuilder ||
					component instanceof TextDisplayBuilder
				) {
					return component;
				}

				// Deprecated support
				if (component instanceof TextInputBuilder) {
					return new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(component);
				}

				if ('type' in component) {
					if (component.type === ComponentType.ActionRow) {
						return new ActionRowBuilder<ModalActionRowComponentBuilder>(component);
					}

					if (component.type === ComponentType.Label) {
						return new LabelBuilder(component);
					}

					if (component.type === ComponentType.TextDisplay) {
						return new TextDisplayBuilder(component);
					}

					// Deprecated, should go in a label component
					if (component.type === ComponentType.TextInput) {
						return new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
							new TextInputBuilder(component),
						);
					}
				}

				throw new TypeError(`Invalid component passed in ModalBuilder.addComponents at index ${idx}!`);
			}),
		);
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

		this.components.push(...resolved);

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

		this.components.push(...resolved);

		return this;
	}

	/**
	 * Adds action rows to this modal.
	 *
	 * @param components - The components to add
	 * @deprecated Use {@link ModalBuilder.addLabelComponents} instead
	 */
	public addActionRowComponents(
		...components: RestOrArray<
			| ActionRowBuilder<ModalActionRowComponentBuilder>
			| APIActionRowComponent<APIComponentInModalActionRow>
			| ((
					builder: ActionRowBuilder<ModalActionRowComponentBuilder>,
			  ) => ActionRowBuilder<ModalActionRowComponentBuilder>)
		>
	) {
		const normalized = normalizeArray(components);
		const resolved = normalized.map((row) => resolveBuilder(row, ActionRowBuilder<ModalActionRowComponentBuilder>));

		this.components.push(...resolved);

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
		this.spliceLabelComponents(0, this.components.length, ...normalized);

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
		this.components.splice(index, deleteCount, ...resolved);

		return this;
	}

	/**
	 * Sets components for this modal.
	 *
	 * @param components - The components to set
	 * @deprecated Use {@link ModalBuilder.setLabelComponents} instead
	 */
	public setComponents(
		...components: RestOrArray<ActionRowBuilder<ModalActionRowComponentBuilder> | LabelBuilder | TextDisplayBuilder>
	) {
		this.components.splice(0, this.components.length, ...normalizeArray(components));
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(): APIModalInteractionResponseCallbackData {
		validateRequiredParameters(this.data.custom_id, this.data.title, this.components);

		return {
			...this.data,
			components: this.components.map((component) => component.toJSON()),
		} as APIModalInteractionResponseCallbackData;
	}
}
