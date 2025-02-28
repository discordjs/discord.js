import { AllowedMentionsTypes, MessageReferenceType } from 'discord-api-types/v10';
import { z } from 'zod';
import { actionRowPredicate } from '../components/Assertions.js';
import { embedPredicate } from './embed/Assertions.js';

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

export const messagePredicate = z.object({
	content: z.string().optional(),
	nonce: z.union([z.string(), z.number()]).optional(),
	tts: z.boolean().optional(),
	embeds: embedPredicate.array().max(10).optional(),
	allowed_mentions: allowedMentionPredicate.array().optional(),
	message_reference: z.nativeEnum(MessageReferenceType).optional(),
	components: actionRowPredicate.array().max(5).optional(),
	sticker_ids: z.union([
		z.tuple([z.string(), z.string(), z.string()]),
		z.tuple([z.string(), z.string()]),
		z.tuple([z.string()]),
	]),
	attachments: attachmentPredicate.array().max(10).optional(),
	flags: z.number().optional(),
	enforce_nonce: z.boolean().optional(),
	// TODO https://github.com/discordjs/discord.js/pull/10324
	poll: z.any(),
});
