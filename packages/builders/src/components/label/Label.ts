import type { APILabelComponent, APIStringSelectComponent, APITextInputComponent } from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { resolveBuilder } from '../../util/resolveBuilder.js';
import { validate } from '../../util/validation.js';
import { ComponentBuilder } from '../Component.js';
import { createComponentBuilder } from '../Components.js';
import { StringSelectMenuBuilder } from '../selectMenu/StringSelectMenu.js';
import { TextInputBuilder } from '../textInput/TextInput.js';
import { labelPredicate } from './Assertions.js';

export interface LabelBuilderData extends Partial<Omit<APILabelComponent, 'component'>> {
	component?: StringSelectMenuBuilder | TextInputBuilder;
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
			// @ts-expect-error https://github.com/discordjs/discord.js/pull/11078
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
			component: component?.toJSON(false),
		};

		validate(labelPredicate, data, validationOverride);

		return data as APILabelComponent;
	}
}
