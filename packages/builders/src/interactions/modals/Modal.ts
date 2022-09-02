import type {
	APIActionRowComponent,
	APIModalActionRowComponent,
	APIModalInteractionResponseCallbackData,
} from 'discord-api-types/v10';
import { ActionRowBuilder, type ModalActionRowComponentBuilder } from '../../components/ActionRow.js';
import { customIdValidator } from '../../components/Assertions.js';
import { createComponentBuilder } from '../../components/Components.js';
import type { JSONEncodable } from '../../util/jsonEncodable';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { titleValidator, validateRequiredParameters } from './Assertions.js';

export class ModalBuilder implements JSONEncodable<APIModalInteractionResponseCallbackData> {
	public readonly data: Partial<APIModalInteractionResponseCallbackData>;

	public readonly components: ActionRowBuilder<ModalActionRowComponentBuilder>[] = [];

	public constructor({ components, ...data }: Partial<APIModalInteractionResponseCallbackData> = {}) {
		this.data = { ...data };
		this.components = (components?.map((component) => createComponentBuilder(component)) ??
			[]) as ActionRowBuilder<ModalActionRowComponentBuilder>[];
	}

	/**
	 * Sets the title of the modal
	 *
	 * @param title - The title of the modal
	 */
	public setTitle(title: string) {
		this.data.title = titleValidator.parse(title);
		return this;
	}

	/**
	 * Sets the custom id of the modal
	 *
	 * @param customId - The custom id of this modal
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customIdValidator.parse(customId);
		return this;
	}

	/**
	 * Adds components to this modal
	 *
	 * @param components - The components to add to this modal
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
	 * Sets the components in this modal
	 *
	 * @param components - The components to set this modal to
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
