import type { URL } from 'url';
import type { Snowflake } from 'discord-api-types/globals';

/**
 * Wraps the content inside a codeblock with no language
 *
 * @param content - The content to wrap
 */
export function codeBlock<C extends string>(content: C): `\`\`\`\n${C}\`\`\``;

/**
 * Wraps the content inside a codeblock with the specified language
 *
 * @param language - The language for the codeblock
 * @param content - The content to wrap
 */
export function codeBlock<L extends string, C extends string>(language: L, content: C): `\`\`\`${L}\n${C}\`\`\``;
export function codeBlock(language: string, content?: string): string {
	return typeof content === 'undefined' ? `\`\`\`\n${language}\`\`\`` : `\`\`\`${language}\n${content}\`\`\``;
}

/**
 * Wraps the content inside \`backticks\`, which formats it as inline code
 *
 * @param content - The content to wrap
 */
export function inlineCode<C extends string>(content: C): `\`${C}\`` {
	return `\`${content}\``;
}

/**
 * Formats the content into italic text
 *
 * @param content - The content to wrap
 */
export function italic<C extends string>(content: C): `_${C}_` {
	return `_${content}_`;
}

/**
 * Formats the content into bold text
 *
 * @param content - The content to wrap
 */
export function bold<C extends string>(content: C): `**${C}**` {
	return `**${content}**`;
}

/**
 * Formats the content into underscored text
 *
 * @param content - The content to wrap
 */
export function underscore<C extends string>(content: C): `__${C}__` {
	return `__${content}__`;
}

/**
 * Formats the content into strike-through text
 *
 * @param content - The content to wrap
 */
export function strikethrough<C extends string>(content: C): `~~${C}~~` {
	return `~~${content}~~`;
}

/**
 * Formats the content into a quote. This needs to be at the start of the line for Discord to format it
 *
 * @param content - The content to wrap
 */
export function quote<C extends string>(content: C): `> ${C}` {
	return `> ${content}`;
}

/**
 * Formats the content into a block quote. This needs to be at the start of the line for Discord to format it
 *
 * @param content - The content to wrap
 */
export function blockQuote<C extends string>(content: C): `>>> ${C}` {
	return `>>> ${content}`;
}

/**
 * Wraps the URL into `<>`, which stops it from embedding
 *
 * @param url - The URL to wrap
 */
export function hideLinkEmbed<C extends string>(url: C): `<${C}>`;

/**
 * Wraps the URL into `<>`, which stops it from embedding
 *
 * @param url - The URL to wrap
 */
export function hideLinkEmbed(url: URL): `<${string}>`;
export function hideLinkEmbed(url: string | URL) {
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	return `<${url}>`;
}

/**
 * Formats the content and the URL into a masked URL
 *
 * @param content - The content to display
 * @param url - The URL the content links to
 */
export function hyperlink<C extends string>(content: C, url: URL): `[${C}](${string})`;

/**
 * Formats the content and the URL into a masked URL
 *
 * @param content - The content to display
 * @param url - The URL the content links to
 */
export function hyperlink<C extends string, U extends string>(content: C, url: U): `[${C}](${U})`;

/**
 * Formats the content and the URL into a masked URL
 *
 * @param content - The content to display
 * @param url - The URL the content links to
 * @param title - The title shown when hovering on the masked link
 */
export function hyperlink<C extends string, T extends string>(
	content: C,
	url: URL,
	title: T,
): `[${C}](${string} "${T}")`;

/**
 * Formats the content and the URL into a masked URL
 *
 * @param content - The content to display
 * @param url - The URL the content links to
 * @param title - The title shown when hovering on the masked link
 */
export function hyperlink<C extends string, U extends string, T extends string>(
	content: C,
	url: U,
	title: T,
): `[${C}](${U} "${T}")`;
export function hyperlink(content: string, url: string | URL, title?: string) {
	// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
	return title ? `[${content}](${url} "${title}")` : `[${content}](${url})`;
}

/**
 * Wraps the content inside spoiler (hidden text)
 *
 * @param content - The content to wrap
 */
export function spoiler<C extends string>(content: C): `||${C}||` {
	return `||${content}||`;
}

/**
 * Formats a user ID into a user mention
 *
 * @param userId - The user ID to format
 */
export function userMention<C extends Snowflake>(userId: C): `<@${C}>` {
	return `<@${userId}>`;
}

/**
 * Formats a channel ID into a channel mention
 *
 * @param channelId - The channel ID to format
 */
export function channelMention<C extends Snowflake>(channelId: C): `<#${C}>` {
	return `<#${channelId}>`;
}

/**
 * Formats a role ID into a role mention
 *
 * @param roleId - The role ID to format
 */
export function roleMention<C extends Snowflake>(roleId: C): `<@&${C}>` {
	return `<@&${roleId}>`;
}

/**
 * Formats an emoji ID into a fully qualified emoji identifier
 *
 * @param emojiId - The emoji ID to format
 */
export function formatEmoji<C extends Snowflake>(emojiId: C, animated?: false): `<:_:${C}>`;

/**
 * Formats an emoji ID into a fully qualified emoji identifier
 *
 * @param emojiId - The emoji ID to format
 * @param animated - Whether the emoji is animated or not. Defaults to `false`
 */
export function formatEmoji<C extends Snowflake>(emojiId: C, animated?: true): `<a:_:${C}>`;

/**
 * Formats an emoji ID into a fully qualified emoji identifier
 *
 * @param emojiId - The emoji ID to format
 * @param animated - Whether the emoji is animated or not. Defaults to `false`
 */
export function formatEmoji<C extends Snowflake>(emojiId: C, animated = false): `<a:_:${C}>` | `<:_:${C}>` {
	return `<${animated ? 'a' : ''}:_:${emojiId}>`;
}

/**
 * Formats a date into a short date-time string
 *
 * @param date - The date to format, defaults to the current time
 */
export function time(date?: Date): `<t:${bigint}>`;

/**
 * Formats a date given a format style
 *
 * @param date - The date to format
 * @param style - The style to use
 */
export function time<S extends TimestampStylesString>(date: Date, style: S): `<t:${bigint}:${S}>`;

/**
 * Formats the given timestamp into a short date-time string
 *
 * @param seconds - The time to format, represents an UNIX timestamp in seconds
 */
export function time<C extends number>(seconds: C): `<t:${C}>`;

/**
 * Formats the given timestamp into a short date-time string
 *
 * @param seconds - The time to format, represents an UNIX timestamp in seconds
 * @param style - The style to use
 */
export function time<C extends number, S extends TimestampStylesString>(seconds: C, style: S): `<t:${C}:${S}>`;
export function time(timeOrSeconds?: number | Date, style?: TimestampStylesString): string {
	if (typeof timeOrSeconds !== 'number') {
		timeOrSeconds = Math.floor((timeOrSeconds?.getTime() ?? Date.now()) / 1000);
	}

	return typeof style === 'string' ? `<t:${timeOrSeconds}:${style}>` : `<t:${timeOrSeconds}>`;
}

/**
 * The [message formatting timestamp styles](https://discord.com/developers/docs/reference#message-formatting-timestamp-styles) supported by Discord
 */
export const TimestampStyles = {
	/**
	 * Short time format, consisting of hours and minutes, e.g. 16:20
	 */
	ShortTime: 't',

	/**
	 * Long time format, consisting of hours, minutes, and seconds, e.g. 16:20:30
	 */
	LongTime: 'T',

	/**
	 * Short date format, consisting of day, month, and year, e.g. 20/04/2021
	 */
	ShortDate: 'd',

	/**
	 * Long date format, consisting of day, month, and year, e.g. 20 April 2021
	 */
	LongDate: 'D',

	/**
	 * Short date-time format, consisting of short date and short time formats, e.g. 20 April 2021 16:20
	 */
	ShortDateTime: 'f',

	/**
	 * Long date-time format, consisting of long date and short time formats, e.g. Tuesday, 20 April 2021 16:20
	 */
	LongDateTime: 'F',

	/**
	 * Relative time format, consisting of a relative duration format, e.g. 2 months ago
	 */
	RelativeTime: 'R',
} as const;

/**
 * The possible values, see {@link TimestampStyles} for more information
 */
export type TimestampStylesString = typeof TimestampStyles[keyof typeof TimestampStyles];

/**
 * An enum with all the available faces from Discord's native slash commands
 */
export enum Faces {
	/**
	 * ¯\\_(ツ)\\_/¯
	 */
	Shrug = '¯\\_(ツ)\\_/¯',

	/**
	 * (╯°□°）╯︵ ┻━┻
	 */
	Tableflip = '(╯°□°）╯︵ ┻━┻',

	/**
	 * ┬─┬ ノ( ゜-゜ノ)
	 */
	Unflip = '┬─┬ ノ( ゜-゜ノ)',
}
