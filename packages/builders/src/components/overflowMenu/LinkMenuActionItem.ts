// import { MenuActionItemStyle, type APIMenuActionItemComponentWithURL, ComponentType } from 'discord-api-types/v10';
import { BaseMenuActionItemBuilder } from './MenuActionItem.js';
import { MenuActionItemStyle, type APIMenuActionItemComponentWithURL } from './REMOVEBEFOREPRMERGE.js';

/**
 * A builder that creates API-compatible JSON data for menu action items with links.
 */
export class LinkMenuActionItemBuilder extends BaseMenuActionItemBuilder<APIMenuActionItemComponentWithURL> {
	protected override readonly data: Partial<APIMenuActionItemComponentWithURL>;

	public constructor(data: Partial<APIMenuActionItemComponentWithURL> = {}) {
		super();
		this.data = { ...structuredClone(data), type: 26, style: MenuActionItemStyle.Link }; //TODO: ComponentType.MenuActionItem
	}

	/**
	 * Sets the URL for this menu action item.
	 *
	 * @remarks
	 * This method is only available to menu action items using the `Link` menu action item style.
	 * Only three types of URL schemes are currently supported: `https://`, `http://`, and `discord://`.
	 * @param url - The URL to use
	 */
	public setURL(url: string) {
		this.data.url = url;
		return this;
	}
}
