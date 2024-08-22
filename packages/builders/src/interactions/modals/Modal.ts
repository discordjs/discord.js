/* eslint-disable jsdoc/check-param-names */

import type { JSONEncodable } from '@discordjs/util';
import type {
	APIActionRowComponent,
	APIModalActionRowComponent,
	APIModalInteractionResponseCallbackData,
} from 'discord-api-types/v10';
import { ActionRowBuilder, type ModalActionRowComponentBuilder } from '../../components/ActionRow.js';
import { customIdValidator } from '../../components/Assertions.js';
import { createComponentBuilder } from '../../components/Components.js';
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
	public readonly components: ActionRowBuilder<ModalActionRowComponentBuilder>[] = [];

	/**
	 * Creates a new modal from API data.
	 *
	 * @param data - The API data to create this modal with
	 */
	public constructor({ components, ...data }: Partial<APIModalInteractionResponseCallbackData> = {}) {
		this.data = { ...data };
		this.components = (components?.map((component) => createComponentBuilder(component)) ??
			[]) as ActionRowBuilder<ModalActionRowComponentBuilder>[];
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
	 */
	public addComponents(
		...components: RestOrArray<
			ActionRowBuilder<ModalActionRowComponentBuilder> | APIActionRowComponent<APIModalActionRowComponent>
		>
	) {
		this.components.push(
			...normalizeArray(components).map((component) =>
				component instanceof ActionRowBuilder
					? component
					: new ActionRowBuilder<ModalActionRowComponentBuilder>(component),
			),
		);
		return this;
	}

	/**
	 * Sets components for this modal.
	 *
	 * @param components - The components to set
	 */
	public setComponents(...components: RestOrArray<ActionRowBuilder<ModalActionRowComponentBuilder>>) {
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
