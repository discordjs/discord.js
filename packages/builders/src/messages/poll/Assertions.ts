import { s } from '@sapphire/shapeshift';
import { PollLayoutType, type RESTAPIPollCreate } from 'discord-api-types/v10';
import { isValidationEnabled } from '../../util/validation.js';

export const pollQuestionPredicate = s.string
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(300)
	.setValidationEnabled(isValidationEnabled);

export const pollAnswerTextPredicate = s.string
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(55)
	.optional.setValidationEnabled(isValidationEnabled);

export const pollAnswerEmojiPredicate = s.object({
	id: s.string.nullable,
	name: s.string.nullable,
	animated: s.boolean.optional,
});

export const pollAnswerPredicate = s.object({
	text: pollAnswerTextPredicate,
	emoji: pollAnswerEmojiPredicate.optional,
});

export const pollMultiSelectPredicate = s.boolean.setValidationEnabled(isValidationEnabled);

export const pollLayoutTypePredicate = s.nativeEnum(PollLayoutType).setValidationEnabled(isValidationEnabled);

export const pollAnswersArrayPredicate = pollAnswerPredicate.array.setValidationEnabled(isValidationEnabled);

export const answerLengthPredicate = s.number.lessThanOrEqual(10).setValidationEnabled(isValidationEnabled);

export const pollDurationPredicate = s.number.lessThanOrEqual(168).setValidationEnabled(isValidationEnabled);

export function validateAnswerLength(amountAdding: number, answers?: RESTAPIPollCreate['answers']): void {
	answerLengthPredicate.parse((answers?.length ?? 0) + amountAdding);
}
