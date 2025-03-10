import type { JSONEncodable } from '@discordjs/util';
import type {
	APIActionRowComponent,
	APIAllowedMentions,
	APIAttachment,
	APIEmbed,
	APIMessageActionRowComponent,
	APIMessageReference,
	APIPoll,
	RESTPostAPIChannelMessageJSONBody,
	Snowflake,
} from 'discord-api-types/v10';
import { ActionRowBuilder } from '../components/ActionRow.js';
import { normalizeArray, type RestOrArray } from '../util/normalizeArray.js';
import { resolveBuilder } from '../util/resolveBuilder.js';
import { validate } from '../util/validation.js';
import { AllowedMentionsBuilder } from './AllowedMentions.js';
import { messagePredicate } from './Assertions.js';
import { AttachmentBuilder } from './Attachment.js';
import { MessageReferenceBuilder } from './MessageReference.js';
import { EmbedBuilder } from './embed/Embed.js';
import { PollBuilder } from './poll/Poll.js';

export interface MessageBuilderData
	extends Partial<
		Omit<
			RESTPostAPIChannelMessageJSONBody,
			'allowed_mentions' | 'attachments' | 'components' | 'embeds' | 'message_reference' | 'poll'
		>
	> {
	allowed_mentions?: AllowedMentionsBuilder;
	attachments: AttachmentBuilder[];
	components?: ActionRowBuilder[];
	embeds: EmbedBuilder[];
	message_reference?: MessageReferenceBuilder;
	poll?: PollBuilder;
}

export class MessageBuilder implements JSONEncodable<RESTPostAPIChannelMessageJSONBody> {
	/**
	 * The API data associated with this message.
	 */
	private readonly data: MessageBuilderData;

	/**
	 * Gets the attachments of this message.
	 */
	public get attachments(): readonly AttachmentBuilder[] {
		return this.data.attachments;
	}

	/**
	 * Gets the components of this message.
	 */
	public get components(): readonly ActionRowBuilder[] {
		return this.data.components ?? [];
	}

	/**
	 * Gets the embeds of this message.
	 */
	public get embeds(): readonly EmbedBuilder[] {
		return this.data.embeds;
	}

	/**
	 * Creates new attachment builder from API data.
	 *
	 * @param data - The API data to create this attachment with
	 */
	public constructor(data: Partial<RESTPostAPIChannelMessageJSONBody> = {}) {
		this.data = {
			...structuredClone(data),
			allowed_mentions: data.allowed_mentions ? new AllowedMentionsBuilder(data.allowed_mentions) : undefined,
			attachments: data.attachments?.map((attachment) => new AttachmentBuilder(attachment)) ?? [],
			embeds: data.embeds?.map((embed) => new EmbedBuilder(embed)) ?? [],
			poll: data.poll ? new PollBuilder(data.poll) : undefined,
			components: data.components?.map((component) => new ActionRowBuilder(component)) ?? [],
			message_reference: data.message_reference ? new MessageReferenceBuilder(data.message_reference) : undefined,
		};
	}

	/**
	 * Sets the content of the message.
	 *
	 * @param content - The content to set
	 */
	public setContent(content: string): this {
		this.data.content = content;
		return this;
	}

	/**
	 * Clears the content of the message.
	 */
	public clearContent(): this {
		this.data.content = undefined;
		return this;
	}

	/**
	 * Sets the nonce of the message.
	 *
	 * @param nonce - The nonce to set
	 */
	public setNonce(nonce: number | string): this {
		this.data.nonce = nonce;
		return this;
	}

	/**
	 * Clears the nonce of the message.
	 */
	public clearNonce(): this {
		this.data.nonce = undefined;
		return this;
	}

	/**
	 * Sets weather the message is TTS.
	 */
	public setTTS(tts = true): this {
		this.data.tts = tts;
		return this;
	}

	/**
	 * Appends embeds to this message.
	 *
	 * @remarks
	 * The maximum amount of embeds that can be added is 10.
	 * @example
	 * Using an array:
	 * ```ts
	 * const embeds: APIEmbed[] = ...;
	 * const messsage = new MessageBuilder()
	 * 	.addEmbeds(embeds);
	 * ```
	 * @example
	 * Using rest parameters (variadic):
	 * ```ts
	 * const message = new MessageBuilder()
	 * 	.addEmbeds(
	 * 		{ title: 'Embed 1' },
	 * 		{ title: 'Embed 2' },
	 * 	);
	 * ```
	 * @param embeds - The embeds to add
	 */
	public addEmbeds(...embeds: RestOrArray<APIEmbed | EmbedBuilder | ((builder: EmbedBuilder) => EmbedBuilder)>): this {
		this.data.embeds ??= [];

		const resolved = normalizeArray(embeds).map((embed) => resolveBuilder(embed, EmbedBuilder));
		this.data.embeds.push(...resolved);

		return this;
	}

	/**
	 * Removes, replaces, or inserts embeds for this message.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
	 *
	 * It's useful for modifying and adjusting order of the already-existing embeds of a message.
	 * @example
	 * Remove the first embed:
	 * ```ts
	 * message.spliceEmbeds(0, 1);
	 * ```
	 * @example
	 * Remove the first n embeds:
	 * ```ts
	 * const n = 4;
	 * message.spliceEmbeds(0, n);
	 * ```
	 * @example
	 * Remove the last embed:
	 * ```ts
	 * message.spliceEmbeds(-1, 1);
	 * ```
	 * @param start - The index to start at
	 * @param deleteCount - The amount of embeds to remove
	 * @param embeds - The embeds to insert
	 */
	public spliceEmbeds(
		start: number,
		deleteCount: number,
		...embeds: RestOrArray<APIEmbed | EmbedBuilder | ((builder: EmbedBuilder) => EmbedBuilder)>
	): this {
		this.data.embeds ??= [];
		const resolved = normalizeArray(embeds).map((embed) => resolveBuilder(embed, EmbedBuilder));

		this.data.embeds.splice(start, deleteCount, ...resolved);
		return this;
	}

	/**
	 * Sets the allowed mentions for this message.
	 *
	 * @param allowedMentions - The allowed mentions to set
	 */
	public setAllowedMentions(
		allowedMentions:
			| AllowedMentionsBuilder
			| APIAllowedMentions
			| ((builder: AllowedMentionsBuilder) => AllowedMentionsBuilder),
	): this {
		this.data.allowed_mentions = resolveBuilder(allowedMentions, AllowedMentionsBuilder);
		return this;
	}

	/**
	 * Updates the allowed mentions for this message (and creates it if it doesn't exist)
	 *
	 * @param updater - The function to update the allowed mentions with
	 */
	public updateAllowedMentions(updater: (builder: AllowedMentionsBuilder) => AllowedMentionsBuilder): this {
		this.data.allowed_mentions = updater(this.data.allowed_mentions ?? new AllowedMentionsBuilder());
		return this;
	}

	/**
	 * Clears the allowed mentions for this message.
	 */
	public clearAllowedMentions(): this {
		this.data.allowed_mentions = undefined;
		return this;
	}

	/**
	 * Sets the message reference for this message.
	 *
	 * @param reference - The reference to set
	 */
	public setMessageReference(
		reference:
			| APIMessageReference
			| MessageReferenceBuilder
			| ((builder: MessageReferenceBuilder) => MessageReferenceBuilder),
	): this {
		this.data.message_reference = resolveBuilder(reference, MessageReferenceBuilder);
		return this;
	}

	/**
	 * Updates the message reference for this message (and creates it if it doesn't exist)
	 *
	 * @param updater - The function to update the message reference with
	 */
	public updateMessageReference(updater: (builder: MessageReferenceBuilder) => MessageReferenceBuilder): this {
		this.data.message_reference = updater(this.data.message_reference ?? new MessageReferenceBuilder());
		return this;
	}

	/**
	 * Clears the message reference for this message.
	 */
	public clearMessageReference(): this {
		this.data.message_reference = undefined;
		return this;
	}

	/**
	 * Adds components to this message.
	 *
	 * @param components - The components to add
	 */
	public addComponents(
		...components: RestOrArray<
			| ActionRowBuilder
			| APIActionRowComponent<APIMessageActionRowComponent>
			| ((builder: ActionRowBuilder) => ActionRowBuilder)
		>
	): this {
		this.data.components ??= [];

		const resolved = normalizeArray(components).map((component) => resolveBuilder(component, ActionRowBuilder));
		this.data.components.push(...resolved);

		return this;
	}

	/**
	 * Removes, replaces, or inserts components for this message.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
	 *
	 * It's useful for modifying and adjusting order of the already-existing components of a message.
	 * @example
	 * Remove the first component:
	 * ```ts
	 * message.spliceComponents(0, 1);
	 * ```
	 * @example
	 * Remove the first n components:
	 * ```ts
	 * const n = 4;
	 * message.spliceComponents(0, n);
	 * ```
	 * @example
	 * Remove the last component:
	 * ```ts
	 * message.spliceComponents(-1, 1);
	 * ```
	 * @param start - The index to start at
	 * @param deleteCount - The amount of components to remove
	 * @param components - The components to insert
	 */
	public spliceComponents(
		start: number,
		deleteCount: number,
		...components: RestOrArray<
			| ActionRowBuilder
			| APIActionRowComponent<APIMessageActionRowComponent>
			| ((builder: ActionRowBuilder) => ActionRowBuilder)
		>
	): this {
		this.data.components ??= [];
		const resolved = normalizeArray(components).map((component) => resolveBuilder(component, ActionRowBuilder));

		this.data.components.splice(start, deleteCount, ...resolved);
		return this;
	}

	/**
	 * Sets the components of this message.
	 *
	 * @param components - The components to set
	 */
	public setComponents(
		...components: RestOrArray<
			| ActionRowBuilder
			| APIActionRowComponent<APIMessageActionRowComponent>
			| ((builder: ActionRowBuilder) => ActionRowBuilder)
		>
	): this {
		this.data.components = normalizeArray(components).map((component) => resolveBuilder(component, ActionRowBuilder));
		return this;
	}

	/**
	 * Sets the sticker ids of this message.
	 *
	 * @param stickerIds - The ids of the stickers to set
	 */
	public setStickerIds(...stickerIds: RestOrArray<Snowflake>): this {
		this.data.sticker_ids = normalizeArray(stickerIds) as MessageBuilderData['sticker_ids'];
		return this;
	}

	/**
	 * Adds sticker ids to this message.
	 *
	 * @param stickerIds - The ids of the stickers to add
	 */
	public addStickerIds(...stickerIds: RestOrArray<Snowflake>): this {
		this.data.sticker_ids ??= [] as unknown as MessageBuilderData['sticker_ids'];
		this.data.sticker_ids!.push(...normalizeArray(stickerIds));
		return this;
	}

	/**
	 * Removes, replaces, or inserts sticker ids for this message.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
	 *
	 * It's useful for modifying and adjusting order of the already-existing sticker ids of a message.
	 * @example
	 * Remove the first sticker id:
	 * ```ts
	 * message.spliceStickerIds(0, 1);
	 * ```
	 * @example
	 * Remove the first n sticker ids:
	 * ```ts
	 * const n = 4;
	 * message.spliceStickerIds(0, n);
	 * ```
	 * @example
	 * Remove the last sticker id:
	 * ```ts
	 * message.spliceStickerIds(-1, 1);
	 * ```
	 * @param index - The index to start at
	 * @param deleteCount - The amount of sticker ids to remove
	 * @param stickerIds - The sticker ids to insert
	 */
	public spliceStickerIds(index: number, deleteCount: number, ...stickerIds: RestOrArray<Snowflake>): this {
		this.data.sticker_ids ??= [] as unknown as MessageBuilderData['sticker_ids'];
		this.data.sticker_ids!.splice(index, deleteCount, ...normalizeArray(stickerIds));
		return this;
	}

	/**
	 * Sets attachments for this message.
	 *
	 * @param attachments - The attachments to set
	 */
	public setAttachments(
		...attachments: RestOrArray<APIAttachment | AttachmentBuilder | ((builder: AttachmentBuilder) => AttachmentBuilder)>
	): this {
		const resolved = normalizeArray(attachments).map((attachment) => resolveBuilder(attachment, AttachmentBuilder));
		this.data.attachments = resolved;

		return this;
	}

	/**
	 * Adds attachments to this message.
	 *
	 * @param attachments - The attachments to add
	 */
	public addAttachments(
		...attachments: RestOrArray<APIAttachment | AttachmentBuilder | ((builder: AttachmentBuilder) => AttachmentBuilder)>
	): this {
		const resolved = normalizeArray(attachments).map((attachment) => resolveBuilder(attachment, AttachmentBuilder));
		this.data.attachments.push(...resolved);

		return this;
	}

	/**
	 * Removes, replaces, or inserts attachments for this message.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
	 *
	 * It's useful for modifying and adjusting order of the already-existing attachments of a message.
	 * @example
	 * Remove the first attachment:
	 * ```ts
	 * message.spliceAttachments(0, 1);
	 * ```
	 * @example
	 * Remove the first n attachments:
	 * ```ts
	 * const n = 4;
	 * message.spliceAttachments(0, n);
	 * ```
	 * @example
	 * Remove the last attachment:
	 * ```ts
	 * message.spliceAttachments(-1, 1);
	 * ```
	 * @param start - The index to start at
	 * @param deleteCount - The amount of attachments to remove
	 * @param attachments - The attachments to insert
	 */
	public spliceAttachments(
		start: number,
		deleteCount: number,
		...attachments: RestOrArray<APIAttachment | AttachmentBuilder | ((builder: AttachmentBuilder) => AttachmentBuilder)>
	): this {
		const resolved = normalizeArray(attachments).map((attachment) => resolveBuilder(attachment, AttachmentBuilder));
		this.data.attachments.splice(start, deleteCount, ...resolved);

		return this;
	}

	/**
	 * Sets the flags for this message.
	 */
	public setFlags(flags: number): this {
		this.data.flags = flags;
		return this;
	}

	/**
	 * Clears the flags for this message.
	 */
	public clearFlags(): this {
		this.data.flags = undefined;
		return this;
	}

	/**
	 * Sets enforce_nonce for this message.
	 */
	public setEnforceNonce(enforceNonce = true): this {
		this.data.enforce_nonce = enforceNonce;
		return this;
	}

	/**
	 * Sets the poll for this message.
	 *
	 * @param poll - The poll to set
	 */
	public setPoll(poll: APIPoll | PollBuilder | ((builder: PollBuilder) => PollBuilder)): this {
		this.data.poll = resolveBuilder(poll, PollBuilder);
		return this;
	}

	/**
	 * Updates the poll for this message (and creates it if it doesn't exist)
	 *
	 * @param updater - The function to update the poll with
	 */
	public updatePoll(updater: (builder: PollBuilder) => PollBuilder): this {
		this.data.poll = updater(this.data.poll ?? new PollBuilder());
		return this;
	}

	/**
	 * Clears the poll for this message.
	 */
	public clearPoll(): this {
		this.data.poll = undefined;
		return this;
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public toJSON(validationOverride?: boolean): RESTPostAPIChannelMessageJSONBody {
		const { poll, allowed_mentions, attachments, embeds, components, message_reference, ...rest } = this.data;

		const data = {
			...structuredClone(rest),
			// Covered by the messagePredicate
			poll: this.data.poll?.toJSON(false),
			allowed_mentions: allowed_mentions?.toJSON(false),
			attachments: attachments.map((attachment) => attachment.toJSON(false)),
			embeds: this.data.embeds.map((embed) => embed.toJSON(false)),
			components: this.data.components?.map((component) => component.toJSON(validationOverride)),
			message_reference: message_reference?.toJSON(false),
		};

		validate(messagePredicate, data, validationOverride);

		return data as RESTPostAPIChannelMessageJSONBody;
	}
}
