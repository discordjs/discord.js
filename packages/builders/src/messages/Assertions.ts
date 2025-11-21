import { Buffer } from 'node:buffer';
import { AllowedMentionsTypes, ComponentType, MessageFlags, MessageReferenceType } from 'discord-api-types/v10';
import { z } from 'zod';
import { embedPredicate } from './embed/Assertions.js';
import { pollPredicate } from './poll/Assertions.js';

const fileKeyRegex = /^files\[(?<placeholder>\d+?)]$/;

export const rawFilePredicate = z.object({
	data: z.union([z.instanceof(Buffer), z.instanceof(Uint8Array), z.string()]),
	name: z.string().min(1),
	contentType: z.string().optional(),
	key: z.string().regex(fileKeyRegex).optional(),
});

export const attachmentPredicate = z.object({
	// As a string it only makes sense for edits when we do have an attachment snowflake
	id: z.union([z.string(), z.number()]),
	description: z.string().max(1_024).optional(),
	duration_secs: z
		.number()
		.max(2 ** 31 - 1)
		.optional(),
	filename: z.string().max(1_024).optional(),
	title: z.string().max(1_024).optional(),
	waveform: z.string().max(400).optional(),
});

export const allowedMentionPredicate = z
	.object({
		parse: z.enum(AllowedMentionsTypes).array().optional(),
		roles: z.string().array().max(100).optional(),
		users: z.string().array().max(100).optional(),
		replied_user: z.boolean().optional(),
	})
	.refine(
		(data) =>
			!(
				(data.parse?.includes(AllowedMentionsTypes.User) && data.users?.length) ||
				(data.parse?.includes(AllowedMentionsTypes.Role) && data.roles?.length)
			),
		{
			error:
				'Cannot specify both parse: ["users"] and non-empty users array, or parse: ["roles"] and non-empty roles array. These are mutually exclusive',
		},
	);

export const messageReferencePredicate = z.object({
	channel_id: z.string().optional(),
	fail_if_not_exists: z.boolean().optional(),
	guild_id: z.string().optional(),
	message_id: z.string(),
	type: z.enum(MessageReferenceType).optional(),
});

const baseMessagePredicate = z.object({
	nonce: z.union([z.string().max(25), z.number()]).optional(),
	tts: z.boolean().optional(),
	allowed_mentions: allowedMentionPredicate.optional(),
	message_reference: messageReferencePredicate.optional(),
	attachments: attachmentPredicate.array().max(10).optional(),
	enforce_nonce: z.boolean().optional(),
});

const basicActionRowPredicate = z.object({
	type: z.literal(ComponentType.ActionRow),
	components: z
		.object({
			type: z.literal([
				ComponentType.Button,
				ComponentType.ChannelSelect,
				ComponentType.MentionableSelect,
				ComponentType.RoleSelect,
				ComponentType.StringSelect,
				ComponentType.UserSelect,
			]),
		})
		.array(),
});

const messageNoComponentsV2Predicate = baseMessagePredicate
	.extend({
		content: z.string().max(2_000).optional(),
		embeds: embedPredicate.array().max(10).optional(),
		sticker_ids: z.array(z.string()).max(3).optional(),
		poll: pollPredicate.optional(),
		components: basicActionRowPredicate.array().max(5).optional(),
		flags: z
			.int()
			.optional()
			.refine((flags) => !flags || (flags & MessageFlags.IsComponentsV2) === 0, {
				error: 'Cannot set content, embeds, stickers, or poll with IsComponentsV2 flag set',
			}),
	})
	.refine(
		(data) =>
			data.content !== undefined ||
			(data.embeds !== undefined && data.embeds.length > 0) ||
			data.poll !== undefined ||
			(data.attachments !== undefined && data.attachments.length > 0) ||
			(data.components !== undefined && data.components.length > 0) ||
			(data.sticker_ids !== undefined && data.sticker_ids.length > 0),
		{ error: 'Messages must have content, embeds, a poll, attachments, components or stickers' },
	);

const allTopLevelComponentsPredicate = z
	.union([
		basicActionRowPredicate,
		z.object({
			type: z.literal([
				// Components v2
				ComponentType.Container,
				ComponentType.File,
				ComponentType.MediaGallery,
				ComponentType.Section,
				ComponentType.Separator,
				ComponentType.TextDisplay,
				ComponentType.Thumbnail,
			]),
		}),
	])
	.array()
	.min(1)
	.max(10);

const messageComponentsV2Predicate = baseMessagePredicate.extend({
	components: allTopLevelComponentsPredicate,
	flags: z.int().refine((flags) => (flags & MessageFlags.IsComponentsV2) === MessageFlags.IsComponentsV2, {
		error: 'Must set IsComponentsV2 flag to use Components V2',
	}),
	// These fields cannot be set
	content: z.string().length(0).nullish(),
	embeds: z.array(z.never()).nullish(),
	sticker_ids: z.array(z.never()).nullish(),
	poll: z.null().optional(),
});

export const messagePredicate = z.union([messageNoComponentsV2Predicate, messageComponentsV2Predicate]);

// This validator does not assert file.key <-> attachment.id coherence. This is fine, because the builders
// should effectively guarantee that.
export const fileBodyMessagePredicate = z.object({
	body: messagePredicate,
	// No min length to support message edits
	files: rawFilePredicate.array().max(10),
});
