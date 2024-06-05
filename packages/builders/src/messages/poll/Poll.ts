import { PollLayoutType, type RESTAPIPollCreate, type APIPollMedia } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray';
import {
	pollAnswersArrayPredicate,
	pollDurationPredicate,
	pollLayoutTypePredicate,
	pollMultiSelectPredicate,
	pollQuestionPredicate,
	validateAnswerLength,
} from './Assertions';

/**
 * A builder that creates API-compatible JSON data for polls.
 */
export class PollBuilder {
	/**
	 * The API data associated with this poll.
	 */
	public readonly data: Partial<RESTAPIPollCreate>;

	/**
	 * Creates a new poll from API data.
	 *
	 * @param data - The API data to create this poll with
	 */
	public constructor(data: Partial<RESTAPIPollCreate> = {}) {
		this.data = { ...data };
	}

	/**
	 * Appends answers to the poll.
	 *
	 * @remarks
	 * This method accepts either an array of answers or a variable number of answer parameters.
	 * The maximum amount of answers that can be added is 10.
	 * @example
	 * Using an array:
	 * ```ts
	 * const answers: APIPollMedia[] = ...;
	 * const poll = new PollBuilder()
	 * 	.addAnswers(answers);
	 * ```
	 * @example
	 * Using rest parameters (variadic):
	 * ```ts
	 * const poll = new PollBuilder()
	 * 	.addAnswers(
	 * 		{ text: 'Answer 1' },
	 * 		{ text: 'Answer 2' },
	 * 	);
	 * ```
	 * @param answers - The answers to add
	 */
	public addAnswers(...answers: RestOrArray<APIPollMedia>): this {
		const normalizedAnswers = normalizeArray(answers);

		// Ensure adding these answers won't exceed the 10 answer limit
		validateAnswerLength(normalizedAnswers.length, this.data.answers);

		// Data assertions
		pollAnswersArrayPredicate.parse(normalizedAnswers);

		if (this.data.answers) {
			this.data.answers.push(...normalizedAnswers.map((answer) => ({ poll_media: answer })));
		} else {
			this.data.answers = normalizedAnswers.map((answer) => ({ poll_media: answer }));
		}

		return this;
	}

	/**
	 * Removes, replaces, or inserts answers for this poll.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
	 * The maximum amount of answers that can be added is 10.
	 *
	 * It's useful for modifying and adjusting order of the already-existing answers of a poll.
	 * @example
	 * Remove the first answer:
	 * ```ts
	 * poll.spliceAnswers(0, 1);
	 * ```
	 * @example
	 * Remove the first n answers:
	 * ```ts
	 * const n = 4;
	 * poll.spliceAnswers(0, n);
	 * ```
	 * @example
	 * Remove the last answer:
	 * ```ts
	 * poll.spliceAnswers(-1, 1);
	 * ```
	 * @param index - The index to start at
	 * @param deleteCount - The number of answers to remove
	 * @param answers - The replacing answer objects
	 */
	public spliceAnswers(index: number, deleteCount: number, ...answers: RestOrArray<APIPollMedia>): this {
		const normalizedAnswers = normalizeArray(answers);

		// Ensure adding these answers won't exceed the 10 answer limit
		validateAnswerLength(answers.length - deleteCount, this.data.answers);

		// Data assertions
		pollAnswersArrayPredicate.parse(answers);

		if (this.data.answers) {
			this.data.answers.splice(index, deleteCount, ...normalizedAnswers.map((answer) => ({ poll_media: answer })));
		} else {
			this.data.answers = normalizedAnswers.map((answer) => ({ poll_media: answer }));
		}

		return this;
	}

	/**
	 * Sets the answers for this poll.
	 *
	 * @remarks
	 * This method is an alias for {@link PollBuilder.spliceAnswers}. More specifically,
	 * it splices the entire array of answers, replacing them with the provided answers.
	 *
	 * You can set a maximum of 10 answers.
	 * @param answers - The answers to set
	 */
	public setAnswers(...answers: RestOrArray<APIPollMedia>): this {
		this.spliceAnswers(0, this.data.answers?.length ?? 0, ...normalizeArray(answers));
		return this;
	}

	/**
	 * Sets the question for this poll.
	 *
	 * @param data - The data to use for this poll's question
	 */
	public setQuestion(data: Omit<APIPollMedia, 'emoji'>): this {
		// Data assertions
		pollQuestionPredicate.parse(data);

		this.data.question = data;
		return this;
	}

	/**
	 * Sets the layout type for this poll.
	 *
	 * @remarks
	 * This method is redundant while only one type of poll layout exists (`PollLayoutType.Default`)
	 * due to Discord automatically setting the layout to `PollLayoutType.Default` if none provided,
	 * and thus is not required to be called when creating a poll.
	 * @param type - The type of poll layout to use
	 */
	public setLayoutType(type = PollLayoutType.Default): this {
		// Data assertions
		pollLayoutTypePredicate.parse(type);

		this.data.layout_type = type;
		return this;
	}

	/**
	 * Sets whether multi-select is enabled for this poll.
	 *
	 * @param multiSelect - Whether to allow multi-select
	 */
	public setMultiSelect(multiSelect = true): this {
		// Data assertions
		pollMultiSelectPredicate.parse(multiSelect);

		this.data.allow_multiselect = multiSelect;
		return this;
	}

	/**
	 * Sets how long this poll will be open for in hours.
	 *
	 * @remarks
	 * Minimum duration is `1`, with maximum duration being `168` (one week).
	 * Default if none specified is `24` (one day).
	 * @param hours - The amount of hours this poll will be open for
	 */
	public setDuration(hours: number): this {
		// Data assertions
		pollDurationPredicate.parse(hours);

		this.data.duration = hours;
		return this;
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * @remarks
	 * This method runs validations on the data before serializing it.
	 * As such, it may throw an error if the data is invalid.
	 */
	public toJSON(): RESTAPIPollCreate {
		return { ...this.data } as RESTAPIPollCreate;
	}
}
