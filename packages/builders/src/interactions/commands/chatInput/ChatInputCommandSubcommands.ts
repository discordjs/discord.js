import type { JSONEncodable } from '@discordjs/util';
import type {
	APIApplicationCommandSubcommandOption,
	APIApplicationCommandSubcommandGroupOption,
} from 'discord-api-types/v10';
import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import { Mixin } from 'ts-mixer';
import { normalizeArray, type RestOrArray } from '../../../util/normalizeArray.js';
import { resolveBuilder } from '../../../util/resolveBuilder.js';
import { validate } from '../../../util/validation.js';
import type { SharedNameAndDescriptionData } from '../SharedNameAndDescription.js';
import { SharedNameAndDescription } from '../SharedNameAndDescription.js';
import { chatInputCommandSubcommandGroupPredicate, chatInputCommandSubcommandPredicate } from './Assertions.js';
import { SharedChatInputCommandOptions } from './mixins/SharedChatInputCommandOptions.js';

export interface ChatInputCommandSubcommandGroupData {
	options?: ChatInputCommandSubcommandBuilder[];
}

/**
 * Represents a folder for subcommands.
 *
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups}
 */
export class ChatInputCommandSubcommandGroupBuilder
	extends SharedNameAndDescription
	implements JSONEncodable<APIApplicationCommandSubcommandGroupOption>
{
	protected declare readonly data: ChatInputCommandSubcommandGroupData & SharedNameAndDescriptionData;

	public get options(): readonly ChatInputCommandSubcommandBuilder[] {
		return (this.data.options ??= []);
	}

	/**
	 * Adds a new subcommand to this group.
	 *
	 * @param input - A function that returns a subcommand builder or an already built builder
	 */
	public addSubcommands(
		...input: RestOrArray<
			| ChatInputCommandSubcommandBuilder
			| ((subcommandGroup: ChatInputCommandSubcommandBuilder) => ChatInputCommandSubcommandBuilder)
		>
	) {
		const normalized = normalizeArray(input);
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		const result = normalized.map((builder) => resolveBuilder(builder, ChatInputCommandSubcommandBuilder));

		this.data.options ??= [];
		this.data.options.push(...result);

		return this;
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public toJSON(validationOverride?: boolean): APIApplicationCommandSubcommandGroupOption {
		const { options, ...rest } = this.data;

		const data = {
			...(structuredClone(rest) as Omit<APIApplicationCommandSubcommandGroupOption, 'type'>),
			type: ApplicationCommandOptionType.SubcommandGroup as const,
			options: options?.map((option) => option.toJSON(validationOverride)) ?? [],
		};

		validate(chatInputCommandSubcommandGroupPredicate, data, validationOverride);

		return data;
	}
}

/**
 * A builder that creates API-compatible JSON data for chat input command subcommands.
 *
 * @see {@link https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups}
 */
export class ChatInputCommandSubcommandBuilder
	extends Mixin(SharedNameAndDescription, SharedChatInputCommandOptions)
	implements JSONEncodable<APIApplicationCommandSubcommandOption>
{
	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public toJSON(validationOverride?: boolean): APIApplicationCommandSubcommandOption {
		const { options, ...rest } = this.data;

		const data = {
			...(structuredClone(rest) as Omit<APIApplicationCommandSubcommandOption, 'type'>),
			type: ApplicationCommandOptionType.Subcommand as const,
			options: options?.map((option) => option.toJSON(validationOverride)) ?? [],
		};

		validate(chatInputCommandSubcommandPredicate, data, validationOverride);

		return data;
	}
}
