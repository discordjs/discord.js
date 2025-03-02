import { PollLayoutType } from 'discord-api-types/v10';
import { z } from 'zod';
import { emojiPredicate } from '../../components/Assertions';

export const pollQuestionPredicate = z.object({ text: z.string().min(1).max(300) });

export const pollAnswerMediaPredicate = z.object({
	text: z.string().min(1).max(55),
	emoji: emojiPredicate.optional(),
});

export const pollAnswerPredicate = z.object({ poll_media: pollAnswerMediaPredicate });

export const pollPredicate = z.object({
	question: pollQuestionPredicate,
	answers: z.array(pollAnswerPredicate).min(1).max(10),
	duration: z.number().min(1).max(768).optional(),
	allow_multiselect: z.boolean().optional(),
	layout_type: z.nativeEnum(PollLayoutType).optional(),
});
