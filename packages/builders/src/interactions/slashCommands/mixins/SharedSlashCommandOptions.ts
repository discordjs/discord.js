import type {
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	APIApplicationCommandSubcommandOption,
} from 'discord-api-types/v10';
import { assertReturnOfBuilder, validateMaxOptionsLength } from '../Assertions.js';
import { SlashCommandAttachmentOption } from '../options/attachment.js';
import { SlashCommandBooleanOption } from '../options/boolean.js';
import { SlashCommandChannelOption } from '../options/channel.js';
import { SlashCommandIntegerOption } from '../options/integer.js';
import { SlashCommandMentionableOption } from '../options/mentionable.js';
import { SlashCommandNumberOption } from '../options/number.js';
import { SlashCommandRoleOption } from '../options/role.js';
import { SlashCommandStringOption } from '../options/string.js';
import { SlashCommandUserOption } from '../options/user.js';
import type { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase.js';

export class SharedSlashCommandOptions<ShouldOmitSubcommandFunctions = true> {
	public readonly data: Partial<
		APIApplicationCommandSubcommandOption | RESTPostAPIChatInputApplicationCommandsJSONBody
	> = {};

	/**
	 * Adds a boolean option
	 *
	 * @param input - A function that returns an option builder, or an already built builder
	 */
	public addBooleanOption(
		input: SlashCommandBooleanOption | ((builder: SlashCommandBooleanOption) => SlashCommandBooleanOption),
	) {
		return this._sharedAddOptionMethod(input, SlashCommandBooleanOption);
	}

	/**
	 * Adds a user option
	 *
	 * @param input - A function that returns an option builder, or an already built builder
	 */
	public addUserOption(input: SlashCommandUserOption | ((builder: SlashCommandUserOption) => SlashCommandUserOption)) {
		return this._sharedAddOptionMethod(input, SlashCommandUserOption);
	}

	/**
	 * Adds a channel option
	 *
	 * @param input - A function that returns an option builder, or an already built builder
	 */
	public addChannelOption(
		input: SlashCommandChannelOption | ((builder: SlashCommandChannelOption) => SlashCommandChannelOption),
	) {
		return this._sharedAddOptionMethod(input, SlashCommandChannelOption);
	}

	/**
	 * Adds a role option
	 *
	 * @param input - A function that returns an option builder, or an already built builder
	 */
	public addRoleOption(input: SlashCommandRoleOption | ((builder: SlashCommandRoleOption) => SlashCommandRoleOption)) {
		return this._sharedAddOptionMethod(input, SlashCommandRoleOption);
	}

	/**
	 * Adds an attachment option
	 *
	 * @param input - A function that returns an option builder, or an already built builder
	 */
	public addAttachmentOption(
		input: SlashCommandAttachmentOption | ((builder: SlashCommandAttachmentOption) => SlashCommandAttachmentOption),
	) {
		return this._sharedAddOptionMethod(input, SlashCommandAttachmentOption);
	}

	/**
	 * Adds a mentionable option
	 *
	 * @param input - A function that returns an option builder, or an already built builder
	 */
	public addMentionableOption(
		input: SlashCommandMentionableOption | ((builder: SlashCommandMentionableOption) => SlashCommandMentionableOption),
	) {
		return this._sharedAddOptionMethod(input, SlashCommandMentionableOption);
	}

	/**
	 * Adds a string option
	 *
	 * @param input - A function that returns an option builder, or an already built builder
	 */
	public addStringOption(
		input:
			| Omit<SlashCommandStringOption, 'addChoices'>
			| Omit<SlashCommandStringOption, 'setAutocomplete'>
			| SlashCommandStringOption
			| ((
					builder: SlashCommandStringOption,
			  ) =>
					| Omit<SlashCommandStringOption, 'addChoices'>
					| Omit<SlashCommandStringOption, 'setAutocomplete'>
					| SlashCommandStringOption),
	) {
		return this._sharedAddOptionMethod(input, SlashCommandStringOption);
	}

	/**
	 * Adds an integer option
	 *
	 * @param input - A function that returns an option builder, or an already built builder
	 */
	public addIntegerOption(
		input:
			| Omit<SlashCommandIntegerOption, 'addChoices'>
			| Omit<SlashCommandIntegerOption, 'setAutocomplete'>
			| SlashCommandIntegerOption
			| ((
					builder: SlashCommandIntegerOption,
			  ) =>
					| Omit<SlashCommandIntegerOption, 'addChoices'>
					| Omit<SlashCommandIntegerOption, 'setAutocomplete'>
					| SlashCommandIntegerOption),
	) {
		return this._sharedAddOptionMethod(input, SlashCommandIntegerOption);
	}

	/**
	 * Adds a number option
	 *
	 * @param input - A function that returns an option builder, or an already built builder
	 */
	public addNumberOption(
		input:
			| Omit<SlashCommandNumberOption, 'addChoices'>
			| Omit<SlashCommandNumberOption, 'setAutocomplete'>
			| SlashCommandNumberOption
			| ((
					builder: SlashCommandNumberOption,
			  ) =>
					| Omit<SlashCommandNumberOption, 'addChoices'>
					| Omit<SlashCommandNumberOption, 'setAutocomplete'>
					| SlashCommandNumberOption),
	) {
		return this._sharedAddOptionMethod(input, SlashCommandNumberOption);
	}

	private _sharedAddOptionMethod<T extends ApplicationCommandOptionBase>(
		input:
			| Omit<T, 'addChoices'>
			| Omit<T, 'setAutocomplete'>
			| T
			| ((builder: T) => Omit<T, 'addChoices'> | Omit<T, 'setAutocomplete'> | T),
		Instance: new () => T,
	): ShouldOmitSubcommandFunctions extends true ? Omit<this, 'addSubcommand' | 'addSubcommandGroup'> : this {
		if (!('options' in this.data)) this.data.options = [];
		const { options } = this.data;

		// First, assert options conditions - we cannot have more than 25 options
		validateMaxOptionsLength(options);

		// Get the final result
		const result = typeof input === 'function' ? input(new Instance()) : input;

		assertReturnOfBuilder(result, Instance);

		// Push it
		options.push(result);

		return this;
	}
}
