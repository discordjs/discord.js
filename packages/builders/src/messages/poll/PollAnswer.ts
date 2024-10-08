import type { APIPollAnswer, APIPollMedia } from 'discord-api-types/v10';
import { resolveBuilder } from '../../util/resolveBuilder';
import { validate } from '../../util/validation';
import { pollAnswerPredicate } from './Assertions';
import { PollAnswerMediaBuilder } from './PollAnswerMedia';

export interface PollAnswerData extends Omit<APIPollAnswer, 'answer_id' | 'poll_media'> {
	poll_media: PollAnswerMediaBuilder;
}

export class PollAnswerBuilder {
	protected readonly data: PollAnswerData;

	public constructor(data: Partial<Omit<APIPollAnswer, 'answer_id'>> = {}) {
		this.data = {
			...structuredClone(data),
			poll_media: new PollAnswerMediaBuilder(data.poll_media),
		};
	}

	/**
	 * Sets the media for this poll answer.
	 *
	 * @param options - The data to use for this poll answer's media
	 */
	public setMedia(
		options: APIPollMedia | PollAnswerMediaBuilder | ((builder: PollAnswerMediaBuilder) => PollAnswerMediaBuilder),
	): this {
		this.data.poll_media = resolveBuilder(options, PollAnswerMediaBuilder);
		return this;
	}

	/**
	 * Updates the media of this poll answer.
	 *
	 * @param updater - The function to update the media with
	 */
	public updateMedia(updater: (builder: PollAnswerMediaBuilder) => void) {
		updater((this.data.poll_media ??= new PollAnswerMediaBuilder()));
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public toJSON(validationOverride?: boolean): Omit<APIPollAnswer, 'answer_id'> {
		const data = {
			...structuredClone(this.data),
			// Disable validation because the pollAnswerPredicate below will validate this as well
			poll_media: this.data.poll_media?.toJSON(false),
		};

		validate(pollAnswerPredicate, data, validationOverride);

		return data;
	}
}
