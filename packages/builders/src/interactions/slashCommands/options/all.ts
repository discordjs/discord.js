import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { SlashCommandAttachmentOption } from './attachment.js';
import { SlashCommandBooleanOption } from './boolean.js';
import { SlashCommandChannelOption } from './channel.js';
import { SlashCommandIntegerOption } from './integer.js';
import { SlashCommandMentionableOption } from './mentionable.js';
import { SlashCommandNumberOption } from './number.js';
import { SlashCommandRoleOption } from './role.js';
import { SlashCommandStringOption } from './string.js';
import { SlashCommandUserOption } from './user.js';

/**
 * The slash command option types as strings.
 */
export type ApplicationCommandOptionStringType =
	| 'attachment'
	| 'boolean'
	| 'channel'
	| 'integer'
	| 'mentionable'
	| 'number'
	| 'role'
	| 'string'
	| 'user';

/**
 * Returns the corresponding slash command option based on the {@link ApplicationCommandOptionType}.
 *
 * @typeParam OptionType - The type of option
 */
export type ApplicationCommandOptionEnumTypeMap<OptionType extends ApplicationCommandOptionType | undefined> =
	OptionType extends ApplicationCommandOptionType.Attachment
		? SlashCommandAttachmentOption
		: OptionType extends ApplicationCommandOptionType.Boolean
			? SlashCommandBooleanOption
			: OptionType extends ApplicationCommandOptionType.Channel
				? SlashCommandChannelOption
				: OptionType extends ApplicationCommandOptionType.Integer
					? SlashCommandIntegerOption
					: OptionType extends ApplicationCommandOptionType.Mentionable
						? SlashCommandMentionableOption
						: OptionType extends ApplicationCommandOptionType.Number
							? SlashCommandNumberOption
							: OptionType extends ApplicationCommandOptionType.Role
								? SlashCommandRoleOption
								: OptionType extends ApplicationCommandOptionType.String
									? SlashCommandStringOption
									: OptionType extends ApplicationCommandOptionType.User
										? SlashCommandUserOption
										: never;

/**
 * Returns the corresponding slash command option based on the string type.
 *
 * @typeParam OptionType - The type of option
 */
export type ApplicationCommandOptionStringTypeMap<OptionType extends ApplicationCommandOptionStringType | undefined> =
	OptionType extends 'attachment'
		? SlashCommandAttachmentOption
		: OptionType extends 'boolean'
			? SlashCommandBooleanOption
			: OptionType extends 'channel'
				? SlashCommandChannelOption
				: OptionType extends 'integer'
					? SlashCommandIntegerOption
					: OptionType extends 'mentionable'
						? SlashCommandMentionableOption
						: OptionType extends 'number'
							? SlashCommandNumberOption
							: OptionType extends 'role'
								? SlashCommandRoleOption
								: OptionType extends 'string'
									? SlashCommandStringOption
									: OptionType extends 'user'
										? SlashCommandUserOption
										: never;

/**
 * Returns the corresponding slash command option based on the type.
 *
 * @typeParam OptionType - The type of option
 */
export type ApplicationCommandOptionTypeMap<
	OptionType extends ApplicationCommandOptionStringType | ApplicationCommandOptionType | undefined,
> = OptionType extends ApplicationCommandOptionType
	? ApplicationCommandOptionEnumTypeMap<OptionType>
	: OptionType extends ApplicationCommandOptionStringType
		? ApplicationCommandOptionStringTypeMap<OptionType>
		: SlashCommandStringOption;

/**
 * Creates and returns the slash command option of the specified type.
 * If no type is specified, it returns {@link SlashCommandStringOption} by default.
 *
 * @param type - The type of option to create
 */
export const createSlashCommandOption = <
	OptionType extends ApplicationCommandOptionStringType | ApplicationCommandOptionType | undefined = 'string',
>(
	type?: OptionType,
) => {
	const typeParam = type ?? ApplicationCommandOptionType.String;
	switch (typeParam) {
		case ApplicationCommandOptionType.Attachment:
			return new SlashCommandAttachmentOption() as ApplicationCommandOptionTypeMap<OptionType>;
		case ApplicationCommandOptionType.Boolean:
			return new SlashCommandBooleanOption() as ApplicationCommandOptionTypeMap<OptionType>;
		case ApplicationCommandOptionType.Channel:
			return new SlashCommandChannelOption() as ApplicationCommandOptionTypeMap<OptionType>;
		case ApplicationCommandOptionType.Integer:
			return new SlashCommandIntegerOption() as ApplicationCommandOptionTypeMap<OptionType>;
		case ApplicationCommandOptionType.Mentionable:
			return new SlashCommandMentionableOption() as ApplicationCommandOptionTypeMap<OptionType>;
		case ApplicationCommandOptionType.Number:
			return new SlashCommandNumberOption() as ApplicationCommandOptionTypeMap<OptionType>;
		case ApplicationCommandOptionType.Role:
			return new SlashCommandRoleOption() as ApplicationCommandOptionTypeMap<OptionType>;
		case ApplicationCommandOptionType.String:
			return new SlashCommandStringOption() as ApplicationCommandOptionTypeMap<OptionType>;
		case ApplicationCommandOptionType.User:
			return new SlashCommandUserOption() as ApplicationCommandOptionTypeMap<OptionType>;
		case 'attachment':
			return new SlashCommandAttachmentOption() as ApplicationCommandOptionTypeMap<OptionType>;
		case 'boolean':
			return new SlashCommandBooleanOption() as ApplicationCommandOptionTypeMap<OptionType>;
		case 'channel':
			return new SlashCommandChannelOption() as ApplicationCommandOptionTypeMap<OptionType>;
		case 'integer':
			return new SlashCommandIntegerOption() as ApplicationCommandOptionTypeMap<OptionType>;
		case 'mentionable':
			return new SlashCommandMentionableOption() as ApplicationCommandOptionTypeMap<OptionType>;
		case 'number':
			return new SlashCommandNumberOption() as ApplicationCommandOptionTypeMap<OptionType>;
		case 'role':
			return new SlashCommandRoleOption() as ApplicationCommandOptionTypeMap<OptionType>;
		case 'string':
			return new SlashCommandStringOption() as ApplicationCommandOptionTypeMap<OptionType>;
		case 'user':
			return new SlashCommandUserOption() as ApplicationCommandOptionTypeMap<OptionType>;
		default:
			throw new Error(`Unsupported option type: ${typeParam}`);
	}
};
