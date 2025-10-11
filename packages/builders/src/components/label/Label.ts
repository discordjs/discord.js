import type {
	APIChannelSelectComponent,
	APILabelComponent,
	APIMentionableSelectComponent,
	APIRoleSelectComponent,
	APIStringSelectComponent,
	APITextInputComponent,
	APIUserSelectComponent,
} from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { resolveBuilder } from '../../util/resolveBuilder.js';
import { validate } from '../../util/validation.js';
import { ComponentBuilder } from '../Component.js';
import { createComponentBuilder } from '../Components.js';
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
		| MentionableSelectMenuBuilder
		| RoleSelectMenuBuilder
		| StringSelectMenuBuilder
		| TextInputBuilder
		| UserSelectMenuBuilder;
}

/**
 * A builder that creates API-compatible JSON data for labels.
 */
export class LabelBuilder extends ComponentBuilder<APILabelComponent> {
	/**
	 * @internal
	 */
	protected readonly data: LabelBuilderData;

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
	 * }).setContent('new text');
	 * ```
	 */
	public constructor(data: Partial<APILabelComponent> = {}) {
		super();

		const { component, ...rest } = data;

		this.data = {
			...structuredClone(rest),
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
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): APILabelComponent {
		const { component, ...rest } = this.data;

		const data = {
			...structuredClone(rest),
			// The label predicate validates the component.
			component: component?.toJSON(false),
		};

		validate(labelPredicate, data, validationOverride);

		return data as APILabelComponent;
	}
}
