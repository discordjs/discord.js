import type { APIBaseComponent, APIMessageComponentEmoji, ComponentType } from 'discord-api-types/v10';

// TODO: import from discord-api-types when available
declare module 'discord-api-types/v10' {
	enum ComponentType {
		OverflowMenu = 25,
		MenuActionItem = 26,
	}
}

export interface APIOverflowMenuComponent extends APIBaseComponent<ComponentType.OverflowMenu> {
	groups: APIOverflowMenuGroup[];
}

export interface APIOverflowMenuGroup {
	label?: string;
	components: APIMenuActionItemComponent[];
}
export interface APIMenuActionItemComponentBase<
	Style extends MenuActionItemStyle,
> extends APIBaseComponent<ComponentType.MenuActionItem> {
	label: string;
	style: Style;
	description?: string;
	emoji?: APIMessageComponentEmoji;
	disabled?: boolean;
}

export interface APIMenuActionItemComponentWithCustomId extends APIMenuActionItemComponentBase<
	MenuActionItemStyle.Danger | MenuActionItemStyle.Default
> {
	custom_id: string;
}

export interface APIMenuActionItemComponentWithURL extends APIMenuActionItemComponentBase<MenuActionItemStyle.Link> {
	url: string;
}

export enum MenuActionItemStyle {
	Default = 1,
	Danger = 2,
	Link = 3,
}

export type APIMenuActionItemComponent = APIMenuActionItemComponentWithCustomId | APIMenuActionItemComponentWithURL;
