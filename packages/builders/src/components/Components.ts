import type { JSONEncodable } from '@discordjs/util';
import { ComponentType, type APIMessageComponent, type APIModalComponent } from 'discord-api-types/v10';
import {
	ActionRowBuilder,
	type MessageActionRowComponentBuilder,
	type AnyComponentBuilder,
	type ModalComponentBuilder,
} from './ActionRow.js';
import { ComponentBuilder } from './Component.js';
import { ButtonBuilder } from './button/Button.js';
import { FileUploadBuilder } from './fileUpload/FileUpload.js';
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
 * The builders that may be used for messages.
 */
export type MessageComponentBuilder =
	| ActionRowBuilder<MessageActionRowComponentBuilder>
	| ContainerBuilder
	| FileBuilder
	| MediaGalleryBuilder
	| MessageActionRowComponentBuilder
	| SectionBuilder
	| SeparatorBuilder
	| TextDisplayBuilder
	| ThumbnailBuilder;

/**
 * Components here are mapped to their respective builder.
 */
export interface MappedComponentTypes {
	/**
	 * The action row component type is associated with an {@link ActionRowBuilder}.
	 */
	[ComponentType.ActionRow]: ActionRowBuilder<AnyComponentBuilder>;
	/**
	 * The button component type is associated with a {@link ButtonBuilder}.
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
	 * The file component type is associated with a {@link FileBuilder}.
	 */
	[ComponentType.File]: FileBuilder;
	/**
	 * The separator component type is associated with a {@link SeparatorBuilder}.
	 */
	[ComponentType.Separator]: SeparatorBuilder;
	/**
	 * The container component type is associated with a {@link ContainerBuilder}.
	 */
	[ComponentType.Container]: ContainerBuilder;
	/**
	 * The text display component type is associated with a {@link TextDisplayBuilder}.
	 */
	[ComponentType.TextDisplay]: TextDisplayBuilder;
	/**
	 * The thumbnail component type is associated with a {@link ThumbnailBuilder}.
	 */
	[ComponentType.Thumbnail]: ThumbnailBuilder;
	/**
	 * The section component type is associated with a {@link SectionBuilder}.
	 */
	[ComponentType.Section]: SectionBuilder;
	/**
	 * The media gallery component type is associated with a {@link MediaGalleryBuilder}.
	 */
	[ComponentType.MediaGallery]: MediaGalleryBuilder;
	/**
	 * The label component type is associated with a {@link LabelBuilder}.
	 */
	[ComponentType.Label]: LabelBuilder;
	/**
	 * The file upload component type is associated with a {@link FileUploadBuilder}.
	 */
	[ComponentType.FileUpload]: FileUploadBuilder;
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
): ComponentBuilder {
	if (data instanceof ComponentBuilder) {
		return data;
	}

	switch (data.type) {
		case ComponentType.ActionRow:
			return new ActionRowBuilder(data);
		case ComponentType.Button:
			return new ButtonBuilder(data);
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
		case ComponentType.File:
			return new FileBuilder(data);
		case ComponentType.Container:
			return new ContainerBuilder(data);
		case ComponentType.Section:
			return new SectionBuilder(data);
		case ComponentType.Separator:
			return new SeparatorBuilder(data);
		case ComponentType.TextDisplay:
			return new TextDisplayBuilder(data);
		case ComponentType.Thumbnail:
			return new ThumbnailBuilder(data);
		case ComponentType.MediaGallery:
			return new MediaGalleryBuilder(data);
		case ComponentType.Label:
			return new LabelBuilder(data);
		case ComponentType.FileUpload:
			return new FileUploadBuilder(data);
		default:
			// @ts-expect-error This case can still occur if we get a newer unsupported component type
			throw new Error(`Cannot properly serialize component type: ${data.type}`);
	}
}

function isBuilder<Builder extends JSONEncodable<any>>(
	builder: unknown,
	Constructor: new () => Builder,
): builder is Builder {
	return builder instanceof Constructor;
}

export function resolveBuilder<ComponentType extends Record<PropertyKey, any>, Builder extends JSONEncodable<any>>(
	builder: Builder | ComponentType | ((builder: Builder) => Builder),
	Constructor: new (data?: ComponentType) => Builder,
) {
	if (isBuilder(builder, Constructor)) {
		return builder;
	}

	if (typeof builder === 'function') {
		return builder(new Constructor());
	}

	return new Constructor(builder);
}
