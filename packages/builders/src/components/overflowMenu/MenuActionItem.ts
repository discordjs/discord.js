import { /* type APIMenuActionItemComponent,*/ type APIMessageComponentEmoji } from 'discord-api-types/v10';
import { validate } from '../../util/validation.js';
import { menuActionItemPredicate } from '../Assertions.js';
import { ComponentBuilder } from '../Component.js';
import type { APIMenuActionItemComponent } from '../Components.js';

/**
 * A builder that creates API-compatible JSON data for menu action items.
 */
export abstract class BaseMenuActionItemBuilder<
	MenuActionItemData extends APIMenuActionItemComponent,
> extends ComponentBuilder<MenuActionItemData> {
	/**
	 * @internal
	 */
	declare protected readonly data: Partial<MenuActionItemData>;

	/**
	 * Sets the description for this menu action item.
	 *
	 * @param description - The description to use
	 */
	public setDescription(description: string) {
		this.data.description = description;
		return this;
	}

	/**
	 * Clears the description for this menu action item.
	 */
	public clearDescription() {
		this.data.description = undefined;
		return this;
	}

	/**
	 * Sets the emoji to display for this menu action item.
	 *
	 * @param emoji - The emoji to use
	 */
	public setEmoji(emoji: APIMessageComponentEmoji) {
		this.data.emoji = emoji;
		return this;
	}

	/**
	 * Clears the emoji for this menu action item.
	 */
	public clearEmoji() {
		this.data.emoji = undefined;
		return this;
	}

	/**
	 * Sets the label for this menu action item.
	 *
	 * @param label - The label to use
	 */
	public setLabel(label: string) {
		this.data.label = label;
		return this;
	}

	/**
	 * Sets whether this menu action item is disabled.
	 *
	 * @param disabled - Whether this menu action item is disabled
	 */
	public setDisabled(disabled = true) {
		this.data.disabled = disabled;
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): MenuActionItemData {
		const data = structuredClone(this.data);

		validate(menuActionItemPredicate, data, validationOverride);

		return data as MenuActionItemData;
	}
}
