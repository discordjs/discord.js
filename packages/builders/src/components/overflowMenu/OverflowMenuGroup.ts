import type { JSONEncodable } from '@discordjs/util';
// import { type APIMenuActionItemComponentWithCustomId, type APIMenuActionItemComponentWithURL, type APIOverflowMenuGroup } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { resolveBuilder } from '../../util/resolveBuilder.js';
import { validate } from '../../util/validation.js';
import { overflowMenuGroupPredicate } from '../Assertions.js';
import { createComponentBuilder, type MenuActionItemBuilder } from '../Components.js';
import { DangerMenuActionItemBuilder, DefaultMenuActionItemBuilder } from './CustomIdMenuActionItem.js';
import { LinkMenuActionItemBuilder } from './LinkMenuActionItem.js';
import type {
	APIMenuActionItemComponentWithCustomId,
	APIMenuActionItemComponentWithURL,
	APIOverflowMenuGroup,
} from './REMOVEBEFOREPRMERGE.js';

export interface OverflowMenuGroupBuilderData extends Partial<Omit<APIOverflowMenuGroup, 'components'>> {
	components: MenuActionItemBuilder[];
}

/**
 * A builder that creates API-compatible JSON data for overflow menu groups.
 */
export class OverflowMenuGroupBuilder implements JSONEncodable<APIOverflowMenuGroup> {
	/**
	 * @internal
	 */
	private readonly data: OverflowMenuGroupBuilderData;

	/**
	 * The components in this overflow menu group.
	 */
	public get components(): readonly MenuActionItemBuilder[] {
		return this.data.components;
	}

	/**
	 * Sets the label for this option.
	 *
	 * @param label - The label to use
	 */
	public setLabel(label: string) {
		this.data.label = label;
		return this;
	}

	/**
	 * Creates a new overflow menu group.
	 *
	 * @param data - The API data to create this overflow menu group with
	 * @example
	 * Creating an overflow menu group from an API data object:
	 * ```ts
	 * const overflowMenuGroup = new OverflowMenuGroupBuilder({
	 * 	label: "Some text here",
	 * 	components: [
	 * 		{
	 * 			label: 'Click me!',
	 * 			style: APIMenuActionItemStyle.Default,
	 * 		},
	 * 	],
	 * });
	 * ```
	 * @example
	 * Creating a media gallery using setters and API data:
	 * ```ts
	 * const overflowMenuGroup = new OverflowMenuGroupBuilder({
	 * 	label: "Some text here",
	 * 	components: [
	 * 		{
	 * 			label: 'Click me!',
	 * 			style: APIMenuActionItemStyle.Default,
	 * 		},
	 * 	],
	 * })
	 * 	.addComponents(item2, item3);
	 * ```
	 */
	public constructor(data: Partial<APIOverflowMenuGroup> = {}) {
		const { components = [], ...rest } = data;

		this.data = {
			...structuredClone(rest),
			components: components.map((component) => createComponentBuilder(component)),
		};
	}

	/**
	 * Adds arbitrary menu action item builders to this overflow menu group.
	 *
	 * @param input - The items to add
	 */
	public addComponents(...input: RestOrArray<MenuActionItemBuilder>): this {
		const normalized = normalizeArray(input);

		this.data.components.push(...normalized);
		return this;
	}

	/**
	 * Adds default menu action items to this overflow menu group.
	 *
	 * @param input - The items to add
	 */
	public addDefaultMenuActionItemComponents(
		...input: RestOrArray<
			| APIMenuActionItemComponentWithCustomId
			| DefaultMenuActionItemBuilder
			| ((builder: DefaultMenuActionItemBuilder) => DefaultMenuActionItemBuilder)
		>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((item) => resolveBuilder(item, DefaultMenuActionItemBuilder));

		this.data.components.push(...resolved);
		return this;
	}

	/**
	 * Adds drfault menu action items to this overflow menu group.
	 *
	 * @param input - The items to add
	 */
	public addDangerMenuActionItemComponents(
		...input: RestOrArray<
			| APIMenuActionItemComponentWithCustomId
			| DangerMenuActionItemBuilder
			| ((builder: DangerMenuActionItemBuilder) => DangerMenuActionItemBuilder)
		>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((item) => resolveBuilder(item, DangerMenuActionItemBuilder));

		this.data.components.push(...resolved);
		return this;
	}

	/**
	 * Adds drfault menu action items to this overflow menu group.
	 *
	 * @param input - The items to add
	 */
	public addLinkMenuActionItemComponents(
		...input: RestOrArray<
			| APIMenuActionItemComponentWithURL
			| LinkMenuActionItemBuilder
			| ((builder: LinkMenuActionItemBuilder) => LinkMenuActionItemBuilder)
		>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((item) => resolveBuilder(item, LinkMenuActionItemBuilder));

		this.data.components.push(...resolved);
		return this;
	}

	/**
	 * Removes, replaces, or inserts menu action items for this overflow menu group.
	 *
	 * @param index - The index to start removing, replacing or inserting items
	 * @param deleteCount - The amount of items to remove
	 * @param components - The items to insert
	 */
	public spliceComponents(index: number, deleteCount: number, ...components: RestOrArray<MenuActionItemBuilder>) {
		const normalized = normalizeArray(components);

		this.data.components.splice(index, deleteCount, ...normalized);
		return this;
	}

	/**
	 * Transforms this object to its JSON format
	 */
	public toJSON(validationOverride?: boolean): APIOverflowMenuGroup {
		const { components, ...rest } = this.data;

		const data = {
			...structuredClone(rest),
			components: components.map((item) => item.toJSON(false)),
		};

		validate(overflowMenuGroupPredicate, data, validationOverride);

		return data as APIOverflowMenuGroup;
	}
}
