import type { APIPollMedia } from 'discord-api-types/v10';
import { validate } from '../../util/validation.js';
import { pollQuestionPredicate } from './Assertions.js';
import { PollMediaBuilder } from './PollMedia.js';

/**
 * A builder that creates API-compatible JSON data for a poll question.
 */
export class PollQuestionBuilder extends PollMediaBuilder {
	/**
	 * {@inheritDoc PollMediaBuilder.toJSON}
	 */
	public override toJSON(validationOverride?: boolean): Omit<APIPollMedia, 'emoji'> {
		const clone = structuredClone(this.data);

		validate(pollQuestionPredicate, clone, validationOverride);

		return clone;
	}
}
