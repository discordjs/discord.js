import type { APIPartialEmoji, APIPollMedia } from 'discord-api-types/v10';
import { validate } from '../../util/validation.js';
import { pollAnswerMediaPredicate } from './Assertions.js';
import { PollMediaBuilder } from './PollMedia.js';

/**
 * A builder that creates API-compatible JSON data for poll answers.
 */
export class PollAnswerMediaBuilder extends PollMediaBuilder {
	/**
	 * Sets the emoji for this poll answer.
	 *
	 * @param emoji - The emoji to use
	 */
	public setEmoji(emoji: APIPartialEmoji): this {
		this.data.emoji = emoji;
		return this;
	}

	/**
	 * Clears the emoji for this poll answer.
	 */
	public clearEmoji(): this {
		this.data.emoji = undefined;
		return this;
	}

	public override toJSON(validationOverride?: boolean): APIPollMedia {
		const clone = structuredClone(this.data);

		validate(pollAnswerMediaPredicate, clone, validationOverride);

		return clone as APIPollMedia;
	}
}
