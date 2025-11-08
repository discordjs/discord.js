import type {
	APIChannelSelectComponent,
	APIFileUploadComponent,
	APILabelComponent,
	APIMentionableSelectComponent,
	APIRoleSelectComponent,
	APIStringSelectComponent,
	APITextInputComponent,
	APIUserSelectComponent,
} from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { ComponentBuilder } from '../Component.js';
import { createComponentBuilder, resolveBuilder } from '../Components.js';
import { FileUploadBuilder } from '../fileUpload/FileUpload.js';
import { ChannelSelectMenuBuilder } from '../selectMenu/ChannelSelectMenu.js';
import { MentionableSelectMenuBuilder } from '../selectMenu/MentionableSelectMenu.js';
import { RoleSelectMenuBuilder } from '../selectMenu/RoleSelectMenu.js';
import { StringSelectMenuBuilder } from '../selectMenu/StringSelectMenu.js';
import { UserSelectMenuBuilder } from '../selectMenu/UserSelectMenu.js';
import { TextInputBuilder } from '../textInput/TextInput.js';
import { labelPredicate } from './Assertions.js';

export interface LabelBuilderData extends Partial<Omit<APILabelComponent, 'component'>> {
	component?:
		| ChannelSelectMenuBuilder
		| FileUploadBuilder
		| MentionableSelectMenuBuilder
		| RoleSelectMenuBuilder
		| StringSelectMenuBuilder
		| TextInputBuilder
		| UserSelectMenuBuilder;
}

/**
 * A builder that creates API-compatible JSON data for labels.
 */
export class LabelBuilder extends ComponentBuilder<LabelBuilderData> {
	/**
	 * @internal
	 */
	public override readonly data: LabelBuilderData;

	/**
	 * Creates a new label.
	 *
	 * @param data - The API data to create this label with
	 * @example
	 * Creating a label from an API data object:
	 * ```ts
	 * const label = new LabelBuilder({
	 * 	label: "label",
	 * 	component,
	 * });
	 * ```
	 * @example
	 * Creating a label using setters and API data:
	 * ```ts
	 * const label = new LabelBuilder({
	 * 	label: 'label',
	 * 	component,
	 * }).setLabel('new text');
	 * ```
	 */
	public constructor(data: Partial<APILabelComponent> = {}) {
		super({ type: ComponentType.Label });

		const { component, ...rest } = data;

		this.data = {
			...rest,
			component: component ? createComponentBuilder(component) : undefined,
			type: ComponentType.Label,
		};
	}

	/**
	 * Sets the label for this label.
	 *
	 * @param label - The label to use
	 */
	public setLabel(label: string) {
		this.data.label = label;
		return this;
	}

	/**
	 * Sets the description for this label.
	 *
	 * @param description - The description to use
	 */
	public setDescription(description: string) {
		this.data.description = description;
		return this;
	}

	/**
	 * Clears the description for this label.
	 */
	public clearDescription() {
		this.data.description = undefined;
		return this;
	}

	/**
	 * Sets a string select menu component to this label.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public setStringSelectMenuComponent(
		input:
			| APIStringSelectComponent
			| StringSelectMenuBuilder
			| ((builder: StringSelectMenuBuilder) => StringSelectMenuBuilder),
	): this {
		this.data.component = resolveBuilder(input, StringSelectMenuBuilder);
		return this;
	}

	/**
	 * Sets a user select menu component to this label.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public setUserSelectMenuComponent(
		input: APIUserSelectComponent | UserSelectMenuBuilder | ((builder: UserSelectMenuBuilder) => UserSelectMenuBuilder),
	): this {
		this.data.component = resolveBuilder(input, UserSelectMenuBuilder);
		return this;
	}

	/**
	 * Sets a role select menu component to this label.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public setRoleSelectMenuComponent(
		input: APIRoleSelectComponent | RoleSelectMenuBuilder | ((builder: RoleSelectMenuBuilder) => RoleSelectMenuBuilder),
	): this {
		this.data.component = resolveBuilder(input, RoleSelectMenuBuilder);
		return this;
	}

	/**
	 * Sets a mentionable select menu component to this label.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public setMentionableSelectMenuComponent(
		input:
			| APIMentionableSelectComponent
			| MentionableSelectMenuBuilder
			| ((builder: MentionableSelectMenuBuilder) => MentionableSelectMenuBuilder),
	): this {
		this.data.component = resolveBuilder(input, MentionableSelectMenuBuilder);
		return this;
	}

	/**
	 * Sets a channel select menu component to this label.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public setChannelSelectMenuComponent(
		input:
			| APIChannelSelectComponent
			| ChannelSelectMenuBuilder
			| ((builder: ChannelSelectMenuBuilder) => ChannelSelectMenuBuilder),
	): this {
		this.data.component = resolveBuilder(input, ChannelSelectMenuBuilder);
		return this;
	}

	/**
	 * Sets a text input component to this label.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public setTextInputComponent(
		input: APITextInputComponent | TextInputBuilder | ((builder: TextInputBuilder) => TextInputBuilder),
	): this {
		this.data.component = resolveBuilder(input, TextInputBuilder);
		return this;
	}

	/**
	 * Sets a file upload component to this label.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public setFileUploadComponent(
		input: APIFileUploadComponent | FileUploadBuilder | ((builder: FileUploadBuilder) => FileUploadBuilder),
	): this {
		this.data.component = resolveBuilder(input, FileUploadBuilder);
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(): APILabelComponent {
		const { component, ...rest } = this.data;

		const data = {
			...rest,
			// The label predicate validates the component.
			component: component?.toJSON(),
		};

		labelPredicate.parse(data);

		return data as APILabelComponent;
	}
}
