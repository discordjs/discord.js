/* eslint-disable no-use-before-define */
'use strict';

// eslint-disable-next-line import-x/order
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
 * @typedef {Object} ModalComponentData
 * @property {string} title The title of the modal
 * @property {string} customId The custom id of the modal
 * @property {Array<TextDisplayComponentData|LabelData>} components The components within this modal
 */

/**
 * @typedef {StringSelectMenuComponentData|TextInputComponentData|UserSelectMenuComponentData|
 * RoleSelectMenuComponentData|MentionableSelectMenuComponentData|ChannelSelectMenuComponentData} ComponentInLabelData
 */

/**
 * @typedef {BaseComponentData} LabelData
 * @property {string} label The label to use
 * @property {string} [description] The optional description for the label
 * @property {ComponentInLabelData} component The component within the label
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
 * @typedef {BaseComponentData} BaseSelectMenuComponentData
 * @property {string} customId The custom id of the select menu
 * @property {boolean} [disabled] Whether the select menu is disabled or not
 * @property {number} [maxValues] The maximum amount of options that can be selected
 * @property {number} [minValues] The minimum amount of options that can be selected
 * @property {string} [placeholder] The placeholder of the select menu
 * @property {boolean} [required] Whether this component is required in modals
 */

/**
 * @typedef {BaseSelectMenuComponentData} StringSelectMenuComponentData
 * @property {SelectMenuComponentOptionData[]} [options] The options in this select menu
 */

/**
 * @typedef {BaseSelectMenuComponentData} UserSelectMenuComponentData
 * @property {APISelectMenuDefaultValue[]} [defaultValues] The default selected values in this select menu
 */

/**
 * @typedef {BaseSelectMenuComponentData} RoleSelectMenuComponentData
 * @property {APISelectMenuDefaultValue[]} [defaultValues] The default selected values in this select menu
 */

/**
 * @typedef {BaseSelectMenuComponentData} MentionableSelectMenuComponentData
 * @property {APISelectMenuDefaultValue[]} [defaultValues] The default selected values in this select menu
 */

/**
 * @typedef {BaseSelectMenuComponentData} ChannelSelectMenuComponentData
 * @property {APISelectMenuDefaultValue[]} [defaultValues] The default selected values in this select menu
 * @property {ChannelType[]} [channelTypes] The types of channels that can be selected
 */

/**
 * @typedef {Object} SelectMenuComponentOptionData
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
 * @typedef {ActionRow|ContainerComponent|FileComponent|MediaGalleryComponent|
 * SectionComponent|SeparatorComponent|TextDisplayComponent} MessageTopLevelComponent
 */

/**
 * Transforms API data into a component
 *
 * @param {APIMessageComponent|Component} data The data to create the component from
 * @returns {Component}
 * @ignore
 */
function createComponent(data) {
  return data instanceof Component ? data : new (ComponentTypeToClass[data.type] ?? Component)(data);
}

/**
 * Extracts all interactive components from the component tree
 *
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
 *
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

exports.createComponent = createComponent;
exports.findComponentByCustomId = findComponentByCustomId;

const { ActionRow } = require('../structures/ActionRow.js');
const { ButtonComponent } = require('../structures/ButtonComponent.js');
const { ChannelSelectMenuComponent } = require('../structures/ChannelSelectMenuComponent.js');
const { Component } = require('../structures/Component.js');
const { ContainerComponent } = require('../structures/ContainerComponent.js');
const { FileComponent } = require('../structures/FileComponent.js');
const { LabelComponent } = require('../structures/LabelComponent.js');
const { MediaGalleryComponent } = require('../structures/MediaGalleryComponent.js');
const { MentionableSelectMenuComponent } = require('../structures/MentionableSelectMenuComponent.js');
const { RoleSelectMenuComponent } = require('../structures/RoleSelectMenuComponent.js');
const { SectionComponent } = require('../structures/SectionComponent.js');
const { SeparatorComponent } = require('../structures/SeparatorComponent.js');
const { StringSelectMenuComponent } = require('../structures/StringSelectMenuComponent.js');
const { TextDisplayComponent } = require('../structures/TextDisplayComponent.js');
const { TextInputComponent } = require('../structures/TextInputComponent.js');
const { ThumbnailComponent } = require('../structures/ThumbnailComponent.js');
const { UserSelectMenuComponent } = require('../structures/UserSelectMenuComponent.js');

const ComponentTypeToClass = {
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
  [ComponentType.Label]: LabelComponent,
};
