'use strict';

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
  memberNicknameMention,
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
 * Contains various Discord-specific functions for formatting messages.
 */
class Formatters extends null {}

/**
 * Formats the content into a block quote. This needs to be at the start of the line for Discord to format it.
 * @method blockQuote
 * @memberof Formatters
 * @param {string} content The content to wrap.
 * @returns {string}
 */
Formatters.blockQuote = blockQuote;

/**
 * Formats the content into bold text.
 * @method bold
 * @memberof Formatters
 * @param {string} content The content to wrap.
 * @returns {string}
 */
Formatters.bold = bold;

/**
 * Formats a channel id into a channel mention.
 * @method channelMention
 * @memberof Formatters
 * @param {string} channelId The channel id to format.
 * @returns {string}
 */
Formatters.channelMention = channelMention;

/**
 * Wraps the content inside a code block with an optional language.
 * @method codeBlock
 * @memberof Formatters
 * @param {string} contentOrLanguage The language to use, content if a second parameter isn't provided.
 * @param {string} [content] The content to wrap.
 * @returns {string}
 */
Formatters.codeBlock = codeBlock;

/**
 * Formats an emoji id into a fully qualified emoji identifier
 * @method formatEmoji
 * @memberof Formatters
 * @param {string} emojiId The emoji id to format.
 * @param {boolean} [animated] Whether the emoji is animated or not. Defaults to `false`
 * @returns {string}
 */
Formatters.formatEmoji = formatEmoji;

/**
 * Wraps the URL into `<>`, which stops it from embedding.
 * @method hideLinkEmbed
 * @memberof Formatters
 * @param {string} content The content to wrap.
 * @returns {string}
 */
Formatters.hideLinkEmbed = hideLinkEmbed;

/**
 * Formats the content and the URL into a masked URL with an optional title.
 * @method hyperlink
 * @memberof Formatters
 * @param {string} content The content to display.
 * @param {string} url The URL the content links to.
 * @param {string} [title] The title shown when hovering on the masked link.
 * @returns {string}
 */
Formatters.hyperlink = hyperlink;

/**
 * Wraps the content inside \`backticks\`, which formats it as inline code.
 * @method inlineCode
 * @memberof Formatters
 * @param {string} content The content to wrap.
 * @returns {string}
 */
Formatters.inlineCode = inlineCode;

/**
 * Formats the content into italic text.
 * @method italic
 * @memberof Formatters
 * @param {string} content The content to wrap.
 * @returns {string}
 */
Formatters.italic = italic;

/**
 * Formats a user id into a member-nickname mention.
 * @method memberNicknameMention
 * @memberof Formatters
 * @param {string} memberId The user id to format.
 * @returns {string}
 */
Formatters.memberNicknameMention = memberNicknameMention;

/**
 * Formats the content into a quote. This needs to be at the start of the line for Discord to format it.
 * @method quote
 * @memberof Formatters
 * @param {string} content The content to wrap.
 * @returns {string}
 */
Formatters.quote = quote;

/**
 * Formats a role id into a role mention.
 * @method roleMention
 * @memberof Formatters
 * @param {string} roleId The role id to format.
 * @returns {string}
 */
Formatters.roleMention = roleMention;

/**
 * Formats the content into spoiler text.
 * @method spoiler
 * @memberof Formatters
 * @param {string} content The content to spoiler.
 * @returns {string}
 */
Formatters.spoiler = spoiler;

/**
 * Formats the content into strike-through text.
 * @method strikethrough
 * @memberof Formatters
 * @param {string} content The content to wrap.
 * @returns {string}
 */
Formatters.strikethrough = strikethrough;

/**
 * Formats a date into a short date-time string.
 * @method time
 * @memberof Formatters
 * @param {number|Date} [date] The date to format.
 * @param {TimestampStylesString} [style] The style to use.
 * @returns {string}
 */
Formatters.time = time;

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
 * The message formatting timestamp
 * [styles](https://discord.com/developers/docs/reference#message-formatting-timestamp-styles) supported by Discord.
 * @memberof Formatters
 * @type {Object<string, TimestampStylesString>}
 */
Formatters.TimestampStyles = TimestampStyles;

/**
 * Formats the content into underscored text.
 * @method underscore
 * @memberof Formatters
 * @param {string} content The content to wrap.
 * @returns {string}
 */
Formatters.underscore = underscore;

/**
 * Formats a user id into a user mention.
 * @method userMention
 * @memberof Formatters
 * @param {string} userId The user id to format.
 * @returns {string}
 */
Formatters.userMention = userMention;

module.exports = Formatters;
