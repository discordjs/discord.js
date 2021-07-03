'use strict';

const {
  blockQuote,
  bold,
  codeBlock,
  hideLinkEmbed,
  hyperlink,
  inlineCode,
  italic,
  quote,
  strikethrough,
  time,
  TimestampStyles,
  underscore,
} = require('@discordjs/builders');

/**
 * Contains various Discord-specific functions for formatting messages.
 * @namespace Formatters
 */

/**
 * Formats the content into a block quote. This needs to be at the start of the line for Discord to format it.
 * @memberof Formatters
 * @param {string} content The content to wrap.
 * @returns {string}
 */
exports.blockQuote = blockQuote;

/**
 * Formats the content into bold text.
 * @memberof Formatters
 * @param {string} content The content to wrap.
 * @returns {string}
 */
exports.bold = bold;

/**
 * Wraps the content inside a codeblock with an optional language.
 * @memberof Formatters
 * @param {string} contentOrLanguage The language to use, content if a second parameter isn't provided.
 * @param {string} [content] The content to wrap.
 * @returns {string}
 */
exports.codeBlock = codeBlock;

/**
 * Formats the URL into <>, which stops it from embedding.
 * @memberof Formatters
 * @param {string} content The content to wrap.
 * @returns {string}
 */
exports.hideLinkEmbed = hideLinkEmbed;

/**
 * Formats the content and the URL into a masked URL with an optional title.
 * @memberof Formatters
 * @param {string} content The content to display.
 * @param {string} url The URL the content links to.
 * @param {string} [title] The title shown when hovering on the masked link.
 * @returns {string}
 */
exports.hyperlink = hyperlink;

/**
 * Wraps the content inside an inline code.
 * @memberof Formatters
 * @param {string} content The content to wrap.
 * @returns {string}
 */
exports.inlineCode = inlineCode;

/**
 * Formats the content into italic text.
 * @memberof Formatters
 * @param {string} content The content to wrap.
 * @returns {string}
 */
exports.italic = italic;

/**
 * Formats the content into a quote. This needs to be at the start of the line for Discord to format it.
 * @memberof Formatters
 * @param {string} content The content to wrap.
 * @returns {string}
 */
exports.quote = quote;

/**
 * Formats the content into strikethrough text.
 * @memberof Formatters
 * @param {string} content The content to wrap.
 * @returns {string}
 */
exports.strikethrough = strikethrough;

/**
 * Formats a date into a short date-time string
 * @memberof Formatters
 * @param {number|Date} [date] The date to format.
 * @param {TimestampStyles} [style] The style to use.
 * @returns {string}
 */
exports.time = time;

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
exports.TimestampStyles = TimestampStyles;

/**
 * Formats the content into underscored text.
 * @memberof Formatters
 * @param {string} content The content to wrap.
 * @returns {string}
 */
exports.underscore = underscore;
