/* eslint-disable jsdoc/check-param-names */

import type {
	APITextInputComponent,
	APIActionRowComponent,
	APIActionRowComponentTypes,
	APIChannelSelectComponent,
	APIMentionableSelectComponent,
	APIRoleSelectComponent,
	APIStringSelectComponent,
	APIUserSelectComponent,
	APIButtonComponentWithCustomId,
	APIButtonComponentWithSKUId,
	APIButtonComponentWithURL,
	APIMessageActionRowComponent,
	APIModalActionRowComponent,
} from 'discord-api-types/v10';
import { ComponentType } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../util/normalizeArray.js';
import { resolveBuilder } from '../util/resolveBuilder.js';
import { validate } from '../util/validation.js';
import { actionRowPredicate } from './Assertions.js';
import { ComponentBuilder } from './Component.js';
import type {
	AnyActionRowComponentBuilder,
	MessageActionRowComponentBuilder,
	ModalActionRowComponentBuilder,
} from './Components.js';
import { createComponentBuilder } from './Components.js';
import {
	DangerButtonBuilder,
	PrimaryButtonBuilder,
	SecondaryButtonBuilder,
	SuccessButtonBuilder,
} from './button/CustomIdButton.js';
import { LinkButtonBuilder } from './button/LinkButton.js';
import { PremiumButtonBuilder } from './button/PremiumButton.js';
import { ChannelSelectMenuBuilder } from './selectMenu/ChannelSelectMenu.js';
import { MentionableSelectMenuBuilder } from './selectMenu/MentionableSelectMenu.js';
import { RoleSelectMenuBuilder } from './selectMenu/RoleSelectMenu.js';
import { StringSelectMenuBuilder } from './selectMenu/StringSelectMenu.js';
import { UserSelectMenuBuilder } from './selectMenu/UserSelectMenu.js';
import { TextInputBuilder } from './textInput/TextInput.js';

export interface ActionRowBuilderData<BuilderTypes extends AnyActionRowComponentBuilder>
	extends Partial<Omit<APIActionRowComponent<APIActionRowComponentTypes>, 'components'>> {
	components: BuilderTypes[];
}

/**
 * A builder that creates API-compatible JSON data for action rows.
 *
 * @typeParam ComponentType - The types of components this action row holds
 * @typeParam BuilderType - The builder types that can be used to build components for this action row
 */
export class BaseActionRowBuilder<
	ComponentType extends APIActionRowComponentTypes,
	BuilderType extends AnyActionRowComponentBuilder,
> extends ComponentBuilder<APIActionRowComponent<ComponentType>> {
	protected readonly data: ActionRowBuilderData<BuilderType>;

	/**
	 * The components within this action row.
	 */
	public get components(): readonly BuilderType[] {
		return this.data.components;
	}

	/**
	 * Creates a new action row from API data.
	 *
	 * @param data - The API data to create this action row with
	 * @example
	 * Creating an action row from an API data object:
	 * ```ts
	 * const actionRow = new ActionRowBuilder({
	 * 	components: [
	 * 		{
	 * 			custom_id: "custom id",
	 * 			label: "Type something",
	 * 			style: TextInputStyle.Short,
	 * 			type: ComponentType.TextInput,
	 * 		},
	 * 	],
	 * });
	 * ```
	 * @example
	 * Creating an action row using setters and API data:
	 * ```ts
	 * const actionRow = new ActionRowBuilder({
	 * 	components: [
	 * 		{
	 * 			custom_id: "custom id",
	 * 			label: "Click me",
	 * 			style: ButtonStyle.Primary,
	 * 			type: ComponentType.Button,
	 * 		},
	 * 	],
	 * })
	 * 	.addComponents(button2, button3);
	 * ```
	 */
	public constructor({ components = [], ...data }: Partial<APIActionRowComponent<ComponentType>> = {}) {
		super();
		this.data = {
			...structuredClone(data),
			type: ComponentType.ActionRow,
			components: components.map((component) => createComponentBuilder(component)) as BuilderType[],
		};
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): APIActionRowComponent<ComponentType> {
		const { components, ...rest } = this.data;

		const data = {
			...structuredClone(rest),
			components: components.map((component) => component.toJSON(validationOverride)),
		};

		validate(actionRowPredicate, data, validationOverride);

		return data as APIActionRowComponent<ComponentType>;
	}
}

/**
 * A builder that creates API-compatible JSON data for message action rows.
 */
export class MessageActionRowBuilder extends BaseActionRowBuilder<
	APIMessageActionRowComponent,
	MessageActionRowComponentBuilder
> {
	/**
	 * Removes, replaces, or inserts components for this action row.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
	 *
	 * It's useful for modifying and adjusting order of the already-existing components of an action row.
	 * @example
	 * Remove the first component:
	 * ```ts
	 * actionRow.spliceComponents(0, 1);
	 * ```
	 * @example
	 * Remove the first n components:
	 * ```ts
	 * const n = 4;
	 * actionRow.spliceComponents(0, n);
	 * ```
	 * @example
	 * Remove the last component:
	 * ```ts
	 * actionRow.spliceComponents(-1, 1);
	 * ```
	 * @param index - The index to start at
	 * @param deleteCount - The number of components to remove
	 * @param components - The replacing component objects
	 */
	public spliceComponents(index: number, deleteCount: number, ...components: MessageActionRowComponentBuilder[]): this {
		this.data.components.splice(index, deleteCount, ...components);
		return this;
	}

	/**
	 * Generically add any type of component to this action row, only takes in an instance of a component builder.
	 */
	public addComponents(...input: RestOrArray<MessageActionRowComponentBuilder>): this {
		const normalized = normalizeArray(input);
		this.data.components.push(...normalized);

		return this;
	}

	/**
	 * Adds primary button components to this action row.
	 *
	 * @param input - The buttons to add
	 */
	public addPrimaryButtonComponents(
		...input: RestOrArray<
			APIButtonComponentWithCustomId | PrimaryButtonBuilder | ((builder: PrimaryButtonBuilder) => PrimaryButtonBuilder)
		>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((component) => resolveBuilder(component, PrimaryButtonBuilder));

		this.data.components.push(...resolved);
		return this;
	}

	/**
	 * Adds secondary button components to this action row.
	 *
	 * @param input - The buttons to add
	 */
	public addSecondaryButtonComponents(
		...input: RestOrArray<
			| APIButtonComponentWithCustomId
			| SecondaryButtonBuilder
			| ((builder: SecondaryButtonBuilder) => SecondaryButtonBuilder)
		>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((component) => resolveBuilder(component, SecondaryButtonBuilder));

		this.data.components.push(...resolved);
		return this;
	}

	/**
	 * Adds success button components to this action row.
	 *
	 * @param input - The buttons to add
	 */
	public addSuccessButtonComponents(
		...input: RestOrArray<
			APIButtonComponentWithCustomId | SuccessButtonBuilder | ((builder: SuccessButtonBuilder) => SuccessButtonBuilder)
		>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((component) => resolveBuilder(component, SuccessButtonBuilder));

		this.data.components.push(...resolved);
		return this;
	}

	/**
	 * Adds danger button components to this action row.
	 */
	public addDangerButtonComponents(
		...input: RestOrArray<
			APIButtonComponentWithCustomId | DangerButtonBuilder | ((builder: DangerButtonBuilder) => DangerButtonBuilder)
		>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((component) => resolveBuilder(component, DangerButtonBuilder));

		this.data.components.push(...resolved);
		return this;
	}

	/**
	 * Adds SKU id button components to this action row.
	 *
	 * @param input - The buttons to add
	 */
	public addPremiumButtonComponents(
		...input: RestOrArray<
			APIButtonComponentWithSKUId | PremiumButtonBuilder | ((builder: PremiumButtonBuilder) => PremiumButtonBuilder)
		>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((component) => resolveBuilder(component, PremiumButtonBuilder));

		this.data.components.push(...resolved);
		return this;
	}

	/**
	 * Adds URL button components to this action row.
	 *
	 * @param input - The buttons to add
	 */
	public addLinkButtonComponents(
		...input: RestOrArray<
			APIButtonComponentWithURL | LinkButtonBuilder | ((builder: LinkButtonBuilder) => LinkButtonBuilder)
		>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((component) => resolveBuilder(component, LinkButtonBuilder));

		this.data.components.push(...resolved);
		return this;
	}

	/**
	 * Adds a channel select menu component to this action row.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public addChannelSelectMenuComponent(
		input:
			| APIChannelSelectComponent
			| ChannelSelectMenuBuilder
			| ((builder: ChannelSelectMenuBuilder) => ChannelSelectMenuBuilder),
	): this {
		this.data.components.push(resolveBuilder(input, ChannelSelectMenuBuilder));
		return this;
	}

	/**
	 * Adds a mentionable select menu component to this action row.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public addMentionableSelectMenuComponent(
		input:
			| APIMentionableSelectComponent
			| MentionableSelectMenuBuilder
			| ((builder: MentionableSelectMenuBuilder) => MentionableSelectMenuBuilder),
	): this {
		this.data.components.push(resolveBuilder(input, MentionableSelectMenuBuilder));
		return this;
	}

	/**
	 * Adds a role select menu component to this action row.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public addRoleSelectMenuComponent(
		input: APIRoleSelectComponent | RoleSelectMenuBuilder | ((builder: RoleSelectMenuBuilder) => RoleSelectMenuBuilder),
	): this {
		this.data.components.push(resolveBuilder(input, RoleSelectMenuBuilder));
		return this;
	}

	/**
	 * Adds a string select menu component to this action row.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public addStringSelectMenuComponent(
		input:
			| APIStringSelectComponent
			| StringSelectMenuBuilder
			| ((builder: StringSelectMenuBuilder) => StringSelectMenuBuilder),
	): this {
		this.data.components.push(resolveBuilder(input, StringSelectMenuBuilder));
		return this;
	}

	/**
	 * Adds a user select menu component to this action row.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public addUserSelectMenuComponent(
		input: APIUserSelectComponent | UserSelectMenuBuilder | ((builder: UserSelectMenuBuilder) => UserSelectMenuBuilder),
	): this {
		this.data.components.push(resolveBuilder(input, UserSelectMenuBuilder));
		return this;
	}
}

/**
 * A builder that creates API-compatible JSON data for modal action rows.
 */
export class ModalActionRowBuilder extends BaseActionRowBuilder<
	APIModalActionRowComponent,
	ModalActionRowComponentBuilder
> {
	/**
	 * Adds a text input component to this action row.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public addTextInputComponent(
		input: APITextInputComponent | TextInputBuilder | ((builder: TextInputBuilder) => TextInputBuilder),
	): this {
		this.data.components.push(resolveBuilder(input, TextInputBuilder));
		return this;
	}

	/**
	 * Replaces the text input component in this action row.
	 *
	 * @param input - A function that returns a component builder or an already built builder
	 */
	public replaceTextInputComponent(
		input: APITextInputComponent | TextInputBuilder | ((builder: TextInputBuilder) => TextInputBuilder),
	): this {
		this.data.components = [resolveBuilder(input, TextInputBuilder)];
		return this;
	}
}
