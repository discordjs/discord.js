import * as _sapphire_shapeshift from '@sapphire/shapeshift';
import { APIEmbedField, APIEmbedAuthor, APIEmbedFooter, APIEmbedImage, APIEmbed, APISelectMenuOption, APIMessageComponentEmoji, ButtonStyle, APIActionRowComponentTypes, APIActionRowComponent, APIBaseComponent, ComponentType, APIMessageActionRowComponent, APIModalActionRowComponent, APIButtonComponent, APIMessageComponent, APIModalComponent, APITextInputComponent, TextInputStyle, APIModalInteractionResponseCallbackData, APISelectMenuComponent, LocalizationMap, LocaleString, ApplicationCommandOptionType, APIApplicationCommandBasicOption, APIApplicationCommandAttachmentOption, APIApplicationCommandBooleanOption, ChannelType, APIApplicationCommandChannelOption, APIApplicationCommandOptionChoice, APIApplicationCommandIntegerOption, APIApplicationCommandMentionableOption, APIApplicationCommandNumberOption, APIApplicationCommandRoleOption, APIApplicationCommandStringOption, APIApplicationCommandUserOption, APIApplicationCommandSubcommandGroupOption, APIApplicationCommandSubcommandOption, RESTPostAPIApplicationCommandsJSONBody, APIApplicationCommandOption, Locale, ApplicationCommandType } from 'discord-api-types/v10';
import { URL } from 'url';
import { Snowflake } from 'discord-api-types/globals';

declare const fieldNamePredicate: _sapphire_shapeshift.StringValidator<string>;
declare const fieldValuePredicate: _sapphire_shapeshift.StringValidator<string>;
declare const fieldInlinePredicate: _sapphire_shapeshift.UnionValidator<boolean | undefined>;
declare const embedFieldPredicate: _sapphire_shapeshift.ObjectValidator<{
    name: string;
    value: string;
    inline: boolean | undefined;
}>;
declare const embedFieldsArrayPredicate: _sapphire_shapeshift.ArrayValidator<{
    name: string;
    value: string;
    inline: boolean | undefined;
}>;
declare const fieldLengthPredicate: _sapphire_shapeshift.NumberValidator<number>;
declare function validateFieldLength(amountAdding: number, fields?: APIEmbedField[]): void;
declare const authorNamePredicate: _sapphire_shapeshift.UnionValidator<string | null>;
declare const imageURLPredicate: _sapphire_shapeshift.UnionValidator<string | null | undefined>;
declare const urlPredicate: _sapphire_shapeshift.UnionValidator<string | null | undefined>;
declare const embedAuthorPredicate: _sapphire_shapeshift.ObjectValidator<{
    name: string | null;
    iconURL: string | null | undefined;
    url: string | null | undefined;
}>;
declare const RGBPredicate: _sapphire_shapeshift.NumberValidator<number>;
declare const colorPredicate: _sapphire_shapeshift.UnionValidator<number | [number, number, number] | null>;
declare const descriptionPredicate: _sapphire_shapeshift.UnionValidator<string | null>;
declare const footerTextPredicate: _sapphire_shapeshift.UnionValidator<string | null>;
declare const embedFooterPredicate: _sapphire_shapeshift.ObjectValidator<{
    text: string | null;
    iconURL: string | null | undefined;
}>;
declare const timestampPredicate: _sapphire_shapeshift.UnionValidator<number | Date | null>;
declare const titlePredicate: _sapphire_shapeshift.UnionValidator<string | null>;

declare const Assertions$5_fieldNamePredicate: typeof fieldNamePredicate;
declare const Assertions$5_fieldValuePredicate: typeof fieldValuePredicate;
declare const Assertions$5_fieldInlinePredicate: typeof fieldInlinePredicate;
declare const Assertions$5_embedFieldPredicate: typeof embedFieldPredicate;
declare const Assertions$5_embedFieldsArrayPredicate: typeof embedFieldsArrayPredicate;
declare const Assertions$5_fieldLengthPredicate: typeof fieldLengthPredicate;
declare const Assertions$5_validateFieldLength: typeof validateFieldLength;
declare const Assertions$5_authorNamePredicate: typeof authorNamePredicate;
declare const Assertions$5_imageURLPredicate: typeof imageURLPredicate;
declare const Assertions$5_urlPredicate: typeof urlPredicate;
declare const Assertions$5_embedAuthorPredicate: typeof embedAuthorPredicate;
declare const Assertions$5_RGBPredicate: typeof RGBPredicate;
declare const Assertions$5_colorPredicate: typeof colorPredicate;
declare const Assertions$5_descriptionPredicate: typeof descriptionPredicate;
declare const Assertions$5_footerTextPredicate: typeof footerTextPredicate;
declare const Assertions$5_embedFooterPredicate: typeof embedFooterPredicate;
declare const Assertions$5_timestampPredicate: typeof timestampPredicate;
declare const Assertions$5_titlePredicate: typeof titlePredicate;
declare namespace Assertions$5 {
  export {
    Assertions$5_fieldNamePredicate as fieldNamePredicate,
    Assertions$5_fieldValuePredicate as fieldValuePredicate,
    Assertions$5_fieldInlinePredicate as fieldInlinePredicate,
    Assertions$5_embedFieldPredicate as embedFieldPredicate,
    Assertions$5_embedFieldsArrayPredicate as embedFieldsArrayPredicate,
    Assertions$5_fieldLengthPredicate as fieldLengthPredicate,
    Assertions$5_validateFieldLength as validateFieldLength,
    Assertions$5_authorNamePredicate as authorNamePredicate,
    Assertions$5_imageURLPredicate as imageURLPredicate,
    Assertions$5_urlPredicate as urlPredicate,
    Assertions$5_embedAuthorPredicate as embedAuthorPredicate,
    Assertions$5_RGBPredicate as RGBPredicate,
    Assertions$5_colorPredicate as colorPredicate,
    Assertions$5_descriptionPredicate as descriptionPredicate,
    Assertions$5_footerTextPredicate as footerTextPredicate,
    Assertions$5_embedFooterPredicate as embedFooterPredicate,
    Assertions$5_timestampPredicate as timestampPredicate,
    Assertions$5_titlePredicate as titlePredicate,
  };
}

declare type RGBTuple = [red: number, green: number, blue: number];
interface IconData {
    /**
     * The URL of the icon
     */
    iconURL?: string;
    /**
     * The proxy URL of the icon
     */
    proxyIconURL?: string;
}
declare type EmbedAuthorData = Omit<APIEmbedAuthor, 'icon_url' | 'proxy_icon_url'> & IconData;
declare type EmbedAuthorOptions = Omit<EmbedAuthorData, 'proxyIconURL'>;
declare type EmbedFooterData = Omit<APIEmbedFooter, 'icon_url' | 'proxy_icon_url'> & IconData;
declare type EmbedFooterOptions = Omit<EmbedFooterData, 'proxyIconURL'>;
interface EmbedImageData extends Omit<APIEmbedImage, 'proxy_url'> {
    /**
     * The proxy URL for the image
     */
    proxyURL?: string;
}
/**
 * Represents a non-validated embed in a message (image/video preview, rich embed, etc.)
 */
declare class UnsafeEmbedBuilder {
    readonly data: APIEmbed;
    constructor(data?: APIEmbed);
    /**
     * Adds fields to the embed (max 25)
     *
     * @param fields The fields to add
     */
    addFields(fields: APIEmbedField[]): this;
    /**
     * Removes, replaces, or inserts fields in the embed (max 25)
     *
     * @param index The index to start at
     * @param deleteCount The number of fields to remove
     * @param fields The replacing field objects
     */
    spliceFields(index: number, deleteCount: number, ...fields: APIEmbedField[]): this;
    /**
     * Sets the embed's fields (max 25).
     * @param fields The fields to set
     */
    setFields(fields: APIEmbedField[]): this;
    /**
     * Sets the author of this embed
     *
     * @param options The options for the author
     */
    setAuthor(options: EmbedAuthorOptions | null): this;
    /**
     * Sets the color of this embed
     *
     * @param color The color of the embed
     */
    setColor(color: number | RGBTuple | null): this;
    /**
     * Sets the description of this embed
     *
     * @param description The description
     */
    setDescription(description: string | null): this;
    /**
     * Sets the footer of this embed
     *
     * @param options The options for the footer
     */
    setFooter(options: EmbedFooterOptions | null): this;
    /**
     * Sets the image of this embed
     *
     * @param url The URL of the image
     */
    setImage(url: string | null): this;
    /**
     * Sets the thumbnail of this embed
     *
     * @param url The URL of the thumbnail
     */
    setThumbnail(url: string | null): this;
    /**
     * Sets the timestamp of this embed
     *
     * @param timestamp The timestamp or date
     */
    setTimestamp(timestamp?: number | Date | null): this;
    /**
     * Sets the title of this embed
     *
     * @param title The title
     */
    setTitle(title: string | null): this;
    /**
     * Sets the URL of this embed
     *
     * @param url The URL
     */
    setURL(url: string | null): this;
    /**
     * Transforms the embed to a plain object
     */
    toJSON(): APIEmbed;
}

/**
 * Represents a validated embed in a message (image/video preview, rich embed, etc.)
 */
declare class EmbedBuilder extends UnsafeEmbedBuilder {
    addFields(fields: APIEmbedField[]): this;
    spliceFields(index: number, deleteCount: number, ...fields: APIEmbedField[]): this;
    setAuthor(options: EmbedAuthorOptions | null): this;
    setColor(color: number | RGBTuple | null): this;
    setDescription(description: string | null): this;
    setFooter(options: EmbedFooterOptions | null): this;
    setImage(url: string | null): this;
    setThumbnail(url: string | null): this;
    setTimestamp(timestamp?: number | Date | null): this;
    setTitle(title: string | null): this;
    setURL(url: string | null): this;
}

/**
 * Wraps the content inside a codeblock with no language
 *
 * @param content The content to wrap
 */
declare function codeBlock<C extends string>(content: C): `\`\`\`\n${C}\`\`\``;
/**
 * Wraps the content inside a codeblock with the specified language
 *
 * @param language The language for the codeblock
 * @param content The content to wrap
 */
declare function codeBlock<L extends string, C extends string>(language: L, content: C): `\`\`\`${L}\n${C}\`\`\``;
/**
 * Wraps the content inside \`backticks\`, which formats it as inline code
 *
 * @param content The content to wrap
 */
declare function inlineCode<C extends string>(content: C): `\`${C}\``;
/**
 * Formats the content into italic text
 *
 * @param content The content to wrap
 */
declare function italic<C extends string>(content: C): `_${C}_`;
/**
 * Formats the content into bold text
 *
 * @param content The content to wrap
 */
declare function bold<C extends string>(content: C): `**${C}**`;
/**
 * Formats the content into underscored text
 *
 * @param content The content to wrap
 */
declare function underscore<C extends string>(content: C): `__${C}__`;
/**
 * Formats the content into strike-through text
 *
 * @param content The content to wrap
 */
declare function strikethrough<C extends string>(content: C): `~~${C}~~`;
/**
 * Formats the content into a quote. This needs to be at the start of the line for Discord to format it
 *
 * @param content The content to wrap
 */
declare function quote<C extends string>(content: C): `> ${C}`;
/**
 * Formats the content into a block quote. This needs to be at the start of the line for Discord to format it
 *
 * @param content The content to wrap
 */
declare function blockQuote<C extends string>(content: C): `>>> ${C}`;
/**
 * Wraps the URL into `<>`, which stops it from embedding
 *
 * @param url The URL to wrap
 */
declare function hideLinkEmbed<C extends string>(url: C): `<${C}>`;
/**
 * Wraps the URL into `<>`, which stops it from embedding
 *
 * @param url The URL to wrap
 */
declare function hideLinkEmbed(url: URL): `<${string}>`;
/**
 * Formats the content and the URL into a masked URL
 *
 * @param content The content to display
 * @param url The URL the content links to
 */
declare function hyperlink<C extends string>(content: C, url: URL): `[${C}](${string})`;
/**
 * Formats the content and the URL into a masked URL
 *
 * @param content The content to display
 * @param url The URL the content links to
 */
declare function hyperlink<C extends string, U extends string>(content: C, url: U): `[${C}](${U})`;
/**
 * Formats the content and the URL into a masked URL
 *
 * @param content The content to display
 * @param url The URL the content links to
 * @param title The title shown when hovering on the masked link
 */
declare function hyperlink<C extends string, T extends string>(content: C, url: URL, title: T): `[${C}](${string} "${T}")`;
/**
 * Formats the content and the URL into a masked URL
 *
 * @param content The content to display
 * @param url The URL the content links to
 * @param title The title shown when hovering on the masked link
 */
declare function hyperlink<C extends string, U extends string, T extends string>(content: C, url: U, title: T): `[${C}](${U} "${T}")`;
/**
 * Wraps the content inside spoiler (hidden text)
 *
 * @param content The content to wrap
 */
declare function spoiler<C extends string>(content: C): `||${C}||`;
/**
 * Formats a user ID into a user mention
 *
 * @param userId The user ID to format
 */
declare function userMention<C extends Snowflake>(userId: C): `<@${C}>`;
/**
 * Formats a channel ID into a channel mention
 *
 * @param channelId The channel ID to format
 */
declare function channelMention<C extends Snowflake>(channelId: C): `<#${C}>`;
/**
 * Formats a role ID into a role mention
 *
 * @param roleId The role ID to format
 */
declare function roleMention<C extends Snowflake>(roleId: C): `<@&${C}>`;
/**
 * Formats an emoji ID into a fully qualified emoji identifier
 *
 * @param emojiId The emoji ID to format
 */
declare function formatEmoji<C extends Snowflake>(emojiId: C, animated?: false): `<:_:${C}>`;
/**
 * Formats an emoji ID into a fully qualified emoji identifier
 *
 * @param emojiId The emoji ID to format
 * @param animated Whether the emoji is animated or not. Defaults to `false`
 */
declare function formatEmoji<C extends Snowflake>(emojiId: C, animated?: true): `<a:_:${C}>`;
/**
 * Formats a date into a short date-time string
 *
 * @param date The date to format, defaults to the current time
 */
declare function time(date?: Date): `<t:${bigint}>`;
/**
 * Formats a date given a format style
 *
 * @param date The date to format
 * @param style The style to use
 */
declare function time<S extends TimestampStylesString>(date: Date, style: S): `<t:${bigint}:${S}>`;
/**
 * Formats the given timestamp into a short date-time string
 *
 * @param seconds The time to format, represents an UNIX timestamp in seconds
 */
declare function time<C extends number>(seconds: C): `<t:${C}>`;
/**
 * Formats the given timestamp into a short date-time string
 *
 * @param seconds The time to format, represents an UNIX timestamp in seconds
 * @param style The style to use
 */
declare function time<C extends number, S extends TimestampStylesString>(seconds: C, style: S): `<t:${C}:${S}>`;
/**
 * The [message formatting timestamp styles](https://discord.com/developers/docs/reference#message-formatting-timestamp-styles) supported by Discord
 */
declare const TimestampStyles: {
    /**
     * Short time format, consisting of hours and minutes, e.g. 16:20
     */
    readonly ShortTime: "t";
    /**
     * Long time format, consisting of hours, minutes, and seconds, e.g. 16:20:30
     */
    readonly LongTime: "T";
    /**
     * Short date format, consisting of day, month, and year, e.g. 20/04/2021
     */
    readonly ShortDate: "d";
    /**
     * Long date format, consisting of day, month, and year, e.g. 20 April 2021
     */
    readonly LongDate: "D";
    /**
     * Short date-time format, consisting of short date and short time formats, e.g. 20 April 2021 16:20
     */
    readonly ShortDateTime: "f";
    /**
     * Long date-time format, consisting of long date and short time formats, e.g. Tuesday, 20 April 2021 16:20
     */
    readonly LongDateTime: "F";
    /**
     * Relative time format, consisting of a relative duration format, e.g. 2 months ago
     */
    readonly RelativeTime: "R";
};
/**
 * The possible values, see {@link TimestampStyles} for more information
 */
declare type TimestampStylesString = typeof TimestampStyles[keyof typeof TimestampStyles];
/**
 * An enum with all the available faces from Discord's native slash commands
 */
declare enum Faces {
    /**
     * ¯\\_(ツ)\\_/¯
     */
    Shrug = "\u00AF\\_(\u30C4)\\_/\u00AF",
    /**
     * (╯°□°）╯︵ ┻━┻
     */
    Tableflip = "(\u256F\u00B0\u25A1\u00B0\uFF09\u256F\uFE35 \u253B\u2501\u253B",
    /**
     * ┬─┬ ノ( ゜-゜ノ)
     */
    Unflip = "\u252C\u2500\u252C \u30CE( \u309C-\u309C\u30CE)"
}

/**
 * Represents a non-validated option within a select menu component
 */
declare class UnsafeSelectMenuOptionBuilder {
    data: Partial<APISelectMenuOption>;
    constructor(data?: Partial<APISelectMenuOption>);
    /**
     * Sets the label of this option
     * @param label The label to show on this option
     */
    setLabel(label: string): this;
    /**
     * Sets the value of this option
     * @param value The value of this option
     */
    setValue(value: string): this;
    /**
     * Sets the description of this option.
     * @param description The description of this option
     */
    setDescription(description: string): this;
    /**
     * Sets whether this option is selected by default
     * @param isDefault Whether this option is selected by default
     */
    setDefault(isDefault?: boolean): this;
    /**
     * Sets the emoji to display on this option
     * @param emoji The emoji to display on this option
     */
    setEmoji(emoji: APIMessageComponentEmoji): this;
    toJSON(): APISelectMenuOption;
}

/**
 * Represents a validated option within a select menu component
 */
declare class SelectMenuOptionBuilder extends UnsafeSelectMenuOptionBuilder {
    setDescription(description: string): this;
    setDefault(isDefault?: boolean): this;
    setEmoji(emoji: APIMessageComponentEmoji): this;
    toJSON(): APISelectMenuOption;
}

declare const customIdValidator: _sapphire_shapeshift.StringValidator<string>;
declare const emojiValidator: _sapphire_shapeshift.ObjectValidator<{
    id: string;
    name: string;
    animated: boolean;
}>;
declare const disabledValidator: _sapphire_shapeshift.BooleanValidator<boolean>;
declare const buttonLabelValidator: _sapphire_shapeshift.StringValidator<string>;
declare const buttonStyleValidator: _sapphire_shapeshift.NativeEnumValidator<typeof ButtonStyle>;
declare const placeholderValidator$1: _sapphire_shapeshift.StringValidator<string>;
declare const minMaxValidator: _sapphire_shapeshift.NumberValidator<number>;
declare const labelValueDescriptionValidator: _sapphire_shapeshift.StringValidator<string>;
declare const optionValidator: _sapphire_shapeshift.UnionValidator<UnsafeSelectMenuOptionBuilder | {
    label: string;
    value: string;
    description: string | undefined;
    emoji: {
        id: string;
        name: string;
        animated: boolean;
    } | undefined;
    default: boolean | undefined;
}>;
declare const optionsValidator: _sapphire_shapeshift.BaseValidator<(UnsafeSelectMenuOptionBuilder | {
    label: string;
    value: string;
    description: string | undefined;
    emoji: {
        id: string;
        name: string;
        animated: boolean;
    } | undefined;
    default: boolean | undefined;
})[]>;
declare const optionsLengthValidator: _sapphire_shapeshift.NumberValidator<number>;
declare function validateRequiredSelectMenuParameters(options: SelectMenuOptionBuilder[], customId?: string): void;
declare const labelValueValidator: _sapphire_shapeshift.StringValidator<string>;
declare const defaultValidator: _sapphire_shapeshift.BooleanValidator<boolean>;
declare function validateRequiredSelectMenuOptionParameters(label?: string, value?: string): void;
declare const urlValidator: _sapphire_shapeshift.StringValidator<string>;
declare function validateRequiredButtonParameters(style?: ButtonStyle, label?: string, emoji?: APIMessageComponentEmoji, customId?: string, url?: string): void;

declare const Assertions$4_customIdValidator: typeof customIdValidator;
declare const Assertions$4_emojiValidator: typeof emojiValidator;
declare const Assertions$4_disabledValidator: typeof disabledValidator;
declare const Assertions$4_buttonLabelValidator: typeof buttonLabelValidator;
declare const Assertions$4_buttonStyleValidator: typeof buttonStyleValidator;
declare const Assertions$4_minMaxValidator: typeof minMaxValidator;
declare const Assertions$4_labelValueDescriptionValidator: typeof labelValueDescriptionValidator;
declare const Assertions$4_optionValidator: typeof optionValidator;
declare const Assertions$4_optionsValidator: typeof optionsValidator;
declare const Assertions$4_optionsLengthValidator: typeof optionsLengthValidator;
declare const Assertions$4_validateRequiredSelectMenuParameters: typeof validateRequiredSelectMenuParameters;
declare const Assertions$4_labelValueValidator: typeof labelValueValidator;
declare const Assertions$4_defaultValidator: typeof defaultValidator;
declare const Assertions$4_validateRequiredSelectMenuOptionParameters: typeof validateRequiredSelectMenuOptionParameters;
declare const Assertions$4_urlValidator: typeof urlValidator;
declare const Assertions$4_validateRequiredButtonParameters: typeof validateRequiredButtonParameters;
declare namespace Assertions$4 {
  export {
    Assertions$4_customIdValidator as customIdValidator,
    Assertions$4_emojiValidator as emojiValidator,
    Assertions$4_disabledValidator as disabledValidator,
    Assertions$4_buttonLabelValidator as buttonLabelValidator,
    Assertions$4_buttonStyleValidator as buttonStyleValidator,
    placeholderValidator$1 as placeholderValidator,
    Assertions$4_minMaxValidator as minMaxValidator,
    Assertions$4_labelValueDescriptionValidator as labelValueDescriptionValidator,
    Assertions$4_optionValidator as optionValidator,
    Assertions$4_optionsValidator as optionsValidator,
    Assertions$4_optionsLengthValidator as optionsLengthValidator,
    Assertions$4_validateRequiredSelectMenuParameters as validateRequiredSelectMenuParameters,
    Assertions$4_labelValueValidator as labelValueValidator,
    Assertions$4_defaultValidator as defaultValidator,
    Assertions$4_validateRequiredSelectMenuOptionParameters as validateRequiredSelectMenuOptionParameters,
    Assertions$4_urlValidator as urlValidator,
    Assertions$4_validateRequiredButtonParameters as validateRequiredButtonParameters,
  };
}

interface JSONEncodable<T> {
    /**
     * Transforms this object to its JSON format
     */
    toJSON: () => T;
}
/**
 * Indicates if an object is encodable or not.
 * @param maybeEncodable The object to check against
 */
declare function isJSONEncodable(maybeEncodable: unknown): maybeEncodable is JSONEncodable<unknown>;

declare type AnyAPIActionRowComponent = APIActionRowComponentTypes | APIActionRowComponent<APIActionRowComponentTypes>;
/**
 * Represents a discord component
 */
declare abstract class ComponentBuilder<DataType extends Partial<APIBaseComponent<ComponentType>> = APIBaseComponent<ComponentType>> implements JSONEncodable<AnyAPIActionRowComponent> {
    /**
     * The API data associated with this component
     */
    readonly data: Partial<DataType>;
    abstract toJSON(): AnyAPIActionRowComponent;
    constructor(data: Partial<DataType>);
}

declare type MessageComponentBuilder = MessageActionRowComponentBuilder | ActionRowBuilder<MessageActionRowComponentBuilder>;
declare type ModalComponentBuilder = ModalActionRowComponentBuilder | ActionRowBuilder<ModalActionRowComponentBuilder>;
declare type MessageActionRowComponentBuilder = ButtonBuilder | SelectMenuBuilder;
declare type ModalActionRowComponentBuilder = TextInputBuilder;
declare type AnyComponentBuilder = MessageActionRowComponentBuilder | ModalActionRowComponentBuilder;
/**
 * Represents an action row component
 */
declare class ActionRowBuilder<T extends AnyComponentBuilder> extends ComponentBuilder<APIActionRowComponent<APIMessageActionRowComponent | APIModalActionRowComponent>> {
    /**
     * The components within this action row
     */
    readonly components: T[];
    constructor({ components, ...data }?: Partial<APIActionRowComponent<APIActionRowComponentTypes>>);
    /**
     * Adds components to this action row.
     * @param components The components to add to this action row.
     * @returns
     */
    addComponents(components: T[]): this;
    /**
     * Sets the components in this action row
     * @param components The components to set this row to
     */
    setComponents(components: T[]): this;
    toJSON(): APIActionRowComponent<ReturnType<T['toJSON']>>;
}

/**
 * Represents a non-validated button component
 */
declare class UnsafeButtonBuilder extends ComponentBuilder<APIButtonComponent> {
    constructor(data?: Partial<APIButtonComponent>);
    /**
     * Sets the style of this button
     * @param style The style of the button
     */
    setStyle(style: ButtonStyle): this;
    /**
     * Sets the URL for this button
     * @param url The URL to open when this button is clicked
     */
    setURL(url: string): this;
    /**
     * Sets the custom Id for this button
     * @param customId The custom id to use for this button
     */
    setCustomId(customId: string): this;
    /**
     * Sets the emoji to display on this button
     * @param emoji The emoji to display on this button
     */
    setEmoji(emoji: APIMessageComponentEmoji): this;
    /**
     * Sets whether this button is disable or not
     * @param disabled Whether or not to disable this button or not
     */
    setDisabled(disabled?: boolean): this;
    /**
     * Sets the label for this button
     * @param label The label to display on this button
     */
    setLabel(label: string): this;
    toJSON(): APIButtonComponent;
}

/**
 * Represents a validated button component
 */
declare class ButtonBuilder extends UnsafeButtonBuilder {
    setStyle(style: ButtonStyle): this;
    setURL(url: string): this;
    setCustomId(customId: string): this;
    setEmoji(emoji: APIMessageComponentEmoji): this;
    setDisabled(disabled?: boolean): this;
    setLabel(label: string): this;
    toJSON(): APIButtonComponent;
}

interface MappedComponentTypes {
    [ComponentType.ActionRow]: ActionRowBuilder<AnyComponentBuilder>;
    [ComponentType.Button]: ButtonBuilder;
    [ComponentType.SelectMenu]: SelectMenuBuilder;
    [ComponentType.TextInput]: TextInputBuilder;
}
/**
 * Factory for creating components from API data
 * @param data The api data to transform to a component class
 */
declare function createComponentBuilder<T extends keyof MappedComponentTypes>(data: (APIMessageComponent | APIModalComponent) & {
    type: T;
}): MappedComponentTypes[T];
declare function createComponentBuilder<C extends MessageComponentBuilder | ModalComponentBuilder>(data: C): C;

declare class UnsafeTextInputBuilder extends ComponentBuilder<APITextInputComponent> {
    constructor(data?: APITextInputComponent & {
        type?: ComponentType.TextInput;
    });
    /**
     * Sets the custom id for this text input
     * @param customId The custom id of this text input
     */
    setCustomId(customId: string): this;
    /**
     * Sets the label for this text input
     * @param label The label for this text input
     */
    setLabel(label: string): this;
    /**
     * Sets the style for this text input
     * @param style The style for this text input
     */
    setStyle(style: TextInputStyle): this;
    /**
     * Sets the minimum length of text for this text input
     * @param minLength The minimum length of text for this text input
     */
    setMinLength(minLength: number): this;
    /**
     * Sets the maximum length of text for this text input
     * @param maxLength The maximum length of text for this text input
     */
    setMaxLength(maxLength: number): this;
    /**
     * Sets the placeholder of this text input
     * @param placeholder The placeholder of this text input
     */
    setPlaceholder(placeholder: string): this;
    /**
     * Sets the value of this text input
     * @param value The value for this text input
     */
    setValue(value: string): this;
    /**
     * Sets whether this text input is required or not
     * @param required Whether this text input is required or not
     */
    setRequired(required?: boolean): this;
    toJSON(): APITextInputComponent;
    equals(other: UnsafeTextInputBuilder | APITextInputComponent): boolean;
}

declare class TextInputBuilder extends UnsafeTextInputBuilder {
    setMinLength(minLength: number): this;
    setMaxLength(maxLength: number): this;
    setRequired(required?: boolean): this;
    setValue(value: string): this;
    setPlaceholder(placeholder: string): this;
    toJSON(): APITextInputComponent;
}

declare const textInputStyleValidator: _sapphire_shapeshift.NativeEnumValidator<typeof TextInputStyle>;
declare const minLengthValidator: _sapphire_shapeshift.NumberValidator<number>;
declare const maxLengthValidator: _sapphire_shapeshift.NumberValidator<number>;
declare const requiredValidator: _sapphire_shapeshift.BooleanValidator<boolean>;
declare const valueValidator: _sapphire_shapeshift.StringValidator<string>;
declare const placeholderValidator: _sapphire_shapeshift.StringValidator<string>;
declare const labelValidator: _sapphire_shapeshift.StringValidator<string>;
declare function validateRequiredParameters$3(customId?: string, style?: TextInputStyle, label?: string): void;

declare const Assertions$3_textInputStyleValidator: typeof textInputStyleValidator;
declare const Assertions$3_minLengthValidator: typeof minLengthValidator;
declare const Assertions$3_maxLengthValidator: typeof maxLengthValidator;
declare const Assertions$3_requiredValidator: typeof requiredValidator;
declare const Assertions$3_valueValidator: typeof valueValidator;
declare const Assertions$3_placeholderValidator: typeof placeholderValidator;
declare const Assertions$3_labelValidator: typeof labelValidator;
declare namespace Assertions$3 {
  export {
    Assertions$3_textInputStyleValidator as textInputStyleValidator,
    Assertions$3_minLengthValidator as minLengthValidator,
    Assertions$3_maxLengthValidator as maxLengthValidator,
    Assertions$3_requiredValidator as requiredValidator,
    Assertions$3_valueValidator as valueValidator,
    Assertions$3_placeholderValidator as placeholderValidator,
    Assertions$3_labelValidator as labelValidator,
    validateRequiredParameters$3 as validateRequiredParameters,
  };
}

declare class UnsafeModalBuilder implements JSONEncodable<APIModalInteractionResponseCallbackData> {
    readonly data: Partial<APIModalInteractionResponseCallbackData>;
    readonly components: ActionRowBuilder<ModalActionRowComponentBuilder>[];
    constructor({ components, ...data }?: Partial<APIModalInteractionResponseCallbackData>);
    /**
     * Sets the title of the modal
     * @param title The title of the modal
     */
    setTitle(title: string): this;
    /**
     * Sets the custom id of the modal
     * @param customId The custom id of this modal
     */
    setCustomId(customId: string): this;
    /**
     * Adds components to this modal
     * @param components The components to add to this modal
     */
    addComponents(components: (ActionRowBuilder<ModalActionRowComponentBuilder> | APIActionRowComponent<APIModalActionRowComponent>)[]): this;
    /**
     * Sets the components in this modal
     * @param components The components to set this modal to
     */
    setComponents(components: ActionRowBuilder<ModalActionRowComponentBuilder>[]): this;
    toJSON(): APIModalInteractionResponseCallbackData;
}

declare class ModalBuilder extends UnsafeModalBuilder {
    setCustomId(customId: string): this;
    setTitle(title: string): this;
    toJSON(): APIModalInteractionResponseCallbackData;
}

declare const titleValidator: _sapphire_shapeshift.StringValidator<string>;
declare const componentsValidator: _sapphire_shapeshift.BaseValidator<[ActionRowBuilder<AnyComponentBuilder>, ...ActionRowBuilder<AnyComponentBuilder>[]]>;
declare function validateRequiredParameters$2(customId?: string, title?: string, components?: ActionRowBuilder<ModalActionRowComponentBuilder>[]): void;

declare const Assertions$2_titleValidator: typeof titleValidator;
declare const Assertions$2_componentsValidator: typeof componentsValidator;
declare namespace Assertions$2 {
  export {
    Assertions$2_titleValidator as titleValidator,
    Assertions$2_componentsValidator as componentsValidator,
    validateRequiredParameters$2 as validateRequiredParameters,
  };
}

/**
 * Represents a non-validated select menu component
 */
declare class UnsafeSelectMenuBuilder extends ComponentBuilder<APISelectMenuComponent> {
    /**
     * The options within this select menu
     */
    readonly options: UnsafeSelectMenuOptionBuilder[];
    constructor(data?: Partial<APISelectMenuComponent>);
    /**
     * Sets the placeholder for this select menu
     * @param placeholder The placeholder to use for this select menu
     */
    setPlaceholder(placeholder: string): this;
    /**
     * Sets the minimum values that must be selected in the select menu
     * @param minValues The minimum values that must be selected
     */
    setMinValues(minValues: number): this;
    /**
     * Sets the maximum values that must be selected in the select menu
     * @param minValues The maximum values that must be selected
     */
    setMaxValues(maxValues: number): this;
    /**
     * Sets the custom Id for this select menu
     * @param customId The custom id to use for this select menu
     */
    setCustomId(customId: string): this;
    /**
     * Sets whether or not this select menu is disabled
     * @param disabled Whether or not this select menu is disabled
     */
    setDisabled(disabled?: boolean): this;
    /**
     * Adds options to this select menu
     * @param options The options to add to this select menu
     * @returns
     */
    addOptions(options: (UnsafeSelectMenuOptionBuilder | APISelectMenuOption)[]): this;
    /**
     * Sets the options on this select menu
     * @param options The options to set on this select menu
     */
    setOptions(options: (UnsafeSelectMenuOptionBuilder | APISelectMenuOption)[]): this;
    toJSON(): APISelectMenuComponent;
}

/**
 * Represents a validated select menu component
 */
declare class SelectMenuBuilder extends UnsafeSelectMenuBuilder {
    setPlaceholder(placeholder: string): this;
    setMinValues(minValues: number): this;
    setMaxValues(maxValues: number): this;
    setCustomId(customId: string): this;
    setDisabled(disabled?: boolean): this;
    addOptions(options: (UnsafeSelectMenuOptionBuilder | APISelectMenuOption)[]): this;
    setOptions(options: (UnsafeSelectMenuOptionBuilder | APISelectMenuOption)[]): this;
    toJSON(): APISelectMenuComponent;
}

declare class SharedNameAndDescription {
    readonly name: string;
    readonly name_localizations?: LocalizationMap;
    readonly description: string;
    readonly description_localizations?: LocalizationMap;
    /**
     * Sets the name
     *
     * @param name The name
     */
    setName(name: string): this;
    /**
     * Sets the description
     *
     * @param description The description
     */
    setDescription(description: string): this;
    /**
     * Sets a name localization
     *
     * @param locale The locale to set a description for
     * @param localizedName The localized description for the given locale
     */
    setNameLocalization(locale: LocaleString, localizedName: string | null): this;
    /**
     * Sets the name localizations
     *
     * @param localizedNames The dictionary of localized descriptions to set
     */
    setNameLocalizations(localizedNames: LocalizationMap | null): this;
    /**
     * Sets a description localization
     *
     * @param locale The locale to set a description for
     * @param localizedDescription The localized description for the given locale
     */
    setDescriptionLocalization(locale: LocaleString, localizedDescription: string | null): this;
    /**
     * Sets the description localizations
     *
     * @param localizedDescriptions The dictionary of localized descriptions to set
     */
    setDescriptionLocalizations(localizedDescriptions: LocalizationMap | null): this;
}

declare abstract class ApplicationCommandOptionBase extends SharedNameAndDescription {
    abstract readonly type: ApplicationCommandOptionType;
    readonly required: boolean;
    /**
     * Marks the option as required
     *
     * @param required If this option should be required
     */
    setRequired(required: boolean): this;
    abstract toJSON(): APIApplicationCommandBasicOption;
    protected runRequiredValidations(): void;
}

declare class SlashCommandAttachmentOption extends ApplicationCommandOptionBase {
    readonly type: ApplicationCommandOptionType.Attachment;
    toJSON(): APIApplicationCommandAttachmentOption;
}

declare class SlashCommandBooleanOption extends ApplicationCommandOptionBase {
    readonly type: ApplicationCommandOptionType.Boolean;
    toJSON(): APIApplicationCommandBooleanOption;
}

declare const allowedChannelTypes: readonly [ChannelType.GuildText, ChannelType.GuildVoice, ChannelType.GuildCategory, ChannelType.GuildNews, ChannelType.GuildNewsThread, ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread, ChannelType.GuildStageVoice];
declare type ApplicationCommandOptionAllowedChannelTypes = typeof allowedChannelTypes[number];
declare class ApplicationCommandOptionChannelTypesMixin {
    readonly channel_types?: ApplicationCommandOptionAllowedChannelTypes[];
    /**
     * Adds channel types to this option
     *
     * @param channelTypes The channel types to add
     */
    addChannelTypes(...channelTypes: ApplicationCommandOptionAllowedChannelTypes[]): this;
}

declare class SlashCommandChannelOption extends ApplicationCommandOptionBase {
    readonly type: ApplicationCommandOptionType.Channel;
    toJSON(): APIApplicationCommandChannelOption;
}
interface SlashCommandChannelOption extends ApplicationCommandOptionChannelTypesMixin {
}

declare abstract class ApplicationCommandNumericOptionMinMaxValueMixin {
    readonly max_value?: number;
    readonly min_value?: number;
    /**
     * Sets the maximum number value of this option
     * @param max The maximum value this option can be
     */
    abstract setMaxValue(max: number): this;
    /**
     * Sets the minimum number value of this option
     * @param min The minimum value this option can be
     */
    abstract setMinValue(min: number): this;
}

declare class ApplicationCommandOptionWithChoicesAndAutocompleteMixin<T extends string | number> {
    readonly choices?: APIApplicationCommandOptionChoice<T>[];
    readonly autocomplete?: boolean;
    readonly type: ApplicationCommandOptionType;
    /**
     * Adds multiple choices for this option
     *
     * @param choices The choices to add
     */
    addChoices(...choices: APIApplicationCommandOptionChoice<T>[]): this;
    setChoices<Input extends APIApplicationCommandOptionChoice<T>[]>(...choices: Input): this;
    /**
     * Marks the option as autocompletable
     * @param autocomplete If this option should be autocompletable
     */
    setAutocomplete(autocomplete: boolean): this;
}

declare class SlashCommandIntegerOption extends ApplicationCommandOptionBase implements ApplicationCommandNumericOptionMinMaxValueMixin {
    readonly type: ApplicationCommandOptionType.Integer;
    setMaxValue(max: number): this;
    setMinValue(min: number): this;
    toJSON(): APIApplicationCommandIntegerOption;
}
interface SlashCommandIntegerOption extends ApplicationCommandNumericOptionMinMaxValueMixin, ApplicationCommandOptionWithChoicesAndAutocompleteMixin<number> {
}

declare class SlashCommandMentionableOption extends ApplicationCommandOptionBase {
    readonly type: ApplicationCommandOptionType.Mentionable;
    toJSON(): APIApplicationCommandMentionableOption;
}

declare class SlashCommandNumberOption extends ApplicationCommandOptionBase implements ApplicationCommandNumericOptionMinMaxValueMixin {
    readonly type: ApplicationCommandOptionType.Number;
    setMaxValue(max: number): this;
    setMinValue(min: number): this;
    toJSON(): APIApplicationCommandNumberOption;
}
interface SlashCommandNumberOption extends ApplicationCommandNumericOptionMinMaxValueMixin, ApplicationCommandOptionWithChoicesAndAutocompleteMixin<number> {
}

declare class SlashCommandRoleOption extends ApplicationCommandOptionBase {
    readonly type: ApplicationCommandOptionType.Role;
    toJSON(): APIApplicationCommandRoleOption;
}

declare class SlashCommandStringOption extends ApplicationCommandOptionBase {
    readonly type: ApplicationCommandOptionType.String;
    toJSON(): APIApplicationCommandStringOption;
}
interface SlashCommandStringOption extends ApplicationCommandOptionWithChoicesAndAutocompleteMixin<string> {
}

declare class SlashCommandUserOption extends ApplicationCommandOptionBase {
    readonly type: ApplicationCommandOptionType.User;
    toJSON(): APIApplicationCommandUserOption;
}

declare class SharedSlashCommandOptions<ShouldOmitSubcommandFunctions = true> {
    readonly options: ToAPIApplicationCommandOptions[];
    /**
     * Adds a boolean option
     *
     * @param input A function that returns an option builder, or an already built builder
     */
    addBooleanOption(input: SlashCommandBooleanOption | ((builder: SlashCommandBooleanOption) => SlashCommandBooleanOption)): ShouldOmitSubcommandFunctions extends true ? Omit<this, "addSubcommand" | "addSubcommandGroup"> : this;
    /**
     * Adds a user option
     *
     * @param input A function that returns an option builder, or an already built builder
     */
    addUserOption(input: SlashCommandUserOption | ((builder: SlashCommandUserOption) => SlashCommandUserOption)): ShouldOmitSubcommandFunctions extends true ? Omit<this, "addSubcommand" | "addSubcommandGroup"> : this;
    /**
     * Adds a channel option
     *
     * @param input A function that returns an option builder, or an already built builder
     */
    addChannelOption(input: SlashCommandChannelOption | ((builder: SlashCommandChannelOption) => SlashCommandChannelOption)): ShouldOmitSubcommandFunctions extends true ? Omit<this, "addSubcommand" | "addSubcommandGroup"> : this;
    /**
     * Adds a role option
     *
     * @param input A function that returns an option builder, or an already built builder
     */
    addRoleOption(input: SlashCommandRoleOption | ((builder: SlashCommandRoleOption) => SlashCommandRoleOption)): ShouldOmitSubcommandFunctions extends true ? Omit<this, "addSubcommand" | "addSubcommandGroup"> : this;
    /**
     * Adds an attachment option
     *
     * @param input A function that returns an option builder, or an already built builder
     */
    addAttachmentOption(input: SlashCommandAttachmentOption | ((builder: SlashCommandAttachmentOption) => SlashCommandAttachmentOption)): ShouldOmitSubcommandFunctions extends true ? Omit<this, "addSubcommand" | "addSubcommandGroup"> : this;
    /**
     * Adds a mentionable option
     *
     * @param input A function that returns an option builder, or an already built builder
     */
    addMentionableOption(input: SlashCommandMentionableOption | ((builder: SlashCommandMentionableOption) => SlashCommandMentionableOption)): ShouldOmitSubcommandFunctions extends true ? Omit<this, "addSubcommand" | "addSubcommandGroup"> : this;
    /**
     * Adds a string option
     *
     * @param input A function that returns an option builder, or an already built builder
     */
    addStringOption(input: SlashCommandStringOption | Omit<SlashCommandStringOption, 'setAutocomplete'> | Omit<SlashCommandStringOption, 'addChoices'> | ((builder: SlashCommandStringOption) => SlashCommandStringOption | Omit<SlashCommandStringOption, 'setAutocomplete'> | Omit<SlashCommandStringOption, 'addChoices'>)): ShouldOmitSubcommandFunctions extends true ? Omit<this, "addSubcommand" | "addSubcommandGroup"> : this;
    /**
     * Adds an integer option
     *
     * @param input A function that returns an option builder, or an already built builder
     */
    addIntegerOption(input: SlashCommandIntegerOption | Omit<SlashCommandIntegerOption, 'setAutocomplete'> | Omit<SlashCommandIntegerOption, 'addChoices'> | ((builder: SlashCommandIntegerOption) => SlashCommandIntegerOption | Omit<SlashCommandIntegerOption, 'setAutocomplete'> | Omit<SlashCommandIntegerOption, 'addChoices'>)): ShouldOmitSubcommandFunctions extends true ? Omit<this, "addSubcommand" | "addSubcommandGroup"> : this;
    /**
     * Adds a number option
     *
     * @param input A function that returns an option builder, or an already built builder
     */
    addNumberOption(input: SlashCommandNumberOption | Omit<SlashCommandNumberOption, 'setAutocomplete'> | Omit<SlashCommandNumberOption, 'addChoices'> | ((builder: SlashCommandNumberOption) => SlashCommandNumberOption | Omit<SlashCommandNumberOption, 'setAutocomplete'> | Omit<SlashCommandNumberOption, 'addChoices'>)): ShouldOmitSubcommandFunctions extends true ? Omit<this, "addSubcommand" | "addSubcommandGroup"> : this;
    private _sharedAddOptionMethod;
}

/**
 * Represents a folder for subcommands
 *
 * For more information, go to https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups
 */
declare class SlashCommandSubcommandGroupBuilder implements ToAPIApplicationCommandOptions {
    /**
     * The name of this subcommand group
     */
    readonly name: string;
    /**
     * The description of this subcommand group
     */
    readonly description: string;
    /**
     * The subcommands part of this subcommand group
     */
    readonly options: SlashCommandSubcommandBuilder[];
    /**
     * Adds a new subcommand to this group
     *
     * @param input A function that returns a subcommand builder, or an already built builder
     */
    addSubcommand(input: SlashCommandSubcommandBuilder | ((subcommandGroup: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder)): this;
    toJSON(): APIApplicationCommandSubcommandGroupOption;
}
interface SlashCommandSubcommandGroupBuilder extends SharedNameAndDescription {
}
/**
 * Represents a subcommand
 *
 * For more information, go to https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups
 */
declare class SlashCommandSubcommandBuilder implements ToAPIApplicationCommandOptions {
    /**
     * The name of this subcommand
     */
    readonly name: string;
    /**
     * The description of this subcommand
     */
    readonly description: string;
    /**
     * The options of this subcommand
     */
    readonly options: ApplicationCommandOptionBase[];
    toJSON(): APIApplicationCommandSubcommandOption;
}
interface SlashCommandSubcommandBuilder extends SharedNameAndDescription, SharedSlashCommandOptions<false> {
}

declare class SlashCommandBuilder {
    /**
     * The name of this slash command
     */
    readonly name: string;
    /**
     * The localized names for this command
     */
    readonly name_localizations?: LocalizationMap;
    /**
     * The description of this slash command
     */
    readonly description: string;
    /**
     * The localized descriptions for this command
     */
    readonly description_localizations?: LocalizationMap;
    /**
     * The options of this slash command
     */
    readonly options: ToAPIApplicationCommandOptions[];
    /**
     * Whether the command is enabled by default when the app is added to a guild
     *
     * @default true
     */
    readonly defaultPermission: boolean | undefined;
    /**
     * Returns the final data that should be sent to Discord.
     *
     * **Note:** Calling this function will validate required properties based on their conditions.
     */
    toJSON(): RESTPostAPIApplicationCommandsJSONBody;
    /**
     * Sets whether the command is enabled by default when the application is added to a guild.
     *
     * **Note**: If set to `false`, you will have to later `PUT` the permissions for this command.
     *
     * @param value Whether or not to enable this command by default
     *
     * @see https://discord.com/developers/docs/interactions/application-commands#permissions
     */
    setDefaultPermission(value: boolean): this;
    /**
     * Adds a new subcommand group to this command
     *
     * @param input A function that returns a subcommand group builder, or an already built builder
     */
    addSubcommandGroup(input: SlashCommandSubcommandGroupBuilder | ((subcommandGroup: SlashCommandSubcommandGroupBuilder) => SlashCommandSubcommandGroupBuilder)): SlashCommandSubcommandsOnlyBuilder;
    /**
     * Adds a new subcommand to this command
     *
     * @param input A function that returns a subcommand builder, or an already built builder
     */
    addSubcommand(input: SlashCommandSubcommandBuilder | ((subcommandGroup: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder)): SlashCommandSubcommandsOnlyBuilder;
}
interface SlashCommandBuilder extends SharedNameAndDescription, SharedSlashCommandOptions {
}
interface SlashCommandSubcommandsOnlyBuilder extends SharedNameAndDescription, Pick<SlashCommandBuilder, 'toJSON' | 'addSubcommand' | 'addSubcommandGroup'> {
}
interface SlashCommandOptionsOnlyBuilder extends SharedNameAndDescription, SharedSlashCommandOptions, Pick<SlashCommandBuilder, 'toJSON'> {
}
interface ToAPIApplicationCommandOptions {
    toJSON: () => APIApplicationCommandOption;
}

declare function validateName$1(name: unknown): asserts name is string;
declare function validateDescription(description: unknown): asserts description is string;
declare function validateLocale(locale: unknown): Locale;
declare function validateMaxOptionsLength(options: unknown): asserts options is ToAPIApplicationCommandOptions[];
declare function validateRequiredParameters$1(name: string, description: string, options: ToAPIApplicationCommandOptions[]): void;
declare function validateDefaultPermission$1(value: unknown): asserts value is boolean;
declare function validateRequired(required: unknown): asserts required is boolean;
declare function validateChoicesLength(amountAdding: number, choices?: APIApplicationCommandOptionChoice[]): void;
declare function assertReturnOfBuilder<T extends ApplicationCommandOptionBase | SlashCommandSubcommandBuilder | SlashCommandSubcommandGroupBuilder>(input: unknown, ExpectedInstanceOf: new () => T): asserts input is T;

declare const Assertions$1_validateDescription: typeof validateDescription;
declare const Assertions$1_validateLocale: typeof validateLocale;
declare const Assertions$1_validateMaxOptionsLength: typeof validateMaxOptionsLength;
declare const Assertions$1_validateRequired: typeof validateRequired;
declare const Assertions$1_validateChoicesLength: typeof validateChoicesLength;
declare const Assertions$1_assertReturnOfBuilder: typeof assertReturnOfBuilder;
declare namespace Assertions$1 {
  export {
    validateName$1 as validateName,
    Assertions$1_validateDescription as validateDescription,
    Assertions$1_validateLocale as validateLocale,
    Assertions$1_validateMaxOptionsLength as validateMaxOptionsLength,
    validateRequiredParameters$1 as validateRequiredParameters,
    validateDefaultPermission$1 as validateDefaultPermission,
    Assertions$1_validateRequired as validateRequired,
    Assertions$1_validateChoicesLength as validateChoicesLength,
    Assertions$1_assertReturnOfBuilder as assertReturnOfBuilder,
  };
}

declare class ContextMenuCommandBuilder {
    /**
     * The name of this context menu command
     */
    readonly name: string;
    /**
     * The type of this context menu command
     */
    readonly type: ContextMenuCommandType;
    /**
     * Whether the command is enabled by default when the app is added to a guild
     *
     * @default true
     */
    readonly defaultPermission: boolean | undefined;
    /**
     * Sets the name
     *
     * @param name The name
     */
    setName(name: string): this;
    /**
     * Sets the type
     *
     * @param type The type
     */
    setType(type: ContextMenuCommandType): this;
    /**
     * Sets whether the command is enabled by default when the application is added to a guild.
     *
     * **Note**: If set to `false`, you will have to later `PUT` the permissions for this command.
     *
     * @param value Whether or not to enable this command by default
     *
     * @see https://discord.com/developers/docs/interactions/application-commands#permissions
     */
    setDefaultPermission(value: boolean): this;
    /**
     * Returns the final data that should be sent to Discord.
     *
     * **Note:** Calling this function will validate required properties based on their conditions.
     */
    toJSON(): RESTPostAPIApplicationCommandsJSONBody;
}
declare type ContextMenuCommandType = ApplicationCommandType.User | ApplicationCommandType.Message;

declare function validateDefaultPermission(value: unknown): asserts value is boolean;
declare function validateName(name: unknown): asserts name is string;
declare function validateType(type: unknown): asserts type is ContextMenuCommandType;
declare function validateRequiredParameters(name: string, type: number): void;

declare const Assertions_validateDefaultPermission: typeof validateDefaultPermission;
declare const Assertions_validateName: typeof validateName;
declare const Assertions_validateType: typeof validateType;
declare const Assertions_validateRequiredParameters: typeof validateRequiredParameters;
declare namespace Assertions {
  export {
    Assertions_validateDefaultPermission as validateDefaultPermission,
    Assertions_validateName as validateName,
    Assertions_validateType as validateType,
    Assertions_validateRequiredParameters as validateRequiredParameters,
  };
}

interface Equatable<T> {
    /**
     * Whether or not this is equal to another structure
     */
    equals: (other: T) => boolean;
}
/**
 * Indicates if an object is equatable or not.
 * @param maybeEquatable The object to check against
 */
declare function isEquatable(maybeEquatable: unknown): maybeEquatable is Equatable<unknown>;

declare function embedLength(data: APIEmbed): number;

export { ActionRowBuilder, AnyAPIActionRowComponent, AnyComponentBuilder, ButtonBuilder, Assertions$4 as ComponentAssertions, ComponentBuilder, Assertions as ContextMenuCommandAssertions, ContextMenuCommandBuilder, ContextMenuCommandType, Assertions$5 as EmbedAssertions, EmbedAuthorData, EmbedAuthorOptions, EmbedBuilder, EmbedFooterData, EmbedFooterOptions, EmbedImageData, Equatable, Faces, IconData, JSONEncodable, MappedComponentTypes, MessageActionRowComponentBuilder, MessageComponentBuilder, ModalActionRowComponentBuilder, Assertions$2 as ModalAssertions, ModalBuilder, ModalComponentBuilder, RGBTuple, SelectMenuBuilder, SelectMenuOptionBuilder, Assertions$1 as SlashCommandAssertions, SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandIntegerOption, SlashCommandMentionableOption, SlashCommandNumberOption, SlashCommandOptionsOnlyBuilder, SlashCommandRoleOption, SlashCommandStringOption, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandsOnlyBuilder, SlashCommandUserOption, Assertions$3 as TextInputAssertions, TextInputBuilder, TimestampStyles, TimestampStylesString, ToAPIApplicationCommandOptions, UnsafeButtonBuilder, UnsafeEmbedBuilder, UnsafeModalBuilder, UnsafeSelectMenuBuilder, UnsafeSelectMenuOptionBuilder, UnsafeTextInputBuilder, blockQuote, bold, channelMention, codeBlock, createComponentBuilder, embedLength, formatEmoji, hideLinkEmbed, hyperlink, inlineCode, isEquatable, isJSONEncodable, italic, quote, roleMention, spoiler, strikethrough, time, underscore, userMention };
