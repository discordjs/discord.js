import type { URL } from 'node:url';
import type { Snowflake } from 'discord-api-types/globals';

/**
 * Wraps the content inside a code block with no language.
 *
 * @typeParam Content - This is inferred by the supplied content
 * @param content - The content to wrap
 */
export function codeBlock<Content extends string>(content: Content): `\`\`\`\n${Content}\n\`\`\``;

/**
 * Wraps the content inside a code block with the specified language.
 *
 * @typeParam Language - This is inferred by the supplied language
 * @typeParam Content - This is inferred by the supplied content
 * @param language - The language for the code block
 * @param content - The content to wrap
 */
export function codeBlock<Language extends string, Content extends string>(
	language: Language,
	content: Content,
): `\`\`\`${Language}\n${Content}\n\`\`\``;

export function codeBlock(language: string, content?: string): string {
	return content === undefined ? `\`\`\`\n${language}\n\`\`\`` : `\`\`\`${language}\n${content}\n\`\`\``;
}

/**
 * Wraps the content inside \`backticks\` which formats it as inline code.
 *
 * @typeParam Content - This is inferred by the supplied content
 * @param content - The content to wrap
 */
export function inlineCode<Content extends string>(content: Content): `\`${Content}\`` {
	return `\`${content}\``;
}

/**
 * Formats the content into italic text.
 *
 * @typeParam Content - This is inferred by the supplied content
 * @param content - The content to wrap
 */
export function italic<Content extends string>(content: Content): `_${Content}_` {
	return `_${content}_`;
}

/**
 * Formats the content into bold text.
 *
 * @typeParam Content - This is inferred by the supplied content
 * @param content - The content to wrap
 */
export function bold<Content extends string>(content: Content): `**${Content}**` {
	return `**${content}**`;
}

/**
 * Formats the content into underscored text.
 *
 * @typeParam Content - This is inferred by the supplied content
 * @param content - The content to wrap
 * @deprecated Use {@link underline} instead.
 */
export function underscore<Content extends string>(content: Content): `__${Content}__` {
	return underline(content);
}

/**
 * Formats the content into underlined text.
 *
 * @typeParam Content - This is inferred by the supplied content
 * @param content - The content to wrap
 */
export function underline<Content extends string>(content: Content): `__${Content}__` {
	return `__${content}__`;
}

/**
 * Formats the content into strike-through text.
 *
 * @typeParam Content - This is inferred by the supplied content
 * @param content - The content to wrap
 */
export function strikethrough<Content extends string>(content: Content): `~~${Content}~~` {
	return `~~${content}~~`;
}

/**
 * Formats the content into a quote.
 *
 * @remarks This needs to be at the start of the line for Discord to format it.
 * @typeParam Content - This is inferred by the supplied content
 * @param content - The content to wrap
 */
export function quote<Content extends string>(content: Content): `> ${Content}` {
	return `> ${content}`;
}

/**
 * Formats the content into a block quote.
 *
 * @remarks This needs to be at the start of the line for Discord to format it.
 * @typeParam Content - This is inferred by the supplied content
 * @param content - The content to wrap
 */
export function blockQuote<Content extends string>(content: Content): `>>> ${Content}` {
	return `>>> ${content}`;
}

/**
 * Wraps the URL into `<>` which stops it from embedding.
 *
 * @typeParam Content - This is inferred by the supplied content
 * @param url - The URL to wrap
 */
export function hideLinkEmbed<Content extends string>(url: Content): `<${Content}>`;

/**
 * Wraps the URL into `<>` which stops it from embedding.
 *
 * @param url - The URL to wrap
 */
export function hideLinkEmbed(url: URL): `<${string}>`;

export function hideLinkEmbed(url: URL | string) {
	return `<${url}>`;
}

/**
 * Formats the content and the URL into a masked URL.
 *
 * @typeParam Content - This is inferred by the supplied content
 * @param content - The content to display
 * @param url - The URL the content links to
 */
export function hyperlink<Content extends string>(content: Content, url: URL): `[${Content}](${string})`;

/**
 * Formats the content and the URL into a masked URL.
 *
 * @typeParam Content - This is inferred by the supplied content
 * @typeParam Url - This is inferred by the supplied URL
 * @param content - The content to display
 * @param url - The URL the content links to
 */
export function hyperlink<Content extends string, Url extends string>(
	content: Content,
	url: Url,
): `[${Content}](${Url})`;

/**
 * Formats the content and the URL into a masked URL with a custom tooltip.
 *
 * @typeParam Content - This is inferred by the supplied content
 * @typeParam Title - This is inferred by the supplied title
 * @param content - The content to display
 * @param url - The URL the content links to
 * @param title - The title shown when hovering on the masked link
 */
export function hyperlink<Content extends string, Title extends string>(
	content: Content,
	url: URL,
	title: Title,
): `[${Content}](${string} "${Title}")`;

/**
 * Formats the content and the URL into a masked URL with a custom tooltip.
 *
 * @typeParam Content - This is inferred by the supplied content
 * @typeParam Url - This is inferred by the supplied URL
 * @typeParam Title - This is inferred by the supplied title
 * @param content - The content to display
 * @param url - The URL the content links to
 * @param title - The title shown when hovering on the masked link
 */
export function hyperlink<Content extends string, Url extends string, Title extends string>(
	content: Content,
	url: Url,
	title: Title,
): `[${Content}](${Url} "${Title}")`;

export function hyperlink(content: string, url: URL | string, title?: string) {
	return title ? `[${content}](${url} "${title}")` : `[${content}](${url})`;
}

/**
 * Formats the content into a spoiler.
 *
 * @typeParam Content - This is inferred by the supplied content
 * @param content - The content to wrap
 */
export function spoiler<Content extends string>(content: Content): `||${Content}||` {
	return `||${content}||`;
}

/**
 * Formats a user id into a user mention.
 *
 * @typeParam UserId - This is inferred by the supplied user id
 * @param userId - The user id to format
 */
export function userMention<UserId extends Snowflake>(userId: UserId): `<@${UserId}>` {
	return `<@${userId}>`;
}

/**
 * Formats a channel id into a channel mention.
 *
 * @typeParam ChannelId - This is inferred by the supplied channel id
 * @param channelId - The channel id to format
 */
export function channelMention<ChannelId extends Snowflake>(channelId: ChannelId): `<#${ChannelId}>` {
	return `<#${channelId}>`;
}

/**
 * Formats a role id into a role mention.
 *
 * @typeParam RoleId - This is inferred by the supplied role id
 * @param roleId - The role id to format
 */
export function roleMention<RoleId extends Snowflake>(roleId: RoleId): `<@&${RoleId}>` {
	return `<@&${roleId}>`;
}

/**
 * Formats an application command name, subcommand group name, subcommand name, and id into an application command mention.
 *
 * @typeParam CommandName - This is inferred by the supplied command name
 * @typeParam SubcommandGroupName - This is inferred by the supplied subcommand group name
 * @typeParam SubcommandName - This is inferred by the supplied subcommand name
 * @typeParam CommandId - This is inferred by the supplied command id
 * @param commandName - The application command name to format
 * @param subcommandGroupName - The subcommand group name to format
 * @param subcommandName - The subcommand name to format
 * @param commandId - The application command id to format
 */
export function chatInputApplicationCommandMention<
	CommandName extends string,
	SubcommandGroupName extends string,
	SubcommandName extends string,
	CommandId extends Snowflake,
>(
	commandName: CommandName,
	subcommandGroupName: SubcommandGroupName,
	subcommandName: SubcommandName,
	commandId: CommandId,
): `</${CommandName} ${SubcommandGroupName} ${SubcommandName}:${CommandId}>`;

/**
 * Formats an application command name, subcommand name, and id into an application command mention.
 *
 * @typeParam CommandName - This is inferred by the supplied command name
 * @typeParam SubcommandName - This is inferred by the supplied subcommand name
 * @typeParam CommandId - This is inferred by the supplied command id
 * @param commandName - The application command name to format
 * @param subcommandName - The subcommand name to format
 * @param commandId - The application command id to format
 */
export function chatInputApplicationCommandMention<
	CommandName extends string,
	SubcommandName extends string,
	CommandId extends Snowflake,
>(
	commandName: CommandName,
	subcommandName: SubcommandName,
	commandId: CommandId,
): `</${CommandName} ${SubcommandName}:${CommandId}>`;

/**
 * Formats an application command name and id into an application command mention.
 *
 * @typeParam CommandName - This is inferred by the supplied command name
 * @typeParam CommandId - This is inferred by the supplied command id
 * @param commandName - The application command name to format
 * @param commandId - The application command id to format
 */
export function chatInputApplicationCommandMention<CommandName extends string, CommandId extends Snowflake>(
	commandName: CommandName,
	commandId: CommandId,
): `</${CommandName}:${CommandId}>`;

export function chatInputApplicationCommandMention<
	CommandName extends string,
	SubcommandGroupName extends Snowflake | string,
	SubcommandName extends Snowflake | string,
	CommandId extends Snowflake,
>(
	commandName: CommandName,
	subcommandGroupName: SubcommandGroupName,
	subcommandName?: SubcommandName,
	commandId?: CommandId,
):
	| `</${CommandName} ${SubcommandGroupName} ${SubcommandName}:${CommandId}>`
	| `</${CommandName} ${SubcommandGroupName}:${SubcommandName}>`
	| `</${CommandName}:${SubcommandGroupName}>` {
	if (commandId !== undefined) {
		return `</${commandName} ${subcommandGroupName} ${subcommandName!}:${commandId}>`;
	}

	if (subcommandName !== undefined) {
		return `</${commandName} ${subcommandGroupName}:${subcommandName}>`;
	}

	return `</${commandName}:${subcommandGroupName}>`;
}

/**
 * Formats a non-animated emoji id into a fully qualified emoji identifier.
 *
 * @typeParam EmojiId - This is inferred by the supplied emoji id
 * @param emojiId - The emoji id to format
 */
export function formatEmoji<EmojiId extends Snowflake>(emojiId: EmojiId, animated?: false): `<:_:${EmojiId}>`;

/**
 * Formats an animated emoji id into a fully qualified emoji identifier.
 *
 * @typeParam EmojiId - This is inferred by the supplied emoji id
 * @param emojiId - The emoji id to format
 * @param animated - Whether the emoji is animated
 */
export function formatEmoji<EmojiId extends Snowflake>(emojiId: EmojiId, animated?: true): `<a:_:${EmojiId}>`;

/**
 * Formats an emoji id into a fully qualified emoji identifier.
 *
 * @typeParam EmojiId - This is inferred by the supplied emoji id
 * @param emojiId - The emoji id to format
 * @param animated - Whether the emoji is animated
 */
export function formatEmoji<EmojiId extends Snowflake>(
	emojiId: EmojiId,
	animated?: boolean,
): `<:_:${EmojiId}>` | `<a:_:${EmojiId}>`;

/**
 * Formats a non-animated emoji id and name into a fully qualified emoji identifier.
 *
 * @typeParam EmojiId - This is inferred by the supplied emoji id
 * @typeParam EmojiName - This is inferred by the supplied name
 * @param options - The options for formatting an emoji
 */
export function formatEmoji<EmojiId extends Snowflake, EmojiName extends string>(
	options: FormatEmojiOptions<EmojiId, EmojiName> & { animated: true },
): `<a:${EmojiName}:${EmojiId}>`;

/**
 * Formats an animated emoji id and name into a fully qualified emoji identifier.
 *
 * @typeParam EmojiId - This is inferred by the supplied emoji id
 * @typeParam EmojiName - This is inferred by the supplied name
 * @param options - The options for formatting an emoji
 */
export function formatEmoji<EmojiId extends Snowflake, EmojiName extends string>(
	options: FormatEmojiOptions<EmojiId, EmojiName> & { animated?: false },
): `<:${EmojiName}:${EmojiId}>`;

/**
 * Formats an emoji id and name into a fully qualified emoji identifier.
 *
 * @typeParam EmojiId - This is inferred by the supplied emoji id
 * @typeParam EmojiName - This is inferred by the supplied emoji name
 * @param options - The options for formatting an emoji
 */
export function formatEmoji<EmojiId extends Snowflake, EmojiName extends string>(
	options: FormatEmojiOptions<EmojiId, EmojiName>,
): `<:${EmojiName}:${EmojiId}>` | `<a:${EmojiName}:${EmojiId}>`;

export function formatEmoji<EmojiId extends Snowflake, EmojiName extends string>(
	emojiIdOrOptions: EmojiId | FormatEmojiOptions<EmojiId, EmojiName>,
	animated?: boolean,
): `<:${string}:${EmojiId}>` | `<a:${string}:${EmojiId}>` {
	const options =
		typeof emojiIdOrOptions === 'string'
			? {
					id: emojiIdOrOptions,
					animated: animated ?? false,
				}
			: emojiIdOrOptions;

	const { id, animated: isAnimated, name: emojiName } = options;

	return `<${isAnimated ? 'a' : ''}:${emojiName ?? '_'}:${id}>`;
}

/**
 * The options for formatting an emoji.
 *
 * @typeParam EmojiId - This is inferred by the supplied emoji id
 * @typeParam EmojiName - This is inferred by the supplied emoji name
 */
export interface FormatEmojiOptions<EmojiId extends Snowflake, EmojiName extends string> {
	/**
	 * Whether the emoji is animated
	 */
	animated?: boolean;
	/**
	 * The emoji id to format
	 */
	id: EmojiId;
	/**
	 * The name of the emoji
	 */
	name?: EmojiName;
}

/**
 * Formats a channel link for a direct message channel.
 *
 * @typeParam ChannelId - This is inferred by the supplied channel id
 * @param channelId - The channel's id
 */
export function channelLink<ChannelId extends Snowflake>(
	channelId: ChannelId,
): `https://discord.com/channels/@me/${ChannelId}`;

/**
 * Formats a channel link for a guild channel.
 *
 * @typeParam ChannelId - This is inferred by the supplied channel id
 * @typeParam GuildId - This is inferred by the supplied guild id
 * @param channelId - The channel's id
 * @param guildId - The guild's id
 */
export function channelLink<ChannelId extends Snowflake, GuildId extends Snowflake>(
	channelId: ChannelId,
	guildId: GuildId,
): `https://discord.com/channels/${GuildId}/${ChannelId}`;

export function channelLink<ChannelId extends Snowflake, GuildId extends Snowflake>(
	channelId: ChannelId,
	guildId?: GuildId,
): `https://discord.com/channels/@me/${ChannelId}` | `https://discord.com/channels/${GuildId}/${ChannelId}` {
	return `https://discord.com/channels/${guildId ?? '@me'}/${channelId}`;
}

/**
 * Formats a message link for a direct message channel.
 *
 * @typeParam ChannelId - This is inferred by the supplied channel id
 * @typeParam MessageId - This is inferred by the supplied message id
 * @param channelId - The channel's id
 * @param messageId - The message's id
 */
export function messageLink<ChannelId extends Snowflake, MessageId extends Snowflake>(
	channelId: ChannelId,
	messageId: MessageId,
): `https://discord.com/channels/@me/${ChannelId}/${MessageId}`;

/**
 * Formats a message link for a guild channel.
 *
 * @typeParam ChannelId - This is inferred by the supplied channel id
 * @typeParam MessageId - This is inferred by the supplied message id
 * @typeParam GuildId - This is inferred by the supplied guild id
 * @param channelId - The channel's id
 * @param messageId - The message's id
 * @param guildId - The guild's id
 */
export function messageLink<ChannelId extends Snowflake, MessageId extends Snowflake, GuildId extends Snowflake>(
	channelId: ChannelId,
	messageId: MessageId,
	guildId: GuildId,
): `https://discord.com/channels/${GuildId}/${ChannelId}/${MessageId}`;

export function messageLink<ChannelId extends Snowflake, MessageId extends Snowflake, GuildId extends Snowflake>(
	channelId: ChannelId,
	messageId: MessageId,
	guildId?: GuildId,
):
	| `https://discord.com/channels/@me/${ChannelId}/${MessageId}`
	| `https://discord.com/channels/${GuildId}/${ChannelId}/${MessageId}` {
	return `${guildId === undefined ? channelLink(channelId) : channelLink(channelId, guildId)}/${messageId}`;
}

/**
 * The heading levels for expanded markdown.
 */
export enum HeadingLevel {
	/**
	 * The first heading level.
	 */
	One = 1,
	/**
	 * The second heading level.
	 */
	Two,
	/**
	 * The third heading level.
	 */
	Three,
}

/**
 * Formats the content into a heading level.
 *
 * @typeParam Content - This is inferred by the supplied content
 * @param content - The content to wrap
 * @param level - The heading level
 */
export function heading<Content extends string>(content: Content, level?: HeadingLevel.One): `# ${Content}`;

/**
 * Formats the content into a heading level.
 *
 * @typeParam Content - This is inferred by the supplied content
 * @param content - The content to wrap
 * @param level - The heading level
 */
export function heading<Content extends string>(content: Content, level: HeadingLevel.Two): `## ${Content}`;

/**
 * Formats the content into a heading level.
 *
 * @typeParam Content - This is inferred by the supplied content
 * @param content - The content to wrap
 * @param level - The heading level
 */
export function heading<Content extends string>(content: Content, level: HeadingLevel.Three): `### ${Content}`;

export function heading(content: string, level?: HeadingLevel) {
	switch (level) {
		case HeadingLevel.Three:
			return `### ${content}`;
		case HeadingLevel.Two:
			return `## ${content}`;
		default:
			return `# ${content}`;
	}
}

/**
 * A type that recursively traverses into arrays.
 */
export type RecursiveArray<ItemType> = readonly (ItemType | RecursiveArray<ItemType>)[];

/**
 * Callback function for list formatters.
 *
 * @internal
 */
function listCallback(element: RecursiveArray<string>, startNumber?: number, depth = 0): string {
	if (Array.isArray(element)) {
		return element.map((element) => listCallback(element, startNumber, depth + 1)).join('\n');
	}

	return `${'  '.repeat(depth - 1)}${startNumber ? `${startNumber}.` : '-'} ${element}`;
}

/**
 * Formats the elements in the array to an ordered list.
 *
 * @param list - The array of elements to list
 * @param startNumber - The starting number for the list
 */
export function orderedList(list: RecursiveArray<string>, startNumber = 1): string {
	return listCallback(list, Math.max(startNumber, 1));
}

/**
 * Formats the elements in the array to an unordered list.
 *
 * @param list - The array of elements to list
 */
export function unorderedList(list: RecursiveArray<string>): string {
	return listCallback(list);
}

/**
 * Formats a date into a short date-time string.
 *
 * @param date - The date to format. Defaults to the current time
 */
export function time(date?: Date): `<t:${bigint}>`;

/**
 * Formats a date given a format style.
 *
 * @typeParam Style - This is inferred by the supplied {@link TimestampStylesString}
 * @param date - The date to format
 * @param style - The style to use
 */
export function time<Style extends TimestampStylesString>(date: Date, style: Style): `<t:${bigint}:${Style}>`;

/**
 * Formats the given timestamp into a short date-time string.
 *
 * @typeParam Seconds - This is inferred by the supplied timestamp
 * @param seconds - A Unix timestamp in seconds
 */
export function time<Seconds extends number>(seconds: Seconds): `<t:${Seconds}>`;

/**
 * Formats the given timestamp into a short date-time string.
 *
 * @typeParam Seconds - This is inferred by the supplied timestamp
 * @typeParam Style - This is inferred by the supplied {@link TimestampStylesString}
 * @param seconds - A Unix timestamp in seconds
 * @param style - The style to use
 */
export function time<Seconds extends number, Style extends TimestampStylesString>(
	seconds: Seconds,
	style: Style,
): `<t:${Seconds}:${Style}>`;

export function time(timeOrSeconds?: Date | number, style?: TimestampStylesString): string {
	if (typeof timeOrSeconds !== 'number') {
		// eslint-disable-next-line no-param-reassign
		timeOrSeconds = Math.floor((timeOrSeconds?.getTime() ?? Date.now()) / 1_000);
	}

	return typeof style === 'string' ? `<t:${timeOrSeconds}:${style}>` : `<t:${timeOrSeconds}>`;
}

/**
 * The {@link https://discord.com/developers/docs/reference#message-formatting-timestamp-styles | message formatting timestamp styles}
 * supported by Discord.
 */
export const TimestampStyles = {
	/**
	 * Short time format, consisting of hours and minutes.
	 *
	 * @example `16:20`
	 */
	ShortTime: 't',

	/**
	 * Long time format, consisting of hours, minutes, and seconds.
	 *
	 * @example `16:20:30`
	 */
	LongTime: 'T',

	/**
	 * Short date format, consisting of day, month, and year.
	 *
	 * @example `20/04/2021`
	 */
	ShortDate: 'd',

	/**
	 * Long date format, consisting of day, month, and year.
	 *
	 * @example `20 April 2021`
	 */
	LongDate: 'D',

	/**
	 * Short date-time format, consisting of short date and short time formats.
	 *
	 * @example `20 April 2021 16:20`
	 */
	ShortDateTime: 'f',

	/**
	 * Long date-time format, consisting of long date and short time formats.
	 *
	 * @example `Tuesday, 20 April 2021 16:20`
	 */
	LongDateTime: 'F',

	/**
	 * Relative time format, consisting of a relative duration format.
	 *
	 * @example `2 months ago`
	 */
	RelativeTime: 'R',
} as const satisfies Record<string, string>;

/**
 * The possible {@link TimestampStyles} values.
 */
export type TimestampStylesString = (typeof TimestampStyles)[keyof typeof TimestampStyles];

/**
 * All the available faces from Discord's native slash commands.
 */
export enum Faces {
	/**
	 * `¯\_(ツ)_/¯`
	 */
	Shrug = '¯\\_(ツ)_/¯',

	/**
	 * `(╯°□°)╯︵ ┻━┻`
	 */
	Tableflip = '(╯°□°)╯︵ ┻━┻',

	/**
	 * `┬─┬ノ( º _ ºノ)`
	 */
	Unflip = '┬─┬ノ( º _ ºノ)',
}

/**
 * All the available guild navigation mentions.
 */
export enum GuildNavigationMentions {
	/**
	 * Browse Channels tab.
	 */
	Browse = '<id:browse>',
	/**
	 * Customize tab with the server's {@link https://discord.com/developers/docs/resources/guild#guild-onboarding-object | onboarding prompts}.
	 */
	Customize = '<id:customize>',
	/**
	 * {@link https://support.discord.com/hc/articles/13497665141655 | Server Guide} tab.
	 */
	Guide = '<id:guide>',
}
