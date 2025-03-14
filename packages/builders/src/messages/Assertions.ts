import { AllowedMentionsTypes, ComponentType, MessageReferenceType } from 'discord-api-types/v10';
import { z } from 'zod';
import { embedPredicate } from './embed/Assertions.js';
import { pollPredicate } from './poll/Assertions.js';

export const attachmentPredicate = z.object({
	id: z.union([z.string(), z.number()]),
	description: z.string().optional(),
	duration_secs: z.number().optional(),
	filename: z.string().optional(),
	title: z.string().optional(),
	waveform: z.string().optional(),
});

export const allowedMentionPredicate = z.object({
	parse: z.nativeEnum(AllowedMentionsTypes).array().optional(),
	roles: z.string().array().optional(),
	users: z.string().array().optional(),
	replied_user: z.boolean().optional(),
});

export const messageReferencePredicate = z.object({
	channel_id: z.string().optional(),
	fail_if_not_exists: z.boolean().optional(),
	guild_id: z.string().optional(),
	message_id: z.string(),
	type: z.nativeEnum(MessageReferenceType).optional(),
});

export const messagePredicate = z
	.object({
		content: z.string().optional(),
		nonce: z.union([z.string().max(25), z.number()]).optional(),
		tts: z.boolean().optional(),
		embeds: embedPredicate.array().max(10).optional(),
		allowed_mentions: allowedMentionPredicate.optional(),
		message_reference: messageReferencePredicate.optional(),
		// Partial validation here to ensure the components are valid,
		// rest of the validation is done in the action row predicate
		components: z
			.object({
				type: z.literal(ComponentType.ActionRow),
				components: z
					.object({
						type: z.union([
							z.literal(ComponentType.Button),
							z.literal(ComponentType.ChannelSelect),
							z.literal(ComponentType.MentionableSelect),
							z.literal(ComponentType.RoleSelect),
							z.literal(ComponentType.StringSelect),
							z.literal(ComponentType.UserSelect),
						]),
					})
					.array(),
			})
			.array()
			.max(5)
			.optional(),
		sticker_ids: z.array(z.string()).min(0).max(3).optional(),
		attachments: attachmentPredicate.array().max(10).optional(),
		flags: z.number().optional(),
		enforce_nonce: z.boolean().optional(),
		poll: pollPredicate.optional(),
	})
	.refine(
		(data) => {
			return (
				data.content !== undefined ||
				(data.embeds !== undefined && data.embeds.length > 0) ||
				data.poll !== undefined ||
				(data.attachments !== undefined && data.attachments.length > 0) ||
				(data.components !== undefined && data.components.length > 0) ||
				(data.sticker_ids !== undefined && data.sticker_ids.length > 0)
			);
		},
		{ message: 'Messages must have content, embeds, a poll, attachments, components, or stickers' },
	);
