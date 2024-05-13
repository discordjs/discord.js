import { assertReturnOfBuilder, validateMaxOptionsLength } from '../Assertions.js';
import type { ToAPIApplicationCommandOptions } from '../SlashCommandBuilder.js';
import { SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from '../SlashCommandSubcommands.js';

/**
 * This mixin holds symbols that can be shared in slash subcommands.
 *
 * @typeParam TypeAfterAddingSubcommands - The type this class should return after adding a subcommand or subcommand group.
 */
export class SharedSlashCommandSubcommands<
	TypeAfterAddingSubcommands extends SharedSlashCommandSubcommands<TypeAfterAddingSubcommands>,
> {
	public readonly options: ToAPIApplicationCommandOptions[] = [];

	/**
	 * Adds a new subcommand group to this command.
	 *
	 * @param input - A function that returns a subcommand group builder or an already built builder
	 */
	public addSubcommandGroup(
		input:
			| SlashCommandSubcommandGroupBuilder
			| ((subcommandGroup: SlashCommandSubcommandGroupBuilder) => SlashCommandSubcommandGroupBuilder),
	): TypeAfterAddingSubcommands {
		const { options } = this;

		// First, assert options conditions - we cannot have more than 25 options
		validateMaxOptionsLength(options);

		// Get the final result
		const result = typeof input === 'function' ? input(new SlashCommandSubcommandGroupBuilder()) : input;

		assertReturnOfBuilder(result, SlashCommandSubcommandGroupBuilder);

		// Push it
		options.push(result);

		return this as unknown as TypeAfterAddingSubcommands;
	}

	/**
	 * Adds a new subcommand to this command.
	 *
	 * @param input - A function that returns a subcommand builder or an already built builder
	 */
	public addSubcommand(
		input:
			| SlashCommandSubcommandBuilder
			| ((subcommandGroup: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder),
	): TypeAfterAddingSubcommands {
		const { options } = this;

		// First, assert options conditions - we cannot have more than 25 options
		validateMaxOptionsLength(options);

		// Get the final result
		const result = typeof input === 'function' ? input(new SlashCommandSubcommandBuilder()) : input;

		assertReturnOfBuilder(result, SlashCommandSubcommandBuilder);

		// Push it
		options.push(result);

		return this as unknown as TypeAfterAddingSubcommands;
	}
}
