// import { type APIOverflowMenuComponent, type APIOverflowMenuGroup, ComponentType } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { resolveBuilder } from '../../util/resolveBuilder.js';
import { validate } from '../../util/validation.js';
import { overflowMenuPredicate } from '../Assertions.js';
import { ComponentBuilder } from '../Component.js';
import type { APIOverflowMenuComponent, APIOverflowMenuGroup } from '../Components.js';
import { OverflowMenuGroupBuilder } from './OverflowMenuGroup.js';

export interface OverflowMenuBuilderData extends Partial<Omit<APIOverflowMenuComponent, 'groups'>> {
	groups: OverflowMenuGroupBuilder[];
}

/**
 * A builder that creates API-compatible JSON data for overflow menus.
 */
export class OverflowMenuBuilder extends ComponentBuilder<APIOverflowMenuComponent> {
	/**
	 * @internal
	 */
	protected readonly data: OverflowMenuBuilderData;

	/**
	 * The groups in this overflow menu.
	 */
	public get groups(): readonly OverflowMenuGroupBuilder[] {
		return this.data.groups;
	}

	/**
	 * Creates a new overflow menu.
	 *
	 * @param data - The API data to create this container with
	 * @example
	 * Creating an overflow menu from an API data object:
	 * ```ts
	 * const overflowMenu = new OverflowMenuBuilder({
	 * 	groups: [
	 * 		{
	 * 			label: "Some text here",
	 * 			components: [
	 * 				{
	 * 					label: 'Click me!',
	 * 					style: APIMenuItemStyle.Default,
	 * 				},
	 * 			],
	 * 		},
	 * 	],
	 * });
	 * ```
	 * @example
	 * Creating a overflow menu using setters and API data:
	 * ```ts
	 * const overflowMenu = new OverflowMenuBuilder({
	 * 	groups: [
	 * 		{
	 * 			label: "Some text here",
	 * 			components: [
	 * 				{
	 * 					label: 'Click me!',
	 * 					style: APIMenuItemStyle.Default,
	 * 				},
	 * 			],
	 * 		},
	 * 	],
	 * })
	 * 	.addItems(item2, item3);
	 * ```
	 */
	public constructor(data: Partial<APIOverflowMenuComponent> = {}) {
		super();

		const { groups = [], ...rest } = data;

		this.data = {
			...structuredClone(rest),
			groups: groups.map((group) => new OverflowMenuGroupBuilder(group)),
			type: 25, // TODO: ComponentType.OverflowMenu,
		};
	}

	/**
	 * Adds an overflow menu group to this overflow menu.
	 *
	 * @param input - The groups to add
	 */
	public addGroups(
		...input: RestOrArray<
			| APIOverflowMenuGroup
			| OverflowMenuGroupBuilder
			| ((builder: OverflowMenuGroupBuilder) => OverflowMenuGroupBuilder)
		>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((group) => resolveBuilder(group, OverflowMenuGroupBuilder));

		this.data.groups.push(...resolved);
		return this;
	}

	/**
	 * Removes, replaces, or inserts oberflow menu groups for this overflow menu.
	 *
	 * @param index - The index to start removing, replacing or inserting groups
	 * @param deleteCount - The amount of groups to remove
	 * @param groups - The groups to insert
	 */
	public spliceGroups(
		index: number,
		deleteCount: number,
		...groups: RestOrArray<
			| APIOverflowMenuGroup
			| OverflowMenuGroupBuilder
			| ((builder: OverflowMenuGroupBuilder) => OverflowMenuGroupBuilder)
		>
	) {
		const normalized = normalizeArray(groups);
		const resolved = normalized.map((group) => resolveBuilder(group, OverflowMenuGroupBuilder));

		this.data.groups.splice(index, deleteCount, ...resolved);
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): APIOverflowMenuComponent {
		const { groups, ...rest } = this.data;

		const data = {
			...structuredClone(rest),
			groups: groups.map((group) => group.toJSON(false)),
		};

		validate(overflowMenuPredicate, data, validationOverride);

		return data as APIOverflowMenuComponent;
	}
}
