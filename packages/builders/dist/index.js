"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ActionRowBuilder: () => ActionRowBuilder,
  ButtonBuilder: () => ButtonBuilder,
  ComponentAssertions: () => Assertions_exports2,
  ComponentBuilder: () => ComponentBuilder,
  ContextMenuCommandAssertions: () => Assertions_exports6,
  ContextMenuCommandBuilder: () => ContextMenuCommandBuilder,
  EmbedAssertions: () => Assertions_exports,
  EmbedBuilder: () => EmbedBuilder,
  Faces: () => Faces,
  ModalAssertions: () => Assertions_exports4,
  ModalBuilder: () => ModalBuilder,
  SelectMenuBuilder: () => SelectMenuBuilder,
  SelectMenuOptionBuilder: () => SelectMenuOptionBuilder,
  SlashCommandAssertions: () => Assertions_exports5,
  SlashCommandAttachmentOption: () => SlashCommandAttachmentOption,
  SlashCommandBooleanOption: () => SlashCommandBooleanOption,
  SlashCommandBuilder: () => SlashCommandBuilder,
  SlashCommandChannelOption: () => SlashCommandChannelOption,
  SlashCommandIntegerOption: () => SlashCommandIntegerOption,
  SlashCommandMentionableOption: () => SlashCommandMentionableOption,
  SlashCommandNumberOption: () => SlashCommandNumberOption,
  SlashCommandRoleOption: () => SlashCommandRoleOption,
  SlashCommandStringOption: () => SlashCommandStringOption,
  SlashCommandSubcommandBuilder: () => SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder: () => SlashCommandSubcommandGroupBuilder,
  SlashCommandUserOption: () => SlashCommandUserOption,
  TextInputAssertions: () => Assertions_exports3,
  TextInputBuilder: () => TextInputBuilder,
  TimestampStyles: () => TimestampStyles,
  UnsafeButtonBuilder: () => UnsafeButtonBuilder,
  UnsafeEmbedBuilder: () => UnsafeEmbedBuilder,
  UnsafeModalBuilder: () => UnsafeModalBuilder,
  UnsafeSelectMenuBuilder: () => UnsafeSelectMenuBuilder,
  UnsafeSelectMenuOptionBuilder: () => UnsafeSelectMenuOptionBuilder,
  UnsafeTextInputBuilder: () => UnsafeTextInputBuilder,
  blockQuote: () => blockQuote,
  bold: () => bold,
  channelMention: () => channelMention,
  codeBlock: () => codeBlock,
  createComponentBuilder: () => createComponentBuilder,
  embedLength: () => embedLength,
  formatEmoji: () => formatEmoji,
  hideLinkEmbed: () => hideLinkEmbed,
  hyperlink: () => hyperlink,
  inlineCode: () => inlineCode,
  isEquatable: () => isEquatable,
  isJSONEncodable: () => isJSONEncodable,
  italic: () => italic,
  quote: () => quote,
  roleMention: () => roleMention,
  spoiler: () => spoiler,
  strikethrough: () => strikethrough,
  time: () => time,
  underscore: () => underscore,
  userMention: () => userMention
});
module.exports = __toCommonJS(src_exports);

// src/messages/embed/Assertions.ts
var Assertions_exports = {};
__export(Assertions_exports, {
  RGBPredicate: () => RGBPredicate,
  authorNamePredicate: () => authorNamePredicate,
  colorPredicate: () => colorPredicate,
  descriptionPredicate: () => descriptionPredicate,
  embedAuthorPredicate: () => embedAuthorPredicate,
  embedFieldPredicate: () => embedFieldPredicate,
  embedFieldsArrayPredicate: () => embedFieldsArrayPredicate,
  embedFooterPredicate: () => embedFooterPredicate,
  fieldInlinePredicate: () => fieldInlinePredicate,
  fieldLengthPredicate: () => fieldLengthPredicate,
  fieldNamePredicate: () => fieldNamePredicate,
  fieldValuePredicate: () => fieldValuePredicate,
  footerTextPredicate: () => footerTextPredicate,
  imageURLPredicate: () => imageURLPredicate,
  timestampPredicate: () => timestampPredicate,
  titlePredicate: () => titlePredicate,
  urlPredicate: () => urlPredicate,
  validateFieldLength: () => validateFieldLength
});
var import_shapeshift = require("@sapphire/shapeshift");
var fieldNamePredicate = import_shapeshift.s.string.lengthGe(1).lengthLe(256);
var fieldValuePredicate = import_shapeshift.s.string.lengthGe(1).lengthLe(1024);
var fieldInlinePredicate = import_shapeshift.s.boolean.optional;
var embedFieldPredicate = import_shapeshift.s.object({
  name: fieldNamePredicate,
  value: fieldValuePredicate,
  inline: fieldInlinePredicate
});
var embedFieldsArrayPredicate = embedFieldPredicate.array;
var fieldLengthPredicate = import_shapeshift.s.number.le(25);
function validateFieldLength(amountAdding, fields) {
  fieldLengthPredicate.parse((fields?.length ?? 0) + amountAdding);
}
__name(validateFieldLength, "validateFieldLength");
var authorNamePredicate = fieldNamePredicate.nullable;
var imageURLPredicate = import_shapeshift.s.string.url({
  allowedProtocols: ["http:", "https:", "attachment:"]
}).nullish;
var urlPredicate = import_shapeshift.s.string.url({
  allowedProtocols: ["http:", "https:"]
}).nullish;
var embedAuthorPredicate = import_shapeshift.s.object({
  name: authorNamePredicate,
  iconURL: imageURLPredicate,
  url: urlPredicate
});
var RGBPredicate = import_shapeshift.s.number.int.ge(0).le(255);
var colorPredicate = import_shapeshift.s.number.int.ge(0).le(16777215).or(import_shapeshift.s.tuple([RGBPredicate, RGBPredicate, RGBPredicate])).nullable;
var descriptionPredicate = import_shapeshift.s.string.lengthGe(1).lengthLe(4096).nullable;
var footerTextPredicate = import_shapeshift.s.string.lengthGe(1).lengthLe(2048).nullable;
var embedFooterPredicate = import_shapeshift.s.object({
  text: footerTextPredicate,
  iconURL: imageURLPredicate
});
var timestampPredicate = import_shapeshift.s.union(import_shapeshift.s.number, import_shapeshift.s.date).nullable;
var titlePredicate = fieldNamePredicate.nullable;

// src/messages/embed/UnsafeEmbed.ts
var UnsafeEmbedBuilder = class {
  constructor(data = {}) {
    __publicField(this, "data");
    this.data = { ...data };
    if (data.timestamp)
      this.data.timestamp = new Date(data.timestamp).toISOString();
  }
  addFields(fields) {
    if (this.data.fields)
      this.data.fields.push(...fields);
    else
      this.data.fields = fields;
    return this;
  }
  spliceFields(index, deleteCount, ...fields) {
    if (this.data.fields)
      this.data.fields.splice(index, deleteCount, ...fields);
    else
      this.data.fields = fields;
    return this;
  }
  setFields(fields) {
    this.spliceFields(0, this.data.fields?.length ?? 0, ...fields);
    return this;
  }
  setAuthor(options) {
    if (options === null) {
      this.data.author = void 0;
      return this;
    }
    this.data.author = { name: options.name, url: options.url, icon_url: options.iconURL };
    return this;
  }
  setColor(color) {
    if (Array.isArray(color)) {
      const [red, green, blue] = color;
      this.data.color = (red << 16) + (green << 8) + blue;
      return this;
    }
    this.data.color = color ?? void 0;
    return this;
  }
  setDescription(description) {
    this.data.description = description ?? void 0;
    return this;
  }
  setFooter(options) {
    if (options === null) {
      this.data.footer = void 0;
      return this;
    }
    this.data.footer = { text: options.text, icon_url: options.iconURL };
    return this;
  }
  setImage(url) {
    this.data.image = url ? { url } : void 0;
    return this;
  }
  setThumbnail(url) {
    this.data.thumbnail = url ? { url } : void 0;
    return this;
  }
  setTimestamp(timestamp = Date.now()) {
    this.data.timestamp = timestamp ? new Date(timestamp).toISOString() : void 0;
    return this;
  }
  setTitle(title) {
    this.data.title = title ?? void 0;
    return this;
  }
  setURL(url) {
    this.data.url = url ?? void 0;
    return this;
  }
  toJSON() {
    return { ...this.data };
  }
};
__name(UnsafeEmbedBuilder, "UnsafeEmbedBuilder");

// src/messages/embed/Embed.ts
var EmbedBuilder = class extends UnsafeEmbedBuilder {
  addFields(fields) {
    validateFieldLength(fields.length, this.data.fields);
    return super.addFields(embedFieldsArrayPredicate.parse(fields));
  }
  spliceFields(index, deleteCount, ...fields) {
    validateFieldLength(fields.length - deleteCount, this.data.fields);
    return super.spliceFields(index, deleteCount, ...embedFieldsArrayPredicate.parse(fields));
  }
  setAuthor(options) {
    if (options === null) {
      return super.setAuthor(null);
    }
    embedAuthorPredicate.parse(options);
    return super.setAuthor(options);
  }
  setColor(color) {
    return super.setColor(colorPredicate.parse(color));
  }
  setDescription(description) {
    return super.setDescription(descriptionPredicate.parse(description));
  }
  setFooter(options) {
    if (options === null) {
      return super.setFooter(null);
    }
    embedFooterPredicate.parse(options);
    return super.setFooter(options);
  }
  setImage(url) {
    return super.setImage(imageURLPredicate.parse(url));
  }
  setThumbnail(url) {
    return super.setThumbnail(imageURLPredicate.parse(url));
  }
  setTimestamp(timestamp = Date.now()) {
    return super.setTimestamp(timestampPredicate.parse(timestamp));
  }
  setTitle(title) {
    return super.setTitle(titlePredicate.parse(title));
  }
  setURL(url) {
    return super.setURL(urlPredicate.parse(url));
  }
};
__name(EmbedBuilder, "EmbedBuilder");

// src/messages/formatters.ts
function codeBlock(language, content) {
  return typeof content === "undefined" ? `\`\`\`
${language}\`\`\`` : `\`\`\`${language}
${content}\`\`\``;
}
__name(codeBlock, "codeBlock");
function inlineCode(content) {
  return `\`${content}\``;
}
__name(inlineCode, "inlineCode");
function italic(content) {
  return `_${content}_`;
}
__name(italic, "italic");
function bold(content) {
  return `**${content}**`;
}
__name(bold, "bold");
function underscore(content) {
  return `__${content}__`;
}
__name(underscore, "underscore");
function strikethrough(content) {
  return `~~${content}~~`;
}
__name(strikethrough, "strikethrough");
function quote(content) {
  return `> ${content}`;
}
__name(quote, "quote");
function blockQuote(content) {
  return `>>> ${content}`;
}
__name(blockQuote, "blockQuote");
function hideLinkEmbed(url) {
  return `<${url}>`;
}
__name(hideLinkEmbed, "hideLinkEmbed");
function hyperlink(content, url, title) {
  return title ? `[${content}](${url} "${title}")` : `[${content}](${url})`;
}
__name(hyperlink, "hyperlink");
function spoiler(content) {
  return `||${content}||`;
}
__name(spoiler, "spoiler");
function userMention(userId) {
  return `<@${userId}>`;
}
__name(userMention, "userMention");
function channelMention(channelId) {
  return `<#${channelId}>`;
}
__name(channelMention, "channelMention");
function roleMention(roleId) {
  return `<@&${roleId}>`;
}
__name(roleMention, "roleMention");
function formatEmoji(emojiId, animated = false) {
  return `<${animated ? "a" : ""}:_:${emojiId}>`;
}
__name(formatEmoji, "formatEmoji");
function time(timeOrSeconds, style) {
  if (typeof timeOrSeconds !== "number") {
    timeOrSeconds = Math.floor((timeOrSeconds?.getTime() ?? Date.now()) / 1e3);
  }
  return typeof style === "string" ? `<t:${timeOrSeconds}:${style}>` : `<t:${timeOrSeconds}>`;
}
__name(time, "time");
var TimestampStyles = {
  ShortTime: "t",
  LongTime: "T",
  ShortDate: "d",
  LongDate: "D",
  ShortDateTime: "f",
  LongDateTime: "F",
  RelativeTime: "R"
};
var Faces = /* @__PURE__ */ ((Faces2) => {
  Faces2["Shrug"] = "\xAF\\_(\u30C4)\\_/\xAF";
  Faces2["Tableflip"] = "(\u256F\xB0\u25A1\xB0\uFF09\u256F\uFE35 \u253B\u2501\u253B";
  Faces2["Unflip"] = "\u252C\u2500\u252C \u30CE( \u309C-\u309C\u30CE)";
  return Faces2;
})(Faces || {});

// src/components/Assertions.ts
var Assertions_exports2 = {};
__export(Assertions_exports2, {
  buttonLabelValidator: () => buttonLabelValidator,
  buttonStyleValidator: () => buttonStyleValidator,
  customIdValidator: () => customIdValidator,
  defaultValidator: () => defaultValidator,
  disabledValidator: () => disabledValidator,
  emojiValidator: () => emojiValidator,
  labelValueDescriptionValidator: () => labelValueDescriptionValidator,
  labelValueValidator: () => labelValueValidator,
  minMaxValidator: () => minMaxValidator,
  optionValidator: () => optionValidator,
  optionsLengthValidator: () => optionsLengthValidator,
  optionsValidator: () => optionsValidator,
  placeholderValidator: () => placeholderValidator,
  urlValidator: () => urlValidator,
  validateRequiredButtonParameters: () => validateRequiredButtonParameters,
  validateRequiredSelectMenuOptionParameters: () => validateRequiredSelectMenuOptionParameters,
  validateRequiredSelectMenuParameters: () => validateRequiredSelectMenuParameters
});
var import_shapeshift2 = require("@sapphire/shapeshift");
var import_v10 = require("discord-api-types/v10");

// src/components/selectMenu/UnsafeSelectMenuOption.ts
var UnsafeSelectMenuOptionBuilder = class {
  constructor(data = {}) {
    this.data = data;
  }
  setLabel(label) {
    this.data.label = label;
    return this;
  }
  setValue(value) {
    this.data.value = value;
    return this;
  }
  setDescription(description) {
    this.data.description = description;
    return this;
  }
  setDefault(isDefault = true) {
    this.data.default = isDefault;
    return this;
  }
  setEmoji(emoji) {
    this.data.emoji = emoji;
    return this;
  }
  toJSON() {
    return {
      ...this.data
    };
  }
};
__name(UnsafeSelectMenuOptionBuilder, "UnsafeSelectMenuOptionBuilder");

// src/components/Assertions.ts
var customIdValidator = import_shapeshift2.s.string.lengthGe(1).lengthLe(100);
var emojiValidator = import_shapeshift2.s.object({
  id: import_shapeshift2.s.string,
  name: import_shapeshift2.s.string,
  animated: import_shapeshift2.s.boolean
}).partial.strict;
var disabledValidator = import_shapeshift2.s.boolean;
var buttonLabelValidator = import_shapeshift2.s.string.lengthGe(1).lengthLe(80);
var buttonStyleValidator = import_shapeshift2.s.nativeEnum(import_v10.ButtonStyle);
var placeholderValidator = import_shapeshift2.s.string.lengthLe(150);
var minMaxValidator = import_shapeshift2.s.number.int.ge(0).le(25);
var labelValueDescriptionValidator = import_shapeshift2.s.string.lengthGe(1).lengthLe(100);
var optionValidator = import_shapeshift2.s.union(import_shapeshift2.s.object({
  label: labelValueDescriptionValidator,
  value: labelValueDescriptionValidator,
  description: labelValueDescriptionValidator.optional,
  emoji: emojiValidator.optional,
  default: import_shapeshift2.s.boolean.optional
}), import_shapeshift2.s.instance(UnsafeSelectMenuOptionBuilder));
var optionsValidator = optionValidator.array.lengthGe(0);
var optionsLengthValidator = import_shapeshift2.s.number.int.ge(0).le(25);
function validateRequiredSelectMenuParameters(options, customId) {
  customIdValidator.parse(customId);
  optionsValidator.parse(options);
}
__name(validateRequiredSelectMenuParameters, "validateRequiredSelectMenuParameters");
var labelValueValidator = import_shapeshift2.s.string.lengthGe(1).lengthLe(100);
var defaultValidator = import_shapeshift2.s.boolean;
function validateRequiredSelectMenuOptionParameters(label, value) {
  labelValueValidator.parse(label);
  labelValueValidator.parse(value);
}
__name(validateRequiredSelectMenuOptionParameters, "validateRequiredSelectMenuOptionParameters");
var urlValidator = import_shapeshift2.s.string.url({
  allowedProtocols: ["http:", "https:", "discord:"]
});
function validateRequiredButtonParameters(style, label, emoji, customId, url) {
  if (url && customId) {
    throw new RangeError("URL and custom id are mutually exclusive");
  }
  if (!label && !emoji) {
    throw new RangeError("Buttons must have a label and/or an emoji");
  }
  if (style === import_v10.ButtonStyle.Link) {
    if (!url) {
      throw new RangeError("Link buttons must have a url");
    }
  } else if (url) {
    throw new RangeError("Non-link buttons cannot have a url");
  }
}
__name(validateRequiredButtonParameters, "validateRequiredButtonParameters");

// src/components/ActionRow.ts
var import_v103 = require("discord-api-types/v10");

// src/components/Component.ts
var ComponentBuilder = class {
  constructor(data) {
    __publicField(this, "data");
    this.data = data;
  }
};
__name(ComponentBuilder, "ComponentBuilder");

// src/components/Components.ts
var import_v102 = require("discord-api-types/v10");
function createComponentBuilder(data) {
  if (data instanceof ComponentBuilder) {
    return data;
  }
  switch (data.type) {
    case import_v102.ComponentType.ActionRow:
      return new ActionRowBuilder(data);
    case import_v102.ComponentType.Button:
      return new ButtonBuilder(data);
    case import_v102.ComponentType.SelectMenu:
      return new SelectMenuBuilder(data);
    case import_v102.ComponentType.TextInput:
      return new TextInputBuilder(data);
    default:
      throw new Error(`Cannot properly serialize component type: ${data.type}`);
  }
}
__name(createComponentBuilder, "createComponentBuilder");

// src/components/ActionRow.ts
var ActionRowBuilder = class extends ComponentBuilder {
  constructor({ components, ...data } = {}) {
    super({ type: import_v103.ComponentType.ActionRow, ...data });
    __publicField(this, "components");
    this.components = components?.map((c) => createComponentBuilder(c)) ?? [];
  }
  addComponents(components) {
    this.components.push(...components);
    return this;
  }
  setComponents(components) {
    this.components.splice(0, this.components.length, ...components);
    return this;
  }
  toJSON() {
    return {
      ...this.data,
      components: this.components.map((component) => component.toJSON())
    };
  }
};
__name(ActionRowBuilder, "ActionRowBuilder");

// src/components/button/UnsafeButton.ts
var import_v104 = require("discord-api-types/v10");
var UnsafeButtonBuilder = class extends ComponentBuilder {
  constructor(data) {
    super({ type: import_v104.ComponentType.Button, ...data });
  }
  setStyle(style) {
    this.data.style = style;
    return this;
  }
  setURL(url) {
    this.data.url = url;
    return this;
  }
  setCustomId(customId) {
    this.data.custom_id = customId;
    return this;
  }
  setEmoji(emoji) {
    this.data.emoji = emoji;
    return this;
  }
  setDisabled(disabled = true) {
    this.data.disabled = disabled;
    return this;
  }
  setLabel(label) {
    this.data.label = label;
    return this;
  }
  toJSON() {
    return {
      ...this.data
    };
  }
};
__name(UnsafeButtonBuilder, "UnsafeButtonBuilder");

// src/components/button/Button.ts
var ButtonBuilder = class extends UnsafeButtonBuilder {
  setStyle(style) {
    return super.setStyle(buttonStyleValidator.parse(style));
  }
  setURL(url) {
    return super.setURL(urlValidator.parse(url));
  }
  setCustomId(customId) {
    return super.setCustomId(customIdValidator.parse(customId));
  }
  setEmoji(emoji) {
    return super.setEmoji(emojiValidator.parse(emoji));
  }
  setDisabled(disabled = true) {
    return super.setDisabled(disabledValidator.parse(disabled));
  }
  setLabel(label) {
    return super.setLabel(buttonLabelValidator.parse(label));
  }
  toJSON() {
    validateRequiredButtonParameters(this.data.style, this.data.label, this.data.emoji, this.data.custom_id, this.data.url);
    return super.toJSON();
  }
};
__name(ButtonBuilder, "ButtonBuilder");

// src/components/textInput/Assertions.ts
var Assertions_exports3 = {};
__export(Assertions_exports3, {
  labelValidator: () => labelValidator,
  maxLengthValidator: () => maxLengthValidator,
  minLengthValidator: () => minLengthValidator,
  placeholderValidator: () => placeholderValidator2,
  requiredValidator: () => requiredValidator,
  textInputStyleValidator: () => textInputStyleValidator,
  validateRequiredParameters: () => validateRequiredParameters,
  valueValidator: () => valueValidator
});
var import_shapeshift3 = require("@sapphire/shapeshift");
var import_v105 = require("discord-api-types/v10");
var textInputStyleValidator = import_shapeshift3.s.nativeEnum(import_v105.TextInputStyle);
var minLengthValidator = import_shapeshift3.s.number.int.ge(0).le(4e3);
var maxLengthValidator = import_shapeshift3.s.number.int.ge(1).le(4e3);
var requiredValidator = import_shapeshift3.s.boolean;
var valueValidator = import_shapeshift3.s.string.lengthLe(4e3);
var placeholderValidator2 = import_shapeshift3.s.string.lengthLe(100);
var labelValidator = import_shapeshift3.s.string.lengthGe(1).lengthLe(45);
function validateRequiredParameters(customId, style, label) {
  customIdValidator.parse(customId);
  textInputStyleValidator.parse(style);
  labelValidator.parse(label);
}
__name(validateRequiredParameters, "validateRequiredParameters");

// src/components/textInput/UnsafeTextInput.ts
var import_v106 = require("discord-api-types/v10");
var import_fast_deep_equal = __toESM(require("fast-deep-equal"));
var UnsafeTextInputBuilder = class extends ComponentBuilder {
  constructor(data) {
    super({ type: import_v106.ComponentType.TextInput, ...data });
  }
  setCustomId(customId) {
    this.data.custom_id = customId;
    return this;
  }
  setLabel(label) {
    this.data.label = label;
    return this;
  }
  setStyle(style) {
    this.data.style = style;
    return this;
  }
  setMinLength(minLength) {
    this.data.min_length = minLength;
    return this;
  }
  setMaxLength(maxLength) {
    this.data.max_length = maxLength;
    return this;
  }
  setPlaceholder(placeholder) {
    this.data.placeholder = placeholder;
    return this;
  }
  setValue(value) {
    this.data.value = value;
    return this;
  }
  setRequired(required = true) {
    this.data.required = required;
    return this;
  }
  toJSON() {
    return {
      ...this.data
    };
  }
  equals(other) {
    if (other instanceof UnsafeTextInputBuilder) {
      return (0, import_fast_deep_equal.default)(other.data, this.data);
    }
    return (0, import_fast_deep_equal.default)(other, this.data);
  }
};
__name(UnsafeTextInputBuilder, "UnsafeTextInputBuilder");

// src/components/textInput/TextInput.ts
var TextInputBuilder = class extends UnsafeTextInputBuilder {
  setMinLength(minLength) {
    return super.setMinLength(minLengthValidator.parse(minLength));
  }
  setMaxLength(maxLength) {
    return super.setMaxLength(maxLengthValidator.parse(maxLength));
  }
  setRequired(required = true) {
    return super.setRequired(requiredValidator.parse(required));
  }
  setValue(value) {
    return super.setValue(valueValidator.parse(value));
  }
  setPlaceholder(placeholder) {
    return super.setPlaceholder(placeholderValidator2.parse(placeholder));
  }
  toJSON() {
    validateRequiredParameters(this.data.custom_id, this.data.style, this.data.label);
    return super.toJSON();
  }
};
__name(TextInputBuilder, "TextInputBuilder");

// src/interactions/modals/UnsafeModal.ts
var UnsafeModalBuilder = class {
  constructor({ components, ...data } = {}) {
    __publicField(this, "data");
    __publicField(this, "components", []);
    this.data = { ...data };
    this.components = components?.map((c) => createComponentBuilder(c)) ?? [];
  }
  setTitle(title) {
    this.data.title = title;
    return this;
  }
  setCustomId(customId) {
    this.data.custom_id = customId;
    return this;
  }
  addComponents(components) {
    this.components.push(...components.map((component) => component instanceof ActionRowBuilder ? component : new ActionRowBuilder(component)));
    return this;
  }
  setComponents(components) {
    this.components.splice(0, this.components.length, ...components);
    return this;
  }
  toJSON() {
    return {
      ...this.data,
      components: this.components.map((component) => component.toJSON())
    };
  }
};
__name(UnsafeModalBuilder, "UnsafeModalBuilder");

// src/interactions/modals/Assertions.ts
var Assertions_exports4 = {};
__export(Assertions_exports4, {
  componentsValidator: () => componentsValidator,
  titleValidator: () => titleValidator,
  validateRequiredParameters: () => validateRequiredParameters2
});
var import_shapeshift4 = require("@sapphire/shapeshift");
var titleValidator = import_shapeshift4.s.string.lengthGe(1).lengthLe(45);
var componentsValidator = import_shapeshift4.s.instance(ActionRowBuilder).array.lengthGe(1);
function validateRequiredParameters2(customId, title, components) {
  customIdValidator.parse(customId);
  titleValidator.parse(title);
  componentsValidator.parse(components);
}
__name(validateRequiredParameters2, "validateRequiredParameters");

// src/interactions/modals/Modal.ts
var ModalBuilder = class extends UnsafeModalBuilder {
  setCustomId(customId) {
    return super.setCustomId(customIdValidator.parse(customId));
  }
  setTitle(title) {
    return super.setTitle(titleValidator.parse(title));
  }
  toJSON() {
    validateRequiredParameters2(this.data.custom_id, this.data.title, this.components);
    return super.toJSON();
  }
};
__name(ModalBuilder, "ModalBuilder");

// src/components/selectMenu/UnsafeSelectMenu.ts
var import_v107 = require("discord-api-types/v10");
var UnsafeSelectMenuBuilder = class extends ComponentBuilder {
  constructor(data) {
    const { options, ...initData } = data ?? {};
    super({ type: import_v107.ComponentType.SelectMenu, ...initData });
    __publicField(this, "options");
    this.options = options?.map((o) => new UnsafeSelectMenuOptionBuilder(o)) ?? [];
  }
  setPlaceholder(placeholder) {
    this.data.placeholder = placeholder;
    return this;
  }
  setMinValues(minValues) {
    this.data.min_values = minValues;
    return this;
  }
  setMaxValues(maxValues) {
    this.data.max_values = maxValues;
    return this;
  }
  setCustomId(customId) {
    this.data.custom_id = customId;
    return this;
  }
  setDisabled(disabled = true) {
    this.data.disabled = disabled;
    return this;
  }
  addOptions(options) {
    this.options.push(...options.map((option) => option instanceof UnsafeSelectMenuOptionBuilder ? option : new UnsafeSelectMenuOptionBuilder(option)));
    return this;
  }
  setOptions(options) {
    this.options.splice(0, this.options.length, ...options.map((option) => option instanceof UnsafeSelectMenuOptionBuilder ? option : new UnsafeSelectMenuOptionBuilder(option)));
    return this;
  }
  toJSON() {
    return {
      ...this.data,
      options: this.options.map((o) => o.toJSON())
    };
  }
};
__name(UnsafeSelectMenuBuilder, "UnsafeSelectMenuBuilder");

// src/components/selectMenu/SelectMenu.ts
var SelectMenuBuilder = class extends UnsafeSelectMenuBuilder {
  setPlaceholder(placeholder) {
    return super.setPlaceholder(placeholderValidator.parse(placeholder));
  }
  setMinValues(minValues) {
    return super.setMinValues(minMaxValidator.parse(minValues));
  }
  setMaxValues(maxValues) {
    return super.setMaxValues(minMaxValidator.parse(maxValues));
  }
  setCustomId(customId) {
    return super.setCustomId(customIdValidator.parse(customId));
  }
  setDisabled(disabled = true) {
    return super.setDisabled(disabledValidator.parse(disabled));
  }
  addOptions(options) {
    optionsLengthValidator.parse(this.options.length + options.length);
    this.options.push(...options.map((option) => option instanceof UnsafeSelectMenuOptionBuilder ? option : new UnsafeSelectMenuOptionBuilder(optionValidator.parse(option))));
    return this;
  }
  setOptions(options) {
    optionsLengthValidator.parse(options.length);
    this.options.splice(0, this.options.length, ...options.map((option) => option instanceof UnsafeSelectMenuOptionBuilder ? option : new UnsafeSelectMenuOptionBuilder(optionValidator.parse(option))));
    return this;
  }
  toJSON() {
    validateRequiredSelectMenuParameters(this.options, this.data.custom_id);
    return super.toJSON();
  }
};
__name(SelectMenuBuilder, "SelectMenuBuilder");

// src/components/selectMenu/SelectMenuOption.ts
var SelectMenuOptionBuilder = class extends UnsafeSelectMenuOptionBuilder {
  setDescription(description) {
    return super.setDescription(labelValueValidator.parse(description));
  }
  setDefault(isDefault = true) {
    return super.setDefault(defaultValidator.parse(isDefault));
  }
  setEmoji(emoji) {
    return super.setEmoji(emojiValidator.parse(emoji));
  }
  toJSON() {
    validateRequiredSelectMenuOptionParameters(this.data.label, this.data.value);
    return super.toJSON();
  }
};
__name(SelectMenuOptionBuilder, "SelectMenuOptionBuilder");

// src/interactions/slashCommands/Assertions.ts
var Assertions_exports5 = {};
__export(Assertions_exports5, {
  assertReturnOfBuilder: () => assertReturnOfBuilder,
  validateChoicesLength: () => validateChoicesLength,
  validateDefaultPermission: () => validateDefaultPermission,
  validateDescription: () => validateDescription,
  validateLocale: () => validateLocale,
  validateMaxOptionsLength: () => validateMaxOptionsLength,
  validateName: () => validateName,
  validateRequired: () => validateRequired,
  validateRequiredParameters: () => validateRequiredParameters3
});
var import_shapeshift5 = require("@sapphire/shapeshift");
var import_is = __toESM(require("@sindresorhus/is"));
var import_v108 = require("discord-api-types/v10");
var namePredicate = import_shapeshift5.s.string.lengthGe(1).lengthLe(32).regex(/^[\P{Lu}\p{N}\p{sc=Devanagari}\p{sc=Thai}_-]+$/u);
function validateName(name) {
  namePredicate.parse(name);
}
__name(validateName, "validateName");
var descriptionPredicate2 = import_shapeshift5.s.string.lengthGe(1).lengthLe(100);
var localePredicate = import_shapeshift5.s.nativeEnum(import_v108.Locale);
function validateDescription(description) {
  descriptionPredicate2.parse(description);
}
__name(validateDescription, "validateDescription");
var maxArrayLengthPredicate = import_shapeshift5.s.unknown.array.lengthLe(25);
function validateLocale(locale) {
  return localePredicate.parse(locale);
}
__name(validateLocale, "validateLocale");
function validateMaxOptionsLength(options) {
  maxArrayLengthPredicate.parse(options);
}
__name(validateMaxOptionsLength, "validateMaxOptionsLength");
function validateRequiredParameters3(name, description, options) {
  validateName(name);
  validateDescription(description);
  validateMaxOptionsLength(options);
}
__name(validateRequiredParameters3, "validateRequiredParameters");
var booleanPredicate = import_shapeshift5.s.boolean;
function validateDefaultPermission(value) {
  booleanPredicate.parse(value);
}
__name(validateDefaultPermission, "validateDefaultPermission");
function validateRequired(required) {
  booleanPredicate.parse(required);
}
__name(validateRequired, "validateRequired");
var choicesLengthPredicate = import_shapeshift5.s.number.le(25);
function validateChoicesLength(amountAdding, choices) {
  choicesLengthPredicate.parse((choices?.length ?? 0) + amountAdding);
}
__name(validateChoicesLength, "validateChoicesLength");
function assertReturnOfBuilder(input, ExpectedInstanceOf) {
  const instanceName = ExpectedInstanceOf.name;
  if (import_is.default.nullOrUndefined(input)) {
    throw new TypeError(`Expected to receive a ${instanceName} builder, got ${input === null ? "null" : "undefined"} instead.`);
  }
  if (import_is.default.primitive(input)) {
    throw new TypeError(`Expected to receive a ${instanceName} builder, got a primitive (${typeof input}) instead.`);
  }
  if (!(input instanceof ExpectedInstanceOf)) {
    const casted = input;
    const constructorName = import_is.default.function_(input) ? input.name : casted.constructor.name;
    const stringTag = Reflect.get(casted, Symbol.toStringTag);
    const fullResultName = stringTag ? `${constructorName} [${stringTag}]` : constructorName;
    throw new TypeError(`Expected to receive a ${instanceName} builder, got ${fullResultName} instead.`);
  }
}
__name(assertReturnOfBuilder, "assertReturnOfBuilder");

// src/interactions/slashCommands/SlashCommandBuilder.ts
var import_ts_mixer6 = require("ts-mixer");

// src/interactions/slashCommands/SlashCommandSubcommands.ts
var import_v1020 = require("discord-api-types/v10");
var import_ts_mixer5 = require("ts-mixer");

// src/interactions/slashCommands/mixins/NameAndDescription.ts
var SharedNameAndDescription = class {
  constructor() {
    __publicField(this, "name");
    __publicField(this, "name_localizations");
    __publicField(this, "description");
    __publicField(this, "description_localizations");
  }
  setName(name) {
    validateName(name);
    Reflect.set(this, "name", name);
    return this;
  }
  setDescription(description) {
    validateDescription(description);
    Reflect.set(this, "description", description);
    return this;
  }
  setNameLocalization(locale, localizedName) {
    if (!this.name_localizations) {
      Reflect.set(this, "name_localizations", {});
    }
    if (localizedName === null) {
      this.name_localizations[locale] = null;
      return this;
    }
    validateName(localizedName);
    this.name_localizations[validateLocale(locale)] = localizedName;
    return this;
  }
  setNameLocalizations(localizedNames) {
    if (localizedNames === null) {
      Reflect.set(this, "name_localizations", null);
      return this;
    }
    Reflect.set(this, "name_localizations", {});
    Object.entries(localizedNames).forEach((args) => this.setNameLocalization(...args));
    return this;
  }
  setDescriptionLocalization(locale, localizedDescription) {
    if (!this.description_localizations) {
      Reflect.set(this, "description_localizations", {});
    }
    if (localizedDescription === null) {
      this.description_localizations[locale] = null;
      return this;
    }
    validateDescription(localizedDescription);
    this.description_localizations[validateLocale(locale)] = localizedDescription;
    return this;
  }
  setDescriptionLocalizations(localizedDescriptions) {
    if (localizedDescriptions === null) {
      Reflect.set(this, "description_localizations", null);
      return this;
    }
    Reflect.set(this, "description_localizations", {});
    Object.entries(localizedDescriptions).forEach((args) => this.setDescriptionLocalization(...args));
    return this;
  }
};
__name(SharedNameAndDescription, "SharedNameAndDescription");

// src/interactions/slashCommands/options/attachment.ts
var import_v109 = require("discord-api-types/v10");

// src/interactions/slashCommands/mixins/ApplicationCommandOptionBase.ts
var ApplicationCommandOptionBase = class extends SharedNameAndDescription {
  constructor() {
    super(...arguments);
    __publicField(this, "required", false);
  }
  setRequired(required) {
    validateRequired(required);
    Reflect.set(this, "required", required);
    return this;
  }
  runRequiredValidations() {
    validateRequiredParameters3(this.name, this.description, []);
    validateRequired(this.required);
  }
};
__name(ApplicationCommandOptionBase, "ApplicationCommandOptionBase");

// src/interactions/slashCommands/options/attachment.ts
var SlashCommandAttachmentOption = class extends ApplicationCommandOptionBase {
  constructor() {
    super(...arguments);
    __publicField(this, "type", import_v109.ApplicationCommandOptionType.Attachment);
  }
  toJSON() {
    this.runRequiredValidations();
    return { ...this };
  }
};
__name(SlashCommandAttachmentOption, "SlashCommandAttachmentOption");

// src/interactions/slashCommands/options/boolean.ts
var import_v1010 = require("discord-api-types/v10");
var SlashCommandBooleanOption = class extends ApplicationCommandOptionBase {
  constructor() {
    super(...arguments);
    __publicField(this, "type", import_v1010.ApplicationCommandOptionType.Boolean);
  }
  toJSON() {
    this.runRequiredValidations();
    return { ...this };
  }
};
__name(SlashCommandBooleanOption, "SlashCommandBooleanOption");

// src/interactions/slashCommands/options/channel.ts
var import_v1012 = require("discord-api-types/v10");
var import_ts_mixer = require("ts-mixer");

// src/interactions/slashCommands/mixins/ApplicationCommandOptionChannelTypesMixin.ts
var import_shapeshift6 = require("@sapphire/shapeshift");
var import_v1011 = require("discord-api-types/v10");
var allowedChannelTypes = [
  import_v1011.ChannelType.GuildText,
  import_v1011.ChannelType.GuildVoice,
  import_v1011.ChannelType.GuildCategory,
  import_v1011.ChannelType.GuildNews,
  import_v1011.ChannelType.GuildNewsThread,
  import_v1011.ChannelType.GuildPublicThread,
  import_v1011.ChannelType.GuildPrivateThread,
  import_v1011.ChannelType.GuildStageVoice
];
var channelTypesPredicate = import_shapeshift6.s.array(import_shapeshift6.s.union(...allowedChannelTypes.map((type) => import_shapeshift6.s.literal(type))));
var ApplicationCommandOptionChannelTypesMixin = class {
  constructor() {
    __publicField(this, "channel_types");
  }
  addChannelTypes(...channelTypes) {
    if (this.channel_types === void 0) {
      Reflect.set(this, "channel_types", []);
    }
    this.channel_types.push(...channelTypesPredicate.parse(channelTypes));
    return this;
  }
};
__name(ApplicationCommandOptionChannelTypesMixin, "ApplicationCommandOptionChannelTypesMixin");

// src/interactions/slashCommands/options/channel.ts
var SlashCommandChannelOption = class extends ApplicationCommandOptionBase {
  constructor() {
    super(...arguments);
    __publicField(this, "type", import_v1012.ApplicationCommandOptionType.Channel);
  }
  toJSON() {
    this.runRequiredValidations();
    return { ...this };
  }
};
__name(SlashCommandChannelOption, "SlashCommandChannelOption");
SlashCommandChannelOption = __decorateClass([
  (0, import_ts_mixer.mix)(ApplicationCommandOptionChannelTypesMixin)
], SlashCommandChannelOption);

// src/interactions/slashCommands/options/integer.ts
var import_shapeshift8 = require("@sapphire/shapeshift");
var import_v1014 = require("discord-api-types/v10");
var import_ts_mixer2 = require("ts-mixer");

// src/interactions/slashCommands/mixins/ApplicationCommandNumericOptionMinMaxValueMixin.ts
var ApplicationCommandNumericOptionMinMaxValueMixin = class {
  constructor() {
    __publicField(this, "max_value");
    __publicField(this, "min_value");
  }
};
__name(ApplicationCommandNumericOptionMinMaxValueMixin, "ApplicationCommandNumericOptionMinMaxValueMixin");

// src/interactions/slashCommands/mixins/ApplicationCommandOptionWithChoicesAndAutocompleteMixin.ts
var import_shapeshift7 = require("@sapphire/shapeshift");
var import_v1013 = require("discord-api-types/v10");
var stringPredicate = import_shapeshift7.s.string.lengthGe(1).lengthLe(100);
var numberPredicate = import_shapeshift7.s.number.gt(-Infinity).lt(Infinity);
var choicesPredicate = import_shapeshift7.s.object({ name: stringPredicate, value: import_shapeshift7.s.union(stringPredicate, numberPredicate) }).array;
var booleanPredicate2 = import_shapeshift7.s.boolean;
var ApplicationCommandOptionWithChoicesAndAutocompleteMixin = class {
  constructor() {
    __publicField(this, "choices");
    __publicField(this, "autocomplete");
    __publicField(this, "type");
  }
  addChoices(...choices) {
    if (choices.length > 0 && this.autocomplete) {
      throw new RangeError("Autocomplete and choices are mutually exclusive to each other.");
    }
    choicesPredicate.parse(choices);
    if (this.choices === void 0) {
      Reflect.set(this, "choices", []);
    }
    validateChoicesLength(choices.length, this.choices);
    for (const { name, value } of choices) {
      if (this.type === import_v1013.ApplicationCommandOptionType.String) {
        stringPredicate.parse(value);
      } else {
        numberPredicate.parse(value);
      }
      this.choices.push({ name, value });
    }
    return this;
  }
  setChoices(...choices) {
    if (choices.length > 0 && this.autocomplete) {
      throw new RangeError("Autocomplete and choices are mutually exclusive to each other.");
    }
    choicesPredicate.parse(choices);
    Reflect.set(this, "choices", []);
    this.addChoices(...choices);
    return this;
  }
  setAutocomplete(autocomplete) {
    booleanPredicate2.parse(autocomplete);
    if (autocomplete && Array.isArray(this.choices) && this.choices.length > 0) {
      throw new RangeError("Autocomplete and choices are mutually exclusive to each other.");
    }
    Reflect.set(this, "autocomplete", autocomplete);
    return this;
  }
};
__name(ApplicationCommandOptionWithChoicesAndAutocompleteMixin, "ApplicationCommandOptionWithChoicesAndAutocompleteMixin");

// src/interactions/slashCommands/options/integer.ts
var numberValidator = import_shapeshift8.s.number.int;
var SlashCommandIntegerOption = class extends ApplicationCommandOptionBase {
  constructor() {
    super(...arguments);
    __publicField(this, "type", import_v1014.ApplicationCommandOptionType.Integer);
  }
  setMaxValue(max) {
    numberValidator.parse(max);
    Reflect.set(this, "max_value", max);
    return this;
  }
  setMinValue(min) {
    numberValidator.parse(min);
    Reflect.set(this, "min_value", min);
    return this;
  }
  toJSON() {
    this.runRequiredValidations();
    if (this.autocomplete && Array.isArray(this.choices) && this.choices.length > 0) {
      throw new RangeError("Autocomplete and choices are mutually exclusive to each other.");
    }
    return { ...this };
  }
};
__name(SlashCommandIntegerOption, "SlashCommandIntegerOption");
SlashCommandIntegerOption = __decorateClass([
  (0, import_ts_mixer2.mix)(ApplicationCommandNumericOptionMinMaxValueMixin, ApplicationCommandOptionWithChoicesAndAutocompleteMixin)
], SlashCommandIntegerOption);

// src/interactions/slashCommands/options/mentionable.ts
var import_v1015 = require("discord-api-types/v10");
var SlashCommandMentionableOption = class extends ApplicationCommandOptionBase {
  constructor() {
    super(...arguments);
    __publicField(this, "type", import_v1015.ApplicationCommandOptionType.Mentionable);
  }
  toJSON() {
    this.runRequiredValidations();
    return { ...this };
  }
};
__name(SlashCommandMentionableOption, "SlashCommandMentionableOption");

// src/interactions/slashCommands/options/number.ts
var import_shapeshift9 = require("@sapphire/shapeshift");
var import_v1016 = require("discord-api-types/v10");
var import_ts_mixer3 = require("ts-mixer");
var numberValidator2 = import_shapeshift9.s.number;
var SlashCommandNumberOption = class extends ApplicationCommandOptionBase {
  constructor() {
    super(...arguments);
    __publicField(this, "type", import_v1016.ApplicationCommandOptionType.Number);
  }
  setMaxValue(max) {
    numberValidator2.parse(max);
    Reflect.set(this, "max_value", max);
    return this;
  }
  setMinValue(min) {
    numberValidator2.parse(min);
    Reflect.set(this, "min_value", min);
    return this;
  }
  toJSON() {
    this.runRequiredValidations();
    if (this.autocomplete && Array.isArray(this.choices) && this.choices.length > 0) {
      throw new RangeError("Autocomplete and choices are mutually exclusive to each other.");
    }
    return { ...this };
  }
};
__name(SlashCommandNumberOption, "SlashCommandNumberOption");
SlashCommandNumberOption = __decorateClass([
  (0, import_ts_mixer3.mix)(ApplicationCommandNumericOptionMinMaxValueMixin, ApplicationCommandOptionWithChoicesAndAutocompleteMixin)
], SlashCommandNumberOption);

// src/interactions/slashCommands/options/role.ts
var import_v1017 = require("discord-api-types/v10");
var SlashCommandRoleOption = class extends ApplicationCommandOptionBase {
  constructor() {
    super(...arguments);
    __publicField(this, "type", import_v1017.ApplicationCommandOptionType.Role);
  }
  toJSON() {
    this.runRequiredValidations();
    return { ...this };
  }
};
__name(SlashCommandRoleOption, "SlashCommandRoleOption");

// src/interactions/slashCommands/options/string.ts
var import_v1018 = require("discord-api-types/v10");
var import_ts_mixer4 = require("ts-mixer");
var SlashCommandStringOption = class extends ApplicationCommandOptionBase {
  constructor() {
    super(...arguments);
    __publicField(this, "type", import_v1018.ApplicationCommandOptionType.String);
  }
  toJSON() {
    this.runRequiredValidations();
    if (this.autocomplete && Array.isArray(this.choices) && this.choices.length > 0) {
      throw new RangeError("Autocomplete and choices are mutually exclusive to each other.");
    }
    return { ...this };
  }
};
__name(SlashCommandStringOption, "SlashCommandStringOption");
SlashCommandStringOption = __decorateClass([
  (0, import_ts_mixer4.mix)(ApplicationCommandOptionWithChoicesAndAutocompleteMixin)
], SlashCommandStringOption);

// src/interactions/slashCommands/options/user.ts
var import_v1019 = require("discord-api-types/v10");
var SlashCommandUserOption = class extends ApplicationCommandOptionBase {
  constructor() {
    super(...arguments);
    __publicField(this, "type", import_v1019.ApplicationCommandOptionType.User);
  }
  toJSON() {
    this.runRequiredValidations();
    return { ...this };
  }
};
__name(SlashCommandUserOption, "SlashCommandUserOption");

// src/interactions/slashCommands/mixins/SharedSlashCommandOptions.ts
var SharedSlashCommandOptions = class {
  constructor() {
    __publicField(this, "options");
  }
  addBooleanOption(input) {
    return this._sharedAddOptionMethod(input, SlashCommandBooleanOption);
  }
  addUserOption(input) {
    return this._sharedAddOptionMethod(input, SlashCommandUserOption);
  }
  addChannelOption(input) {
    return this._sharedAddOptionMethod(input, SlashCommandChannelOption);
  }
  addRoleOption(input) {
    return this._sharedAddOptionMethod(input, SlashCommandRoleOption);
  }
  addAttachmentOption(input) {
    return this._sharedAddOptionMethod(input, SlashCommandAttachmentOption);
  }
  addMentionableOption(input) {
    return this._sharedAddOptionMethod(input, SlashCommandMentionableOption);
  }
  addStringOption(input) {
    return this._sharedAddOptionMethod(input, SlashCommandStringOption);
  }
  addIntegerOption(input) {
    return this._sharedAddOptionMethod(input, SlashCommandIntegerOption);
  }
  addNumberOption(input) {
    return this._sharedAddOptionMethod(input, SlashCommandNumberOption);
  }
  _sharedAddOptionMethod(input, Instance) {
    const { options } = this;
    validateMaxOptionsLength(options);
    const result = typeof input === "function" ? input(new Instance()) : input;
    assertReturnOfBuilder(result, Instance);
    options.push(result);
    return this;
  }
};
__name(SharedSlashCommandOptions, "SharedSlashCommandOptions");

// src/interactions/slashCommands/SlashCommandSubcommands.ts
var SlashCommandSubcommandGroupBuilder = class {
  constructor() {
    __publicField(this, "name");
    __publicField(this, "description");
    __publicField(this, "options", []);
  }
  addSubcommand(input) {
    const { options } = this;
    validateMaxOptionsLength(options);
    const result = typeof input === "function" ? input(new SlashCommandSubcommandBuilder()) : input;
    assertReturnOfBuilder(result, SlashCommandSubcommandBuilder);
    options.push(result);
    return this;
  }
  toJSON() {
    validateRequiredParameters3(this.name, this.description, this.options);
    return {
      type: import_v1020.ApplicationCommandOptionType.SubcommandGroup,
      name: this.name,
      description: this.description,
      options: this.options.map((option) => option.toJSON())
    };
  }
};
__name(SlashCommandSubcommandGroupBuilder, "SlashCommandSubcommandGroupBuilder");
SlashCommandSubcommandGroupBuilder = __decorateClass([
  (0, import_ts_mixer5.mix)(SharedNameAndDescription)
], SlashCommandSubcommandGroupBuilder);
var SlashCommandSubcommandBuilder = class {
  constructor() {
    __publicField(this, "name");
    __publicField(this, "description");
    __publicField(this, "options", []);
  }
  toJSON() {
    validateRequiredParameters3(this.name, this.description, this.options);
    return {
      type: import_v1020.ApplicationCommandOptionType.Subcommand,
      name: this.name,
      description: this.description,
      options: this.options.map((option) => option.toJSON())
    };
  }
};
__name(SlashCommandSubcommandBuilder, "SlashCommandSubcommandBuilder");
SlashCommandSubcommandBuilder = __decorateClass([
  (0, import_ts_mixer5.mix)(SharedNameAndDescription, SharedSlashCommandOptions)
], SlashCommandSubcommandBuilder);

// src/interactions/slashCommands/SlashCommandBuilder.ts
var SlashCommandBuilder = class {
  constructor() {
    __publicField(this, "name");
    __publicField(this, "name_localizations");
    __publicField(this, "description");
    __publicField(this, "description_localizations");
    __publicField(this, "options", []);
    __publicField(this, "defaultPermission");
  }
  toJSON() {
    validateRequiredParameters3(this.name, this.description, this.options);
    return {
      name: this.name,
      name_localizations: this.name_localizations,
      description: this.description,
      description_localizations: this.description_localizations,
      options: this.options.map((option) => option.toJSON()),
      default_permission: this.defaultPermission
    };
  }
  setDefaultPermission(value) {
    validateDefaultPermission(value);
    Reflect.set(this, "defaultPermission", value);
    return this;
  }
  addSubcommandGroup(input) {
    const { options } = this;
    validateMaxOptionsLength(options);
    const result = typeof input === "function" ? input(new SlashCommandSubcommandGroupBuilder()) : input;
    assertReturnOfBuilder(result, SlashCommandSubcommandGroupBuilder);
    options.push(result);
    return this;
  }
  addSubcommand(input) {
    const { options } = this;
    validateMaxOptionsLength(options);
    const result = typeof input === "function" ? input(new SlashCommandSubcommandBuilder()) : input;
    assertReturnOfBuilder(result, SlashCommandSubcommandBuilder);
    options.push(result);
    return this;
  }
};
__name(SlashCommandBuilder, "SlashCommandBuilder");
SlashCommandBuilder = __decorateClass([
  (0, import_ts_mixer6.mix)(SharedSlashCommandOptions, SharedNameAndDescription)
], SlashCommandBuilder);

// src/interactions/contextMenuCommands/Assertions.ts
var Assertions_exports6 = {};
__export(Assertions_exports6, {
  validateDefaultPermission: () => validateDefaultPermission2,
  validateName: () => validateName2,
  validateRequiredParameters: () => validateRequiredParameters4,
  validateType: () => validateType
});
var import_shapeshift10 = require("@sapphire/shapeshift");
var import_v1021 = require("discord-api-types/v10");
var namePredicate2 = import_shapeshift10.s.string.lengthGe(1).lengthLe(32).regex(/^( *[\p{L}\p{N}\p{sc=Devanagari}\p{sc=Thai}_-]+ *)+$/u);
var typePredicate = import_shapeshift10.s.union(import_shapeshift10.s.literal(import_v1021.ApplicationCommandType.User), import_shapeshift10.s.literal(import_v1021.ApplicationCommandType.Message));
var booleanPredicate3 = import_shapeshift10.s.boolean;
function validateDefaultPermission2(value) {
  booleanPredicate3.parse(value);
}
__name(validateDefaultPermission2, "validateDefaultPermission");
function validateName2(name) {
  namePredicate2.parse(name);
}
__name(validateName2, "validateName");
function validateType(type) {
  typePredicate.parse(type);
}
__name(validateType, "validateType");
function validateRequiredParameters4(name, type) {
  validateName2(name);
  validateType(type);
}
__name(validateRequiredParameters4, "validateRequiredParameters");

// src/interactions/contextMenuCommands/ContextMenuCommandBuilder.ts
var ContextMenuCommandBuilder = class {
  constructor() {
    __publicField(this, "name");
    __publicField(this, "type");
    __publicField(this, "defaultPermission");
  }
  setName(name) {
    validateName2(name);
    Reflect.set(this, "name", name);
    return this;
  }
  setType(type) {
    validateType(type);
    Reflect.set(this, "type", type);
    return this;
  }
  setDefaultPermission(value) {
    validateDefaultPermission2(value);
    Reflect.set(this, "defaultPermission", value);
    return this;
  }
  toJSON() {
    validateRequiredParameters4(this.name, this.type);
    return {
      name: this.name,
      type: this.type,
      default_permission: this.defaultPermission
    };
  }
};
__name(ContextMenuCommandBuilder, "ContextMenuCommandBuilder");

// src/util/jsonEncodable.ts
function isJSONEncodable(maybeEncodable) {
  return maybeEncodable !== null && typeof maybeEncodable === "object" && "toJSON" in maybeEncodable;
}
__name(isJSONEncodable, "isJSONEncodable");

// src/util/equatable.ts
function isEquatable(maybeEquatable) {
  return maybeEquatable !== null && typeof maybeEquatable === "object" && "equals" in maybeEquatable;
}
__name(isEquatable, "isEquatable");

// src/util/componentUtil.ts
function embedLength(data) {
  return (data.title?.length ?? 0) + (data.description?.length ?? 0) + (data.fields?.reduce((prev, curr) => prev + curr.name.length + curr.value.length, 0) ?? 0) + (data.footer?.text.length ?? 0) + (data.author?.name.length ?? 0);
}
__name(embedLength, "embedLength");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ActionRowBuilder,
  ButtonBuilder,
  ComponentAssertions,
  ComponentBuilder,
  ContextMenuCommandAssertions,
  ContextMenuCommandBuilder,
  EmbedAssertions,
  EmbedBuilder,
  Faces,
  ModalAssertions,
  ModalBuilder,
  SelectMenuBuilder,
  SelectMenuOptionBuilder,
  SlashCommandAssertions,
  SlashCommandAttachmentOption,
  SlashCommandBooleanOption,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandIntegerOption,
  SlashCommandMentionableOption,
  SlashCommandNumberOption,
  SlashCommandRoleOption,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
  SlashCommandUserOption,
  TextInputAssertions,
  TextInputBuilder,
  TimestampStyles,
  UnsafeButtonBuilder,
  UnsafeEmbedBuilder,
  UnsafeModalBuilder,
  UnsafeSelectMenuBuilder,
  UnsafeSelectMenuOptionBuilder,
  UnsafeTextInputBuilder,
  blockQuote,
  bold,
  channelMention,
  codeBlock,
  createComponentBuilder,
  embedLength,
  formatEmoji,
  hideLinkEmbed,
  hyperlink,
  inlineCode,
  isEquatable,
  isJSONEncodable,
  italic,
  quote,
  roleMention,
  spoiler,
  strikethrough,
  time,
  underscore,
  userMention
});
//# sourceMappingURL=index.js.map