import type { RestOrArray } from '../../../../util/normalizeArray.js';
import { normalizeArray } from '../../../../util/normalizeArray.js';
import { resolveBuilder } from '../../../../util/resolveBuilder.js';
import {
	ChatInputCommandSubcommandGroupBuilder,
	ChatInputCommandSubcommandBuilder,
} from '../ChatInputCommandSubcommands.js';

export interface SharedChatInputCommandSubcommandsData {
	options?: (ChatInputCommandSubcommandBuilder | ChatInputCommandSubcommandGroupBuilder)[];
}

/**
 * This mixin holds symbols that can be shared in chat input subcommands.
 *
 * @typeParam TypeAfterAddingSubcommands - The type this class should return after adding a subcommand or subcommand group.
 */
export class SharedChatInputCommandSubcommands {
	protected declare readonly data: SharedChatInputCommandSubcommandsData;

	/**
	 * Adds subcommand groups to this command.
	 *
	 * @param input - Subcommand groups to add
	 */
	public addSubcommandGroups(
		...input: RestOrArray<
			| ChatInputCommandSubcommandGroupBuilder
			| ((subcommandGroup: ChatInputCommandSubcommandGroupBuilder) => ChatInputCommandSubcommandGroupBuilder)
		>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((value) => resolveBuilder(value, ChatInputCommandSubcommandGroupBuilder));

		this.data.options ??= [];
		this.data.options.push(...resolved);

		return this;
	}

	/**
	 * Adds subcommands to this command.
	 *
	 * @param input - Subcommands to add
	 */
	public addSubcommands(
		...input: RestOrArray<
			| ChatInputCommandSubcommandBuilder
			| ((subcommandGroup: ChatInputCommandSubcommandBuilder) => ChatInputCommandSubcommandBuilder)
		>
	): this {
		const normalized = normalizeArray(input);
		const resolved = normalized.map((value) => resolveBuilder(value, ChatInputCommandSubcommandBuilder));

		this.data.options ??= [];
		this.data.options.push(...resolved);

		return this;
	}
}
