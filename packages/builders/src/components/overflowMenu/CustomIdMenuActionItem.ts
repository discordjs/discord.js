import { MenuActionItemStyle, type APIMenuActionItemComponentWithCustomId } from '../Components.js';
// import { MenuActionItemStyle, type APIMenuActionItemComponentWithCustomId, ComponentType } from 'discord-api-types/v10';
import { BaseMenuActionItemBuilder } from './MenuActionItem.js';

/**
 * A builder that creates API-compatible JSON data for menu action items with custom IDs.
 */
export abstract class CustomIdMenuActionItemBuilder extends BaseMenuActionItemBuilder<APIMenuActionItemComponentWithCustomId> {
	protected override readonly data: Partial<APIMenuActionItemComponentWithCustomId>;

	/**
	 * Creates a new menu action item with custom ID.
	 *
	 * @param data - The API data to create this menu action item with
	 * @example
	 * Creating a menu action item from an API data object:
	 * ```ts
	 * const customIdMenuActionItem = new CustomIdMenuActionItemBuilder({
	 * 	label: 'Click me!',
	 * 	style: APIMenuItemStyle.Default,
	 *  customId: 'id',
	 * });
	 * ```
	 * @example
	 * Creating a menu action item using setters and API data:
	 * ```ts
	 * const customIdMenuActionItem = new CustomIdMenuActionItemBuilder({
	 * 	label: 'Click me!',
	 * 	style: APIMenuItemStyle.Default,
	 * 	.setCustomId('id');
	 * ```
	 */
	public constructor(data: Partial<APIMenuActionItemComponentWithCustomId> = {}) {
		super();

		this.data = {
			...structuredClone(data),
			type: 26, //TODO: ComponentType.MenuActionItem,
		};
	}

	/**
	 * Sets the custom id for this menu action item.
	 *
	 * @remarks
	 * This method is only applicable to menu items that are not using the `Link` menu action item style.
	 * @param customId - The custom id to use
	 */
	public setCustomId(customId: string) {
		this.data.custom_id = customId;
		return this;
	}
}

/**
 * A builder that creates API-compatible JSON data for menu action items with custom IDs (using the default style).
 */
export class DefaultMenuActionItemBuilder extends CustomIdMenuActionItemBuilder {
	public constructor(data: Partial<APIMenuActionItemComponentWithCustomId> = {}) {
		super({ ...data, style: MenuActionItemStyle.Default });
	}
}

/**
 * A builder that creates API-compatible JSON data for menu action items with custom IDs (using the danger style).
 */
export class DangerMenuActionItemBuilder extends CustomIdMenuActionItemBuilder {
	public constructor(data: Partial<APIMenuActionItemComponentWithCustomId> = {}) {
		super({ ...data, style: MenuActionItemStyle.Danger });
	}
}
