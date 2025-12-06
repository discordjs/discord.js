import type { FileBodyEncodable, FileBodyEncodableResult, JSONEncodable, RawFile } from '@discordjs/util';
import type {
	APIActionRowComponent,
	APIAllowedMentions,
	APIAttachment,
	APIEmbed,
	APIComponentInMessageActionRow,
	APIMessageReference,
	APIPoll,
	RESTPostAPIChannelMessageJSONBody,
	Snowflake,
	MessageFlags,
	APIContainerComponent,
	APIFileComponent,
	APIMediaGalleryComponent,
	APISectionComponent,
	APISeparatorComponent,
	APITextDisplayComponent,
	APIMessageTopLevelComponent,
} from 'discord-api-types/v10';
import { ActionRowBuilder } from '../components/ActionRow.js';
import { ComponentBuilder } from '../components/Component.js';
import type { MessageTopLevelComponentBuilder } from '../components/Components.js';
import { createComponentBuilder } from '../components/Components.js';
import { ContainerBuilder } from '../components/v2/Container.js';
import { FileBuilder } from '../components/v2/File.js';
import { MediaGalleryBuilder } from '../components/v2/MediaGallery.js';
import { SectionBuilder } from '../components/v2/Section.js';
import { SeparatorBuilder } from '../components/v2/Separator.js';
import { TextDisplayBuilder } from '../components/v2/TextDisplay.js';
import { normalizeArray, type RestOrArray } from '../util/normalizeArray.js';
import { resolveBuilder } from '../util/resolveBuilder.js';
import { validate } from '../util/validation.js';
import { AllowedMentionsBuilder } from './AllowedMentions.js';
import { fileBodyMessagePredicate, messagePredicate } from './Assertions.js';
import { AttachmentBuilder } from './Attachment.js';
import { MessageReferenceBuilder } from './MessageReference.js';
import { EmbedBuilder } from './embed/Embed.js';
import { PollBuilder } from './poll/Poll.js';

export interface MessageBuilderData extends Partial<
	Omit<
		RESTPostAPIChannelMessageJSONBody,
		'allowed_mentions' | 'attachments' | 'components' | 'embeds' | 'message_reference' | 'poll'
	>
> {
	allowed_mentions?: AllowedMentionsBuilder;
	attachments: AttachmentBuilder[];
	components: MessageTopLevelComponentBuilder[];
	embeds: EmbedBuilder[];
	message_reference?: MessageReferenceBuilder;
	poll?: PollBuilder;
}

/**
 * A builder that creates API-compatible JSON data for messages.
 */
export class MessageBuilder
	implements JSONEncodable<RESTPostAPIChannelMessageJSONBody>, FileBodyEncodable<RESTPostAPIChannelMessageJSONBody>
{
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
	public get components(): readonly MessageTopLevelComponentBuilder[] {
		return this.data.components;
	}

	/**
	 * Gets the embeds of this message.
	 */
	public get embeds(): readonly EmbedBuilder[] {
		return this.data.embeds;
	}

	/**
	 * Creates a new message builder.
	 *
	 * @param data - The API data to create this message with
	 */
	public constructor(data: Partial<RESTPostAPIChannelMessageJSONBody> = {}) {
		const { attachments = [], embeds = [], components = [], message_reference, poll, allowed_mentions, ...rest } = data;

		this.data = {
			...structuredClone(rest),
			allowed_mentions: allowed_mentions && new AllowedMentionsBuilder(allowed_mentions),
			attachments: attachments.map((attachment) => new AttachmentBuilder(attachment)),
			embeds: embeds.map((embed) => new EmbedBuilder(embed)),
			poll: poll && new PollBuilder(poll),
			components: components.map((component) => createComponentBuilder(component)),
			message_reference: message_reference && new MessageReferenceBuilder(message_reference),
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
	 * Sets whether the message is TTS.
	 *
	 * @param tts - Whether the message is TTS
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
	 * const message = new MessageBuilder()
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
	 * to {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
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
	 * Sets the embeds for this message.
	 *
	 * @param embeds - The embeds to set
	 */
	public setEmbeds(...embeds: RestOrArray<APIEmbed | EmbedBuilder | ((builder: EmbedBuilder) => EmbedBuilder)>): this {
		return this.spliceEmbeds(0, this.embeds.length, ...normalizeArray(embeds));
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
	public updateAllowedMentions(updater: (builder: AllowedMentionsBuilder) => void): this {
		updater((this.data.allowed_mentions ??= new AllowedMentionsBuilder()));
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
	public updateMessageReference(updater: (builder: MessageReferenceBuilder) => void): this {
		updater((this.data.message_reference ??= new MessageReferenceBuilder()));
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
	 * Adds action row components to this message.
	 *
	 * @param components - The action row components to add
	 */
	public addActionRowComponents(
		...components: RestOrArray<
			| ActionRowBuilder
			| APIActionRowComponent<APIComponentInMessageActionRow>
			| ((builder: ActionRowBuilder) => ActionRowBuilder)
		>
	): this {
		this.data.components ??= [];

		const resolved = normalizeArray(components).map((component) => resolveBuilder(component, ActionRowBuilder));
		this.data.components.push(...resolved);

		return this;
	}

	/**
	 * Adds container components to this message.
	 *
	 * @param components - The container components to add
	 */
	public addContainerComponents(
		...components: RestOrArray<
			APIContainerComponent | ContainerBuilder | ((builder: ContainerBuilder) => ContainerBuilder)
		>
	): this {
		this.data.components ??= [];

		const resolved = normalizeArray(components).map((component) => resolveBuilder(component, ContainerBuilder));
		this.data.components.push(...resolved);

		return this;
	}

	/**
	 * Adds file components to this message.
	 *
	 * @param components - The file components to add
	 */
	public addFileComponents(
		...components: RestOrArray<APIFileComponent | FileBuilder | ((builder: FileBuilder) => FileBuilder)>
	): this {
		this.data.components ??= [];

		const resolved = normalizeArray(components).map((component) => resolveBuilder(component, FileBuilder));
		this.data.components.push(...resolved);

		return this;
	}

	/**
	 * Adds media gallery components to this message.
	 *
	 * @param components - The media gallery components to add
	 */
	public addMediaGalleryComponents(
		...components: RestOrArray<
			APIMediaGalleryComponent | MediaGalleryBuilder | ((builder: MediaGalleryBuilder) => MediaGalleryBuilder)
		>
	): this {
		this.data.components ??= [];

		const resolved = normalizeArray(components).map((component) => resolveBuilder(component, MediaGalleryBuilder));
		this.data.components.push(...resolved);

		return this;
	}

	/**
	 * Adds section components to this message.
	 *
	 * @param components - The section components to add
	 */
	public addSectionComponents(
		...components: RestOrArray<APISectionComponent | SectionBuilder | ((builder: SectionBuilder) => SectionBuilder)>
	): this {
		this.data.components ??= [];

		const resolved = normalizeArray(components).map((component) => resolveBuilder(component, SectionBuilder));
		this.data.components.push(...resolved);

		return this;
	}

	/**
	 * Adds separator components to this message.
	 *
	 * @param components - The separator components to add
	 */
	public addSeparatorComponents(
		...components: RestOrArray<
			APISeparatorComponent | SeparatorBuilder | ((builder: SeparatorBuilder) => SeparatorBuilder)
		>
	): this {
		this.data.components ??= [];

		const resolved = normalizeArray(components).map((component) => resolveBuilder(component, SeparatorBuilder));
		this.data.components.push(...resolved);

		return this;
	}

	/**
	 * Adds text display components to this message.
	 *
	 * @param components - The text display components to add
	 */
	public addTextDisplayComponents(
		...components: RestOrArray<
			APITextDisplayComponent | TextDisplayBuilder | ((builder: TextDisplayBuilder) => TextDisplayBuilder)
		>
	): this {
		this.data.components ??= [];

		const resolved = normalizeArray(components).map((component) => resolveBuilder(component, TextDisplayBuilder));
		this.data.components.push(...resolved);

		return this;
	}

	/**
	 * Removes, replaces, or inserts components for this message.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
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
		...components: RestOrArray<APIMessageTopLevelComponent | MessageTopLevelComponentBuilder>
	): this {
		this.data.components ??= [];
		const resolved = normalizeArray(components).map((component) =>
			component instanceof ComponentBuilder ? component : createComponentBuilder(component),
		);

		this.data.components.splice(start, deleteCount, ...resolved);
		return this;
	}

	/**
	 * Sets the sticker ids of this message.
	 *
	 * @param stickerIds - The ids of the stickers to set
	 */
	public setStickerIds(...stickerIds: RestOrArray<Snowflake>): this {
		return this.spliceStickerIds(0, this.data.sticker_ids?.length ?? 0, ...normalizeArray(stickerIds));
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
	 * to {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
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
		return this.spliceAttachments(0, this.data.attachments.length, ...normalizeArray(attachments));
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
	 * to {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
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
	 *
	 * @param flags - The flags to set
	 */
	public setFlags(flags: MessageFlags): this {
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
	 * Sets whether to enforce recent uniqueness of the nonce of this message.
	 *
	 * @param enforceNonce - Whether to enforce recent uniqueness of the nonce of this message
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
	public updatePoll(updater: (builder: PollBuilder) => void): this {
		updater((this.data.poll ??= new PollBuilder()));
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
			// Wherever we pass false, it's covered by the messagePredicate already
			poll: poll?.toJSON(false),
			allowed_mentions: allowed_mentions?.toJSON(false),
			attachments: attachments.map((attachment) => attachment.toJSON(false)),
			embeds: embeds.map((embed) => embed.toJSON(false)),
			// Here, the messagePredicate does specific constraints rather than using the componentPredicate
			components: components.map((component) => component.toJSON(validationOverride)),
			message_reference: message_reference?.toJSON(false),
		};

		validate(messagePredicate, data, validationOverride);

		return data as RESTPostAPIChannelMessageJSONBody;
	}

	/**
	 * Serializes this builder to both JSON body and file data for multipart/form-data requests.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 * @remarks
	 * This method extracts file data from attachments that have files set via {@link AttachmentBuilder.setFileData}.
	 * The returned body includes attachment metadata, while files contains the binary data for upload.
	 */
	public toFileBody(validationOverride?: boolean): FileBodyEncodableResult<RESTPostAPIChannelMessageJSONBody> {
		const body = this.toJSON(false);

		const files: RawFile[] = [];
		for (const attachment of this.data.attachments) {
			const rawFile = attachment.getRawFile();
			// Only if data or content type are set, since that implies the intent is to send a new file.
			// In case it's contentType but not data, a validation error will be thrown right after.
			if (rawFile?.data || rawFile?.contentType) {
				files.push(rawFile as RawFile);
			}
		}

		const combined = { body, files };
		validate(fileBodyMessagePredicate, combined, validationOverride);

		return combined as FileBodyEncodableResult<RESTPostAPIChannelMessageJSONBody>;
	}
}
