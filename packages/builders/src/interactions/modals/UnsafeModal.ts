import type {
	APIActionRowComponent,
	APIModalActionRowComponent,
	APIModalInteractionResponseCallbackData,
} from 'discord-api-types/v9';
import { ActionRow, createComponent, JSONEncodable, ModalActionRowComponent } from '../../index';

export class UnsafeModal implements JSONEncodable<APIModalInteractionResponseCallbackData> {
	protected readonly data: Partial<Omit<APIModalInteractionResponseCallbackData, 'components'>>;
	public readonly components: ActionRow<ModalActionRowComponent>[] = [];

	public constructor({ components, ...data }: Partial<APIModalInteractionResponseCallbackData> = {}) {
		this.data = { ...data };
		this.components = (components?.map((c) => createComponent(c)) ?? []) as ActionRow<ModalActionRowComponent>[];
	}

	/**
	 * The custom id of this modal
	 */
	public get customId() {
		return this.data.custom_id;
	}

	/**
	 * The title of this modal
	 */
	public get title() {
		return this.data.title;
	}

	/**
	 * Sets the title of the modal
	 * @param title The title of the modal
	 */
	public setTitle(title: string) {
		this.data.title = title;
		return this;
	}

	/**
	 * Sets the custom id of the modal
	 * @param customId The custom id of this modal
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customId;
		return this;
	}

	/**
	 * Adds components to this modal
	 * @param components The components to add to this modal
	 */
	public addComponents(
		...components: (ActionRow<ModalActionRowComponent> | APIActionRowComponent<APIModalActionRowComponent>)[]
	) {
		this.components.push(
			...components.map((component) =>
				component instanceof ActionRow ? component : new ActionRow<ModalActionRowComponent>(component),
			),
		);
		return this;
	}

	/**
	 * Sets the components in this modal
	 * @param components The components to set this modal to
	 */
	public setComponents(...components: ActionRow<ModalActionRowComponent>[]) {
		this.components.splice(0, this.components.length, ...components);
		return this;
	}

	public toJSON(): APIModalInteractionResponseCallbackData {
		// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
		return {
			...this.data,
			components: this.components.map((component) => component.toJSON()),
		} as APIModalInteractionResponseCallbackData;
	}
}
