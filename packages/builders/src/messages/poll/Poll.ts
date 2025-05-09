import type { JSONEncodable } from '@discordjs/util';
import type { RESTAPIPoll, APIPollMedia, PollLayoutType, APIPollAnswer } from 'discord-api-types/v10';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray.js';
import { resolveBuilder } from '../../util/resolveBuilder.js';
import { validate } from '../../util/validation.js';
import { pollPredicate } from './Assertions';
import { PollAnswerBuilder } from './PollAnswer.js';
import { PollQuestionBuilder } from './PollQuestion.js';

export interface PollData extends Omit<RESTAPIPoll, 'answers' | 'question'> {
	answers: PollAnswerBuilder[];
	question: PollQuestionBuilder;
}

/**
 * A builder that creates API-compatible JSON data for polls.
 */
export class PollBuilder implements JSONEncodable<RESTAPIPoll> {
	/**
	 * The API data associated with this poll.
	 */
	private readonly data: PollData;

	/**
	 * Gets the answers of this poll.
	 */
	public get answers(): readonly PollAnswerBuilder[] {
		return this.data.answers;
	}

	/**
	 * Creates a new poll from API data.
	 *
	 * @param data - The API data to create this poll with
	 */
	public constructor(data: Partial<RESTAPIPoll> = {}) {
		this.data = {
			...structuredClone(data),
			question: new PollQuestionBuilder(data.question),
			answers: data.answers?.map((answer) => new PollAnswerBuilder(answer)) ?? [],
		};
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
	public addAnswers(
		...answers: RestOrArray<
			Omit<APIPollAnswer, 'answer_id'> | PollAnswerBuilder | ((builder: PollAnswerBuilder) => PollAnswerBuilder)
		>
	): this {
		const normalizedAnswers = normalizeArray(answers);
		const resolved = normalizedAnswers.map((answer) => resolveBuilder(answer, PollAnswerBuilder));

		this.data.answers.push(...resolved);
		return this;
	}

	/**
	 * Removes, replaces, or inserts answers for this poll.
	 *
	 * @remarks
	 * This method behaves similarly
	 * to {@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/splice | Array.prototype.splice()}.
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
	public spliceAnswers(
		index: number,
		deleteCount: number,
		...answers: (
			| Omit<APIPollAnswer, 'answer_id'>
			| PollAnswerBuilder
			| ((builder: PollAnswerBuilder) => PollAnswerBuilder)
		)[]
	): this {
		const normalizedAnswers = normalizeArray(answers);
		const resolved = normalizedAnswers.map((answer) => resolveBuilder(answer, PollAnswerBuilder));

		this.data.answers.splice(index, deleteCount, ...resolved);
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
	public setAnswers(
		...answers: RestOrArray<
			Omit<APIPollAnswer, 'answer_id'> | PollAnswerBuilder | ((builder: PollAnswerBuilder) => PollAnswerBuilder)
		>
	): this {
		return this.spliceAnswers(0, this.data.answers.length, ...normalizeArray(answers));
	}

	/**
	 * Sets the question for this poll.
	 *
	 * @param options - The data to use for this poll's question
	 */
	public setQuestion(
		options:
			| Omit<APIPollMedia, 'emoji'>
			| PollQuestionBuilder
			| ((builder: PollQuestionBuilder) => PollQuestionBuilder),
	): this {
		this.data.question = resolveBuilder(options, PollQuestionBuilder);
		return this;
	}

	/**
	 * Updates the question of this poll.
	 *
	 * @param updater - The function to update the question with
	 */
	public updateQuestion(updater: (builder: PollQuestionBuilder) => void): this {
		updater(this.data.question);
		return this;
	}

	/**
	 * Sets the layout type for this poll.
	 *
	 * @remarks
	 * This method is redundant while only one type of poll layout exists (`PollLayoutType.Default`)
	 * with Discord using that as the layout type if none is specified.
	 * @param type - The type of poll layout to use
	 */
	public setLayoutType(type: PollLayoutType): this {
		this.data.layout_type = type;
		return this;
	}

	/**
	 * Clears the layout type for this poll.
	 */
	public clearLayoutType(): this {
		this.data.layout_type = undefined;
		return this;
	}

	/**
	 * Sets whether multi-select is enabled for this poll.
	 *
	 * @param multiSelect - Whether to allow multi-select
	 */
	public setMultiSelect(multiSelect = true): this {
		this.data.allow_multiselect = multiSelect;
		return this;
	}

	/**
	 * Sets how long this poll will be open for in hours.
	 *
	 * @remarks
	 * Minimum duration is `1`, with maximum duration being `768` (32 days).
	 * Default if none specified is `24` (one day).
	 * @param duration - The amount of hours this poll will be open for
	 */
	public setDuration(duration: number): this {
		this.data.duration = duration;
		return this;
	}

	/**
	 * Clears the duration for this poll.
	 */
	public clearDuration(): this {
		this.data.duration = undefined;
		return this;
	}

	/**
	 * Serializes this builder to API-compatible JSON data.
	 *
	 * Note that by disabling validation, there is no guarantee that the resulting object will be valid.
	 *
	 * @param validationOverride - Force validation to run/not run regardless of your global preference
	 */
	public toJSON(validationOverride?: boolean): RESTAPIPoll {
		const { answers, question, ...rest } = this.data;

		const data = {
			...structuredClone(rest),
			// Disable validation because the pollPredicate below will validate those as well
			answers: answers.map((answer) => answer.toJSON(false)),
			question: question.toJSON(false),
		};

		validate(pollPredicate, data, validationOverride);

		return data;
	}
}
