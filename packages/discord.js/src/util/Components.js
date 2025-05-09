'use strict';

const { ComponentBuilder } = require('@discordjs/builders');
const { ComponentType } = require('discord-api-types/v10');

/**
 * @typedef {Object} BaseComponentData
 * @property {number} [id] the id of this component
 * @property {ComponentType} type The type of component
 */

/**
 * @typedef {BaseComponentData} ActionRowData
 * @property {ComponentData[]} components The components in this action row
 */

/**
 * @typedef {BaseComponentData} ButtonComponentData
 * @property {ButtonStyle} style The style of the button
 * @property {boolean} [disabled] Whether this button is disabled
 * @property {string} label The label of this button
 * @property {APIMessageComponentEmoji} [emoji] The emoji on this button
 * @property {string} [customId] The custom id of the button
 * @property {string} [url] The URL of the button
 */

/**
 * @typedef {object} SelectMenuComponentOptionData
 * @property {string} label The label of the option
 * @property {string} value The value of the option
 * @property {string} [description] The description of the option
 * @property {APIMessageComponentEmoji} [emoji] The emoji on the option
 * @property {boolean} [default] Whether this option is selected by default
 */

/**
 * @typedef {BaseComponentData} SelectMenuComponentData
 * @property {string} customId The custom id of the select menu
 * @property {boolean} [disabled] Whether the select menu is disabled or not
 * @property {number} [maxValues] The maximum amount of options that can be selected
 * @property {number} [minValues] The minimum amount of options that can be selected
 * @property {SelectMenuComponentOptionData[]} [options] The options in this select menu
 * @property {string} [placeholder] The placeholder of the select menu
 */

/**
 * @typedef {ActionRowData|ButtonComponentData|SelectMenuComponentData} MessageComponentData
 */

/**
 * @typedef {BaseComponentData} TextInputComponentData
 * @property {string} customId The custom id of the text input
 * @property {TextInputStyle} style The style of the text input
 * @property {string} label The text that appears on top of the text input field
 * @property {number} [minLength] The minimum number of characters that can be entered in the text input
 * @property {number} [maxLength] The maximum number of characters that can be entered in the text input
 * @property {boolean} [required] Whether or not the text input is required or not
 * @property {string} [value] The pre-filled text in the text input
 * @property {string} [placeholder] Placeholder for the text input
 */

/**
 * @typedef {Object} UnfurledMediaItemData
 * @property {string} url The url of this media item. Accepts either http:, https: or attachment: protocol
 */

/**
 * @typedef {BaseComponentData} ThumbnailComponentData
 * @property {UnfurledMediaItemData} media The media for the thumbnail
 * @property {string} [description] The description of the thumbnail
 * @property {boolean} [spoiler] Whether the thumbnail should be spoilered
 */

/**
 * @typedef {BaseComponentData} FileComponentData
 * @property {UnfurledMediaItemData} file The file media in this component
 * @property {boolean} [spoiler] Whether the file should be spoilered
 */

/**
 * @typedef {Object} MediaGalleryItemData
 * @property {UnfurledMediaItemData} media The media for the media gallery item
 * @property {string} [description] The description of the media gallery item
 * @property {boolean} [spoiler] Whether the media gallery item should be spoilered
 */

/**
 * @typedef {BaseComponentData} MediaGalleryComponentData
 * @property {MediaGalleryItemData[]} items The media gallery items in this media gallery component
 */

/**
 * @typedef {BaseComponentData} SeparatorComponentData
 * @property {SeparatorSpacingSize} [spacing] The spacing size of this component
 * @property {boolean} [divider] Whether the separator shows as a divider
 */

/**
 * @typedef {BaseComponentData} SectionComponentData
 * @property {Components[]} components The components in this section
 * @property {ButtonComponentData|ThumbnailComponentData} accessory The accessory shown next to this section
 */

/**
 * @typedef {BaseComponentData} TextDisplayComponentData
 * @property {string} content The content displayed in this component
 */

/**
 * @typedef {ActionRowData|FileComponentData|MediaGalleryComponentData|SectionComponentData|
 * SeparatorComponentData|TextDisplayComponentData} ComponentInContainerData
 */

/**
 * @typedef {BaseComponentData} ContainerComponentData
 * @property {ComponentInContainerData} components The components in this container
 * @property {?number} [accentColor] The accent color of this container
 * @property {boolean} [spoiler] Whether the container should be spoilered
 */

/**
 * @typedef {ActionRowData|ButtonComponentData|SelectMenuComponentData|TextInputComponentData|
 * ThumbnailComponentData|FileComponentData|MediaGalleryComponentData|SeparatorComponentData|
 * SectionComponentData|TextDisplayComponentData|ContainerComponentData} ComponentData
 */

/**
 * Any emoji data that can be used within a button
 * @typedef {APIMessageComponentEmoji|string} ComponentEmojiResolvable
 */

/**
 * @typedef {ActionRow|ContainerComponent|FileComponent|MediaGalleryComponent|
 * SectionComponent|SeparatorComponent|TextDisplayComponent} MessageTopLevelComponent
 */

/**
 * Transforms API data into a component
 * @param {APIMessageComponent|Component} data The data to create the component from
 * @returns {Component}
 * @ignore
 */
function createComponent(data) {
  return data instanceof Component ? data : new (ComponentTypeToComponent[data.type] ?? Component)(data);
}

/**
 * Transforms API data into a component builder
 * @param {APIMessageComponent|ComponentBuilder} data The data to create the component from
 * @returns {ComponentBuilder}
 * @ignore
 */
function createComponentBuilder(data) {
  return data instanceof ComponentBuilder ? data : new (ComponentTypeToBuilder[data.type] ?? ComponentBuilder)(data);
}

/**
 * Extracts all interactive components from the component tree
 * @param {Component|APIMessageComponent} component The component to find all interactive components in
 * @returns {Array<Component|APIMessageComponent>}
 * @ignore
 */
function extractInteractiveComponents(component) {
  switch (component.type) {
    case ComponentType.ActionRow:
      return component.components;
    case ComponentType.Section:
      return [...component.components, component.accessory];
    case ComponentType.Container:
      return component.components.flatMap(extractInteractiveComponents);
    default:
      return [component];
  }
}

/**
 * Finds a component by customId in nested components
 * @param {Array<Component|APIMessageComponent>} components The components to search in
 * @param {string} customId The customId to search for
 * @returns {Component|APIMessageComponent}
 * @ignore
 */
function findComponentByCustomId(components, customId) {
  return (
    components
      .flatMap(extractInteractiveComponents)
      .find(component => (component.customId ?? component.custom_id) === customId) ?? null
  );
}

module.exports = { createComponent, createComponentBuilder, findComponentByCustomId };

const ActionRow = require('../structures/ActionRow');
const ActionRowBuilder = require('../structures/ActionRowBuilder');
const ButtonBuilder = require('../structures/ButtonBuilder');
const ButtonComponent = require('../structures/ButtonComponent');
const ChannelSelectMenuBuilder = require('../structures/ChannelSelectMenuBuilder');
const ChannelSelectMenuComponent = require('../structures/ChannelSelectMenuComponent');
const Component = require('../structures/Component');
const ContainerComponent = require('../structures/ContainerComponent');
const FileComponent = require('../structures/FileComponent');
const MediaGalleryComponent = require('../structures/MediaGalleryComponent');
const MentionableSelectMenuBuilder = require('../structures/MentionableSelectMenuBuilder');
const MentionableSelectMenuComponent = require('../structures/MentionableSelectMenuComponent');
const RoleSelectMenuBuilder = require('../structures/RoleSelectMenuBuilder');
const RoleSelectMenuComponent = require('../structures/RoleSelectMenuComponent');
const SectionComponent = require('../structures/SectionComponent');
const SeparatorComponent = require('../structures/SeparatorComponent');
const StringSelectMenuBuilder = require('../structures/StringSelectMenuBuilder');
const StringSelectMenuComponent = require('../structures/StringSelectMenuComponent');
const TextDisplayComponent = require('../structures/TextDisplayComponent');
const TextInputBuilder = require('../structures/TextInputBuilder');
const TextInputComponent = require('../structures/TextInputComponent');
const ThumbnailComponent = require('../structures/ThumbnailComponent');
const UserSelectMenuBuilder = require('../structures/UserSelectMenuBuilder');
const UserSelectMenuComponent = require('../structures/UserSelectMenuComponent');

const ComponentTypeToComponent = {
  [ComponentType.ActionRow]: ActionRow,
  [ComponentType.Button]: ButtonComponent,
  [ComponentType.StringSelect]: StringSelectMenuComponent,
  [ComponentType.TextInput]: TextInputComponent,
  [ComponentType.UserSelect]: UserSelectMenuComponent,
  [ComponentType.RoleSelect]: RoleSelectMenuComponent,
  [ComponentType.MentionableSelect]: MentionableSelectMenuComponent,
  [ComponentType.ChannelSelect]: ChannelSelectMenuComponent,
  [ComponentType.Container]: ContainerComponent,
  [ComponentType.TextDisplay]: TextDisplayComponent,
  [ComponentType.File]: FileComponent,
  [ComponentType.MediaGallery]: MediaGalleryComponent,
  [ComponentType.Section]: SectionComponent,
  [ComponentType.Separator]: SeparatorComponent,
  [ComponentType.Thumbnail]: ThumbnailComponent,
};

const ComponentTypeToBuilder = {
  [ComponentType.ActionRow]: ActionRowBuilder,
  [ComponentType.Button]: ButtonBuilder,
  [ComponentType.StringSelect]: StringSelectMenuBuilder,
  [ComponentType.TextInput]: TextInputBuilder,
  [ComponentType.UserSelect]: UserSelectMenuBuilder,
  [ComponentType.RoleSelect]: RoleSelectMenuBuilder,
  [ComponentType.MentionableSelect]: MentionableSelectMenuBuilder,
  [ComponentType.ChannelSelect]: ChannelSelectMenuBuilder,
};
