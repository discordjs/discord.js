import { normalizeArray, type RestOrArray } from '../../../../util/normalizeArray.js';
import { resolveBuilder } from '../../../../util/resolveBuilder.js';
import type { ApplicationCommandOptionBase } from '../options/ApplicationCommandOptionBase.js';
import { ChatInputCommandAttachmentOption } from '../options/attachment.js';
import { ChatInputCommandBooleanOption } from '../options/boolean.js';
import { ChatInputCommandChannelOption } from '../options/channel.js';
import { ChatInputCommandIntegerOption } from '../options/integer.js';
import { ChatInputCommandMentionableOption } from '../options/mentionable.js';
import { ChatInputCommandNumberOption } from '../options/number.js';
import { ChatInputCommandRoleOption } from '../options/role.js';
import { ChatInputCommandStringOption } from '../options/string.js';
import { ChatInputCommandUserOption } from '../options/user.js';

export interface SharedChatInputCommandOptionsData {
	options?: ApplicationCommandOptionBase[];
}

/**
 * This mixin holds symbols that can be shared in chat input command options.
 *
 * @typeParam TypeAfterAddingOptions - The type this class should return after adding an option.
 */
export class SharedChatInputCommandOptions {
	protected declare readonly data: SharedChatInputCommandOptionsData;

	public get options(): readonly ApplicationCommandOptionBase[] {
		return (this.data.options ??= []);
	}

	/**
	 * Adds boolean options.
	 *
	 * @param options - Options to add
	 */
	public addBooleanOptions(
		...options: RestOrArray<
			ChatInputCommandBooleanOption | ((builder: ChatInputCommandBooleanOption) => ChatInputCommandBooleanOption)
		>
	) {
		return this.sharedAddOptions(ChatInputCommandBooleanOption, ...options);
	}

	/**
	 * Adds user options.
	 *
	 * @param options - Options to add
	 */
	public addUserOptions(
		...options: RestOrArray<
			ChatInputCommandUserOption | ((builder: ChatInputCommandUserOption) => ChatInputCommandUserOption)
		>
	) {
		return this.sharedAddOptions(ChatInputCommandUserOption, ...options);
	}

	/**
	 * Adds channel options.
	 *
	 * @param options - Options to add
	 */
	public addChannelOptions(
		...options: RestOrArray<
			ChatInputCommandChannelOption | ((builder: ChatInputCommandChannelOption) => ChatInputCommandChannelOption)
		>
	) {
		return this.sharedAddOptions(ChatInputCommandChannelOption, ...options);
	}

	/**
	 * Adds role options.
	 *
	 * @param options - Options to add
	 */
	public addRoleOptions(
		...options: RestOrArray<
			ChatInputCommandRoleOption | ((builder: ChatInputCommandRoleOption) => ChatInputCommandRoleOption)
		>
	) {
		return this.sharedAddOptions(ChatInputCommandRoleOption, ...options);
	}

	/**
	 * Adds attachment options.
	 *
	 * @param options - Options to add
	 */
	public addAttachmentOptions(
		...options: RestOrArray<
			| ChatInputCommandAttachmentOption
			| ((builder: ChatInputCommandAttachmentOption) => ChatInputCommandAttachmentOption)
		>
	) {
		return this.sharedAddOptions(ChatInputCommandAttachmentOption, ...options);
	}

	/**
	 * Adds mentionable options.
	 *
	 * @param options - Options to add
	 */
	public addMentionableOptions(
		...options: RestOrArray<
			| ChatInputCommandMentionableOption
			| ((builder: ChatInputCommandMentionableOption) => ChatInputCommandMentionableOption)
		>
	) {
		return this.sharedAddOptions(ChatInputCommandMentionableOption, ...options);
	}

	/**
	 * Adds string options.
	 *
	 * @param options - Options to add
	 */
	public addStringOptions(
		...options: RestOrArray<
			ChatInputCommandStringOption | ((builder: ChatInputCommandStringOption) => ChatInputCommandStringOption)
		>
	) {
		return this.sharedAddOptions(ChatInputCommandStringOption, ...options);
	}

	/**
	 * Adds integer options.
	 *
	 * @param options - Options to add
	 */
	public addIntegerOptions(
		...options: RestOrArray<
			ChatInputCommandIntegerOption | ((builder: ChatInputCommandIntegerOption) => ChatInputCommandIntegerOption)
		>
	) {
		return this.sharedAddOptions(ChatInputCommandIntegerOption, ...options);
	}

	/**
	 * Adds number options.
	 *
	 * @param options - Options to add
	 */
	public addNumberOptions(
		...options: RestOrArray<
			ChatInputCommandNumberOption | ((builder: ChatInputCommandNumberOption) => ChatInputCommandNumberOption)
		>
	) {
		return this.sharedAddOptions(ChatInputCommandNumberOption, ...options);
	}

	/**
	 * Removes, replaces, or inserts options for this command.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
	 *
	 * It's useful for modifying and adjusting order of the already-existing options for this command.
	 * @example
	 * Remove the first option:
	 * ```ts
	 * actionRow.spliceOptions(0, 1);
	 * ```
	 * @example
	 * Remove the first n options:
	 * ```ts
	 * const n = 4;
	 * actionRow.spliceOptions(0, n);
	 * ```
	 * @example
	 * Remove the last option:
	 * ```ts
	 * actionRow.spliceOptions(-1, 1);
	 * ```
	 * @param index - The index to start at
	 * @param deleteCount - The number of options to remove
	 * @param options - The replacing option objects
	 */
	public spliceOptions(index: number, deleteCount: number, ...options: ApplicationCommandOptionBase[]): this {
		this.data.options ??= [];
		this.data.options.splice(index, deleteCount, ...options);
		return this;
	}

	/**
	 * Where the actual adding magic happens. ✨
	 *
	 * @internal
	 */
	private sharedAddOptions<OptionBuilder extends ApplicationCommandOptionBase>(
		Instance: new () => OptionBuilder,
		...options: RestOrArray<OptionBuilder | ((builder: OptionBuilder) => OptionBuilder)>
	): this {
		const normalized = normalizeArray(options);
		const resolved = normalized.map((option) => resolveBuilder(option, Instance));

		this.data.options ??= [];
		this.data.options.push(...resolved);

		return this;
	}
}
