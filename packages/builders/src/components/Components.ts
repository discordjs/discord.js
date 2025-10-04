import type {
	APIBaseComponent,
	APIButtonComponent,
	APIMessageComponent,
	APIModalComponent,
	APISectionAccessoryComponent,
} from 'discord-api-types/v10';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { ActionRowBuilder } from './ActionRow.js';
import { ComponentBuilder } from './Component.js';
import type { BaseButtonBuilder } from './button/Button.js';
import {
	DangerButtonBuilder,
	PrimaryButtonBuilder,
	SecondaryButtonBuilder,
	SuccessButtonBuilder,
} from './button/CustomIdButton.js';
import { LinkButtonBuilder } from './button/LinkButton.js';
import { PremiumButtonBuilder } from './button/PremiumButton.js';
import { LabelBuilder } from './label/Label.js';
import { ChannelSelectMenuBuilder } from './selectMenu/ChannelSelectMenu.js';
import { MentionableSelectMenuBuilder } from './selectMenu/MentionableSelectMenu.js';
import { RoleSelectMenuBuilder } from './selectMenu/RoleSelectMenu.js';
import { StringSelectMenuBuilder } from './selectMenu/StringSelectMenu.js';
import { UserSelectMenuBuilder } from './selectMenu/UserSelectMenu.js';
import { TextInputBuilder } from './textInput/TextInput.js';
import { ContainerBuilder } from './v2/Container.js';
import { FileBuilder } from './v2/File.js';
import { MediaGalleryBuilder } from './v2/MediaGallery.js';
import { SectionBuilder } from './v2/Section.js';
import { SeparatorBuilder } from './v2/Separator.js';
import { TextDisplayBuilder } from './v2/TextDisplay.js';
import { ThumbnailBuilder } from './v2/Thumbnail.js';

/**
 * The builders that may be used as top-level components on messages
 */
export type MessageTopLevelComponentBuilder =
	| ActionRowBuilder
	| ContainerBuilder
	| FileBuilder
	| MediaGalleryBuilder
	| SectionBuilder
	| SeparatorBuilder
	| TextDisplayBuilder;

/**
 * The builders that may be used for messages.
 */
export type MessageComponentBuilder =
	| MessageActionRowComponentBuilder
	| MessageTopLevelComponentBuilder
	| ThumbnailBuilder;

/**
 * The builders that may be used for modals.
 */
export type ModalComponentBuilder = ActionRowBuilder | LabelBuilder | ModalActionRowComponentBuilder;

/**
 * Any button builder
 */
export type ButtonBuilder =
	| DangerButtonBuilder
	| LinkButtonBuilder
	| PremiumButtonBuilder
	| PrimaryButtonBuilder
	| SecondaryButtonBuilder
	| SuccessButtonBuilder;

/**
 * The builders that may be used within an action row for messages.
 */
export type MessageActionRowComponentBuilder =
	| ButtonBuilder
	| ChannelSelectMenuBuilder
	| MentionableSelectMenuBuilder
	| RoleSelectMenuBuilder
	| StringSelectMenuBuilder
	| UserSelectMenuBuilder;

/**
 * The builders that may be used within an action row for modals.
 */
export type ModalActionRowComponentBuilder = TextInputBuilder;

/**
 * Any action row component builder.
 */
export type AnyActionRowComponentBuilder = MessageActionRowComponentBuilder | ModalActionRowComponentBuilder;

/**
 * Any modal component builder.
 */
export type AnyModalComponentBuilder = LabelBuilder | TextDisplayBuilder;

/**
 * Components here are mapped to their respective builder.
 */
export interface MappedComponentTypes {
	/**
	 * The action row component type is associated with an {@link ActionRowBuilder}.
	 */
	[ComponentType.ActionRow]: ActionRowBuilder;
	/**
	 * The button component type is associated with a {@link BaseButtonBuilder}.
	 */
	[ComponentType.Button]: ButtonBuilder;
	/**
	 * The string select component type is associated with a {@link StringSelectMenuBuilder}.
	 */
	[ComponentType.StringSelect]: StringSelectMenuBuilder;
	/**
	 * The text input component type is associated with a {@link TextInputBuilder}.
	 */
	[ComponentType.TextInput]: TextInputBuilder;
	/**
	 * The user select component type is associated with a {@link UserSelectMenuBuilder}.
	 */
	[ComponentType.UserSelect]: UserSelectMenuBuilder;
	/**
	 * The role select component type is associated with a {@link RoleSelectMenuBuilder}.
	 */
	[ComponentType.RoleSelect]: RoleSelectMenuBuilder;
	/**
	 * The mentionable select component type is associated with a {@link MentionableSelectMenuBuilder}.
	 */
	[ComponentType.MentionableSelect]: MentionableSelectMenuBuilder;
	/**
	 * The channel select component type is associated with a {@link ChannelSelectMenuBuilder}.
	 */
	[ComponentType.ChannelSelect]: ChannelSelectMenuBuilder;
	/**
	 * The thumbnail component type is associated with a {@link ThumbnailBuilder}.
	 */
	[ComponentType.Thumbnail]: ThumbnailBuilder;
	/**
	 * The file component type is associated with a {@link FileBuilder}.
	 */
	[ComponentType.File]: FileBuilder;
	/**
	 * The separator component type is associated with a {@link SeparatorBuilder}.
	 */
	[ComponentType.Separator]: SeparatorBuilder;
	/**
	 * The text display component type is associated with a {@link TextDisplayBuilder}.
	 */
	[ComponentType.TextDisplay]: TextDisplayBuilder;
	/**
	 * The media gallery component type is associated with a {@link MediaGalleryBuilder}.
	 */
	[ComponentType.MediaGallery]: MediaGalleryBuilder;
	/**
	 * The section component type is associated with a {@link SectionBuilder}.
	 */
	[ComponentType.Section]: SectionBuilder;
	/**
	 * The container component type is associated with a {@link ContainerBuilder}.
	 */
	[ComponentType.Container]: ContainerBuilder;
	/**
	 * The label component type is associated with a {@link LabelBuilder}.
	 */
	[ComponentType.Label]: LabelBuilder;
}

/**
 * Factory for creating components from API data.
 *
 * @typeParam ComponentType - The type of component to use
 * @param data - The API data to transform to a component class
 */
export function createComponentBuilder<ComponentType extends keyof MappedComponentTypes>(
	// eslint-disable-next-line @typescript-eslint/sort-type-constituents
	data: (APIModalComponent | APIMessageComponent) & { type: ComponentType },
): MappedComponentTypes[ComponentType];

/**
 * Factory for creating components from API data.
 *
 * @typeParam ComponentBuilder - The type of component to use
 * @param data - The API data to transform to a component class
 */
export function createComponentBuilder<ComponentBuilder extends MessageComponentBuilder | ModalComponentBuilder>(
	data: ComponentBuilder,
): ComponentBuilder;

export function createComponentBuilder(
	data: APIMessageComponent | APIModalComponent | MessageComponentBuilder,
): ComponentBuilder<APIBaseComponent<ComponentType>> {
	if (data instanceof ComponentBuilder) {
		return data;
	}

	switch (data.type) {
		case ComponentType.ActionRow:
			return new ActionRowBuilder(data);
		case ComponentType.Button:
			return createButtonBuilder(data);
		case ComponentType.StringSelect:
			return new StringSelectMenuBuilder(data);
		case ComponentType.TextInput:
			return new TextInputBuilder(data);
		case ComponentType.UserSelect:
			return new UserSelectMenuBuilder(data);
		case ComponentType.RoleSelect:
			return new RoleSelectMenuBuilder(data);
		case ComponentType.MentionableSelect:
			return new MentionableSelectMenuBuilder(data);
		case ComponentType.ChannelSelect:
			return new ChannelSelectMenuBuilder(data);
		case ComponentType.Thumbnail:
			return new ThumbnailBuilder(data);
		case ComponentType.File:
			return new FileBuilder(data);
		case ComponentType.Separator:
			return new SeparatorBuilder(data);
		case ComponentType.TextDisplay:
			return new TextDisplayBuilder(data);
		case ComponentType.MediaGallery:
			return new MediaGalleryBuilder(data);
		case ComponentType.Section:
			return new SectionBuilder(data);
		case ComponentType.Container:
			return new ContainerBuilder(data);
		case ComponentType.Label:
			return new LabelBuilder(data);
		default:
			// @ts-expect-error This case can still occur if we get a newer unsupported component type
			throw new Error(`Cannot properly serialize component type: ${data.type}`);
	}
}

function createButtonBuilder(data: APIButtonComponent): ButtonBuilder {
	switch (data.style) {
		case ButtonStyle.Primary:
			return new PrimaryButtonBuilder(data);
		case ButtonStyle.Secondary:
			return new SecondaryButtonBuilder(data);
		case ButtonStyle.Success:
			return new SuccessButtonBuilder(data);
		case ButtonStyle.Danger:
			return new DangerButtonBuilder(data);
		case ButtonStyle.Link:
			return new LinkButtonBuilder(data);
		case ButtonStyle.Premium:
			return new PremiumButtonBuilder(data);
		default:
			// @ts-expect-error This case can still occur if we get a newer unsupported button style
			throw new Error(`Cannot properly serialize button with style: ${data.style}`);
	}
}

export function resolveAccessoryComponent(component: APISectionAccessoryComponent) {
	switch (component.type) {
		case ComponentType.Button:
			return createButtonBuilder(component);
		case ComponentType.Thumbnail:
			return new ThumbnailBuilder(component);
		default:
			// @ts-expect-error This case can still occur if we get a newer unsupported component type
			throw new Error(`Cannot properly serialize section accessory component: ${component.type}`);
	}
}
