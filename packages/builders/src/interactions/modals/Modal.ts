import type { APIModalInteractionResponseCallbackData } from 'discord-api-types/v9';
import { ActionRow, createComponent, ModalActionRowComponent } from '../..';
import { customIdValidator } from '../../components/Assertions';

export class Modal {
	public readonly title!: string;
	public readonly custom_id!: string;
	public readonly components: ActionRow<ModalActionRowComponent>[] = [];

	public constructor(data?: APIModalInteractionResponseCallbackData) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
		this.title = data?.title!;
		// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
		this.custom_id = data?.custom_id!;
		this.components = (data?.components.map(createComponent) ?? []) as ActionRow<ModalActionRowComponent>[];
	}

	/**
	 * Sets the title of the modal
	 * @param title The title of the modal
	 */
	public setTitle(title: string) {
		Reflect.set(this, 'title', title);
		return this;
	}

	/**
	 * Sets the custom Id of the modal
	 * @param customId The custom Id of this modal
	 */
	public setCustomId(customId: string) {
		customIdValidator.parse(customId);
		Reflect.set(this, 'custom_id', customId);
		return this;
	}

	/**
	 * Adds components to this modal
	 * @param components The components to add to this modal
	 */
	public addComponents(...components: ActionRow<ModalActionRowComponent>[]) {
		this.components.push(...components);
		return this;
	}

	/**
	 * Sets the components in this modal
	 * @param components The components to set this modal to
	 */
	public setComponents(...components: ActionRow<ModalActionRowComponent>[]) {
		Reflect.set(this, 'components', [...components]);
		return this;
	}

	// TODO: Use dapi types
	public toJSON(): unknown {
		return {
			...this,
			components: this.components.map((component) => component.toJSON()),
		};
	}
}
