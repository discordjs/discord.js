import { PollLayoutType, type RESTAPIPollCreate, type APIPollMedia } from 'discord-api-types/v10';
import {} from '../..';
import { normalizeArray, type RestOrArray } from '../../util/normalizeArray';
import {
	pollAnswersArrayPredicate,
	pollDurationPredicate,
	pollQuestionPredicate,
	validateAnswerLength,
} from './Assertions';

export class PollBuilder {
	public readonly data: RESTAPIPollCreate;

	public constructor(data: Partial<RESTAPIPollCreate> = {}) {
		this.data = { ...data } as RESTAPIPollCreate;
	}

	public addAnswers(...answers: RestOrArray<APIPollMedia>): this {
		const normalizedAnswers = normalizeArray(answers);
		validateAnswerLength(normalizedAnswers.length, this.data.answers);

		pollAnswersArrayPredicate.parse(normalizedAnswers);

		if (this.data.answers) {
			this.data.answers.push(...normalizedAnswers.map((answer) => ({ poll_media: answer })));
		} else {
			this.data.answers = normalizedAnswers.map((answer) => ({ poll_media: answer }));
		}

		return this;
	}

	public spliceAnswers(index: number, deleteCount: number, ...answers: RestOrArray<APIPollMedia>): this {
		const normalizedAnswers = normalizeArray(answers);

		validateAnswerLength(answers.length - deleteCount, this.data.answers);

		pollAnswersArrayPredicate.parse(answers);

		if (this.data.answers) {
			this.data.answers.splice(index, deleteCount, ...normalizedAnswers.map((answer) => ({ poll_media: answer })));
		} else {
			this.data.answers = normalizedAnswers.map((answer) => ({ poll_media: answer }));
		}

		return this;
	}

	public setAnswers(...answers: RestOrArray<APIPollMedia>): this {
		this.spliceAnswers(0, this.data.answers?.length ?? 0, ...normalizeArray(answers));
		return this;
	}

	public setQuestion(text: string): this {
		pollQuestionPredicate.parse(text);

		this.data.question = { text };
		return this;
	}

	public setLayoutType(type = PollLayoutType.Default): this {
		this.data.layout_type = type;
		return this;
	}

	public setMultiSelect(multiSelect = true): this {
		this.data.allow_multiselect = multiSelect;
		return this;
	}

	public setDuration(hours: number): this {
		pollDurationPredicate.parse(hours);

		this.data.duration = hours;
		return this;
	}

	public toJSON(): RESTAPIPollCreate {
		return { ...this.data };
	}
}
