import { s } from '@sapphire/shapeshift';
import { PollLayoutType, type RESTAPIPollCreate } from 'discord-api-types/v10';
import { isValidationEnabled } from '../../util/validation.js';

export const pollQuestionTextPredicate = s.string
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(300)
	.setValidationEnabled(isValidationEnabled);

export const pollQuestionPredicate = s.object({
	text: pollQuestionTextPredicate,
});

export const pollAnswerTextPredicate = s.string
	.lengthGreaterThanOrEqual(1)
	.lengthLessThanOrEqual(55)
	.setValidationEnabled(isValidationEnabled);

export const pollAnswerEmojiPredicate = s.object({
	id: s.string.optional,
	name: s.string.optional,
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

export const pollDurationPredicate = s.number
	.greaterThanOrEqual(1)
	.lessThanOrEqual(768)
	.setValidationEnabled(isValidationEnabled);

export function validateAnswerLength(amountAdding: number, answers?: RESTAPIPollCreate['answers']): void {
	answerLengthPredicate.parse((answers?.length ?? 0) + amountAdding);
}
