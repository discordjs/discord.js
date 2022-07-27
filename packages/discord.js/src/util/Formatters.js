'use strict';

const { deprecate } = require('node:util');
const {
  blockQuote,
  bold,
  channelMention,
  codeBlock,
  formatEmoji,
  hideLinkEmbed,
  hyperlink,
  inlineCode,
  italic,
  quote,
  roleMention,
  spoiler,
  strikethrough,
  time,
  TimestampStyles,
  underscore,
  userMention,
} = require('@discordjs/builders');

/**
 * Wraps the content inside a code block with an optional language.
 * @method codeBlock
 * @param {string} contentOrLanguage The language to use or content if a second parameter isn't provided
 * @param {string} [content] The content to wrap
 * @returns {string}
 */

/**
 * Wraps the content inside \`backticks\`, which formats it as inline code.
 * @method inlineCode
 * @param {string} content The content to wrap
 * @returns {string}
 */

/**
 * Formats the content into italic text.
 * @method italic
 * @param {string} content The content to wrap
 * @returns {string}
 */

/**
 * Formats the content into bold text.
 * @method bold
 * @param {string} content The content to wrap
 * @returns {string}
 */

/**
 * Formats the content into underscored text.
 * @method underscore
 * @param {string} content The content to wrap
 * @returns {string}
 */

/**
 * Formats the content into strike-through text.
 * @method strikethrough
 * @param {string} content The content to wrap
 * @returns {string}
 */

/**
 * Formats the content into a quote.
 * <info>This needs to be at the start of the line for Discord to format it.</info>
 * @method quote
 * @param {string} content The content to wrap
 * @returns {string}
 */

/**
 * Formats the content into a block quote.
 * <info>This needs to be at the start of the line for Discord to format it.</info>
 * @method blockQuote
 * @param {string} content The content to wrap
 * @returns {string}
 */

/**
 * Wraps the URL into `<>`, which stops it from embedding.
 * @method hideLinkEmbed
 * @param {string} content The content to wrap
 * @returns {string}
 */

/**
 * Formats the content and the URL into a masked URL with an optional title.
 * @method hyperlink
 * @param {string} content The content to display
 * @param {string} url The URL the content links to
 * @param {string} [title] The title shown when hovering on the masked link
 * @returns {string}
 */

/**
 * Formats the content into spoiler text.
 * @method spoiler
 * @param {string} content The content to spoiler
 * @returns {string}
 */

/**
 * Formats a user id into a user mention.
 * @method userMention
 * @param {Snowflake} userId The user id to format
 * @returns {string}
 */

/**
 * Formats a channel id into a channel mention.
 * @method channelMention
 * @param {Snowflake} channelId The channel id to format
 * @returns {string}
 */

/**
 * Formats a role id into a role mention.
 * @method roleMention
 * @param {Snowflake} roleId The role id to format
 * @returns {string}
 */

/**
 * Formats an emoji id into a fully qualified emoji identifier.
 * @method formatEmoji
 * @param {Snowflake} emojiId The emoji id to format
 * @param {boolean} [animated=false] Whether the emoji is animated
 * @returns {string}
 */

/**
 * A message formatting timestamp style, as defined in
 * [here](https://discord.com/developers/docs/reference#message-formatting-timestamp-styles).
 * * `t` Short time format, consisting of hours and minutes, e.g. 16:20.
 * * `T` Long time format, consisting of hours, minutes, and seconds, e.g. 16:20:30.
 * * `d` Short date format, consisting of day, month, and year, e.g. 20/04/2021.
 * * `D` Long date format, consisting of day, month, and year, e.g. 20 April 2021.
 * * `f` Short date-time format, consisting of short date and short time formats, e.g. 20 April 2021 16:20.
 * * `F` Long date-time format, consisting of long date and short time formats, e.g. Tuesday, 20 April 2021 16:20.
 * * `R` Relative time format, consisting of a relative duration format, e.g. 2 months ago.
 * @typedef {string} TimestampStylesString
 */

/**
 * Formats a date into a short date-time string.
 * @method time
 * @param {number|Date} [date] The date to format
 * @param {TimestampStylesString} [style] The style to use
 * @returns {string}
 */

/**
 * Contains various Discord-specific functions for formatting messages.
 * @deprecated This class is redundant as all methods of the class are top-level exports.
 */
class Formatters extends null {
  /**
   * Formats the content into a block quote.
   * <info>This needs to be at the start of the line for Discord to format it.</info>
   * @method blockQuote
   * @memberof Formatters
   * @param {string} content The content to wrap
   * @returns {string}
   * @deprecated Use this method as a top-level function instead.
   */
  static blockQuote = deprecate(
    blockQuote,
    'Formatters.blockQuote() is deprecated. Use this method as a top-level function instead.',
  );

  /**
   * Formats the content into bold text.
   * @method bold
   * @memberof Formatters
   * @param {string} content The content to wrap
   * @returns {string}
   * @deprecated Use this method as a top-level function instead.
   */
  static bold = deprecate(bold, 'Formatters.bold() is deprecated. Use this method as a top-level function instead.');

  /**
   * Formats a channel id into a channel mention.
   * @method channelMention
   * @memberof Formatters
   * @param {Snowflake} channelId The channel id to format
   * @returns {string}
   * @deprecated Use this method as a top-level function instead.
   */
  static channelMention = deprecate(
    channelMention,
    'Formatters.channelMention() is deprecated. Use this method as a top-level function instead.',
  );

  /**
   * Wraps the content inside a code block with an optional language.
   * @method codeBlock
   * @memberof Formatters
   * @param {string} contentOrLanguage The language to use or content if a second parameter isn't provided
   * @param {string} [content] The content to wrap
   * @returns {string}
   * @deprecated Use this method as a top-level function instead.
   */
  static codeBlock = deprecate(
    codeBlock,
    'Formatters.codeBlock() is deprecated. Use this method as a top-level function instead.',
  );

  /**
   * Formats an emoji id into a fully qualified emoji identifier.
   * @method formatEmoji
   * @memberof Formatters
   * @param {string} emojiId The emoji id to format
   * @param {boolean} [animated=false] Whether the emoji is animated
   * @returns {string}
   * @deprecated Use this method as a top-level function instead.
   */
  static formatEmoji = deprecate(
    formatEmoji,
    'Formatters.formatEmoji() is deprecated. Use this method as a top-level function instead.',
  );

  /**
   * Wraps the URL into `<>`, which stops it from embedding.
   * @method hideLinkEmbed
   * @memberof Formatters
   * @param {string} content The content to wrap
   * @returns {string}
   * @deprecated Use this method as a top-level function instead.
   */
  static hideLinkEmbed = deprecate(
    hideLinkEmbed,
    'Formatters.hideLinkEmbed() is deprecated. Use this method as a top-level function instead.',
  );

  /**
   * Formats the content and the URL into a masked URL with an optional title.
   * @method hyperlink
   * @memberof Formatters
   * @param {string} content The content to display
   * @param {string} url The URL the content links to
   * @param {string} [title] The title shown when hovering on the masked link
   * @returns {string}
   * @deprecated Use this method as a top-level function instead.
   */
  static hyperlink = deprecate(
    hyperlink,
    'Formatters.hyperlink() is deprecated. Use this method as a top-level function instead.',
  );

  /**
   * Wraps the content inside \`backticks\`, which formats it as inline code.
   * @method inlineCode
   * @memberof Formatters
   * @param {string} content The content to wrap
   * @returns {string}
   * @deprecated Use this method as a top-level function instead.
   */
  static inlineCode = deprecate(
    inlineCode,
    'Formatters.inlineCode() is deprecated. Use this method as a top-level function instead.',
  );

  /**
   * Formats the content into italic text.
   * @method italic
   * @memberof Formatters
   * @param {string} content The content to wrap
   * @returns {string}
   * @deprecated Use this method as a top-level function instead.
   */
  static italic = deprecate(
    italic,
    'Formatters.italic() is deprecated. Use this method as a top-level function instead.',
  );

  /**
   * Formats the content into a quote. This needs to be at the start of the line for Discord to format it.
   * @method quote
   * @memberof Formatters
   * @param {string} content The content to wrap
   * @returns {string}
   * @deprecated Use this method as a top-level function instead.
   */
  static quote = deprecate(quote, 'Formatters.quote() is deprecated. Use this method as a top-level function instead.');

  /**
   * Formats a role id into a role mention.
   * @method roleMention
   * @memberof Formatters
   * @param {Snowflake} roleId The role id to format
   * @returns {string}
   * @deprecated Use this method as a top-level function instead.
   */
  static roleMention = deprecate(
    roleMention,
    'Formatters.roleMention() is deprecated. Use this method as a top-level function instead.',
  );

  /**
   * Formats the content into spoiler text.
   * @method spoiler
   * @memberof Formatters
   * @param {string} content The content to spoiler
   * @returns {string}
   * @deprecated Use this method as a top-level function instead.
   */
  static spoiler = deprecate(
    spoiler,
    'Formatters.spoiler() is deprecated. Use this method as a top-level function instead.',
  );

  /**
   * Formats the content into strike-through text.
   * @method strikethrough
   * @memberof Formatters
   * @param {string} content The content to wrap
   * @returns {string}
   * @deprecated Use this method as a top-level function instead.
   */
  static strikethrough = deprecate(
    strikethrough,
    'Formatters.strikethrough() is deprecated. Use this method as a top-level function instead.',
  );

  /**
   * Formats a date into a short date-time string.
   * @method time
   * @memberof Formatters
   * @param {number|Date} [date] The date to format
   * @param {TimestampStylesString} [style] The style to use
   * @returns {string}
   * @deprecated Use this method as a top-level function instead.
   */
  static time = deprecate(time, 'Formatters.time() is deprecated. Use this method as a top-level function instead.');

  /**
   * The message formatting timestamp
   * [styles](https://discord.com/developers/docs/reference#message-formatting-timestamp-styles) supported by Discord.
   * @type {Object<string, TimestampStylesString>}
   * @memberof Formatters
   * @deprecated Use this property as a top-level property instead.
   */
  static TimestampStyles = TimestampStyles;

  /**
   * Formats the content into underscored text.
   * @method underscore
   * @memberof Formatters
   * @param {string} content The content to wrap
   * @returns {string}
   * @deprecated Use this method as a top-level function instead.
   */
  static underscore = deprecate(
    underscore,
    'Formatters.underscore() is deprecated. Use this method as a top-level function instead.',
  );

  /**
   * Formats a user id into a user mention.
   * @method userMention
   * @memberof Formatters
   * @param {Snowflake} userId The user id to format
   * @returns {string}
   * @deprecated Use this method as a top-level function instead.
   */
  static userMention = deprecate(
    userMention,
    'Formatters.userMention() is deprecated. Use this method as a top-level function instead.',
  );
}

module.exports = Formatters;
