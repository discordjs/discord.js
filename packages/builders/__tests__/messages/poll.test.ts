import { PollLayoutType, type RESTAPIPoll } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { PollAnswerMediaBuilder, PollBuilder, PollQuestionBuilder } from '../../src/index.js';

const dummyData = {
	question: {
		text: '.',
	},
	answers: [],
} satisfies RESTAPIPoll;

const dummyDataWithAnswer = {
	...dummyData,
	answers: [
		{
			poll_media: {
				text: '.',
			},
		},
	],
} satisfies RESTAPIPoll;

describe('Poll', () => {
	describe('Poll question', () => {
		test('GIVEN a poll with pre-defined question text THEN return valid toJSON data', () => {
			const poll = new PollBuilder({ ...dummyDataWithAnswer, question: { text: 'foo' } });

			expect(poll.toJSON()).toStrictEqual({ ...dummyDataWithAnswer, question: { text: 'foo' } });
		});

		test('GIVEN a poll with question text THEN return valid toJSON data', () => {
			const poll = new PollBuilder(dummyDataWithAnswer);

			poll.setQuestion({ text: 'foo' });

			expect(poll.toJSON()).toStrictEqual({ ...dummyDataWithAnswer, question: { text: 'foo' } });
		});

		test('GIVEN a poll with invalid question THEN throws error', () => {
			expect(() => new PollQuestionBuilder().setText('.'.repeat(301)).toJSON()).toThrowError();
		});
	});

	describe('Poll duration', () => {
		test('GIVEN a poll with pre-defined duration THEN return valid toJSON data', () => {
			const poll = new PollBuilder({ duration: 1, ...dummyDataWithAnswer });

			expect(poll.toJSON()).toStrictEqual({ duration: 1, ...dummyDataWithAnswer });
		});

		test('GIVEN a poll with duration THEN return valid toJSON data', () => {
			const poll = new PollBuilder(dummyDataWithAnswer);

			poll.setDuration(1);

			expect(poll.toJSON()).toStrictEqual({ duration: 1, ...dummyDataWithAnswer });
		});

		test('GIVEN a poll with invalid duration THEN throws error', () => {
			const poll = new PollBuilder(dummyDataWithAnswer);

			expect(() => poll.setDuration(999).toJSON()).toThrowError();
		});
	});

	describe('Poll layout type', () => {
		test('GIVEN a poll with pre-defined layout type THEN return valid toJSON data', () => {
			const poll = new PollBuilder({ ...dummyDataWithAnswer, layout_type: PollLayoutType.Default });

			expect(poll.toJSON()).toStrictEqual({ layout_type: PollLayoutType.Default, ...dummyDataWithAnswer });
		});

		test('GIVEN a poll with layout type THEN return valid toJSON data', () => {
			const poll = new PollBuilder(dummyDataWithAnswer);

			poll.setLayoutType(PollLayoutType.Default);

			expect(poll.toJSON()).toStrictEqual({ layout_type: PollLayoutType.Default, ...dummyDataWithAnswer });
		});

		test('GIVEN a poll with invalid layout type THEN throws error', () => {
			const poll = new PollBuilder(dummyDataWithAnswer);

			// @ts-expect-error Invalid layout type
			expect(() => poll.setLayoutType(-1).toJSON()).toThrowError();
		});
	});

	describe('Poll multi select', () => {
		test('GIVEN a poll with pre-defined multi select enabled THEN return valid toJSON data', () => {
			const poll = new PollBuilder({ allow_multiselect: true, ...dummyDataWithAnswer });

			expect(poll.toJSON()).toStrictEqual({ allow_multiselect: true, ...dummyDataWithAnswer });
		});

		test('GIVEN a poll with multi select enabled THEN return valid toJSON data', () => {
			const poll = new PollBuilder(dummyDataWithAnswer);

			poll.setMultiSelect();

			expect(poll.toJSON()).toStrictEqual({ allow_multiselect: true, ...dummyDataWithAnswer });
		});

		test('GIVEN a poll with invalid multi select value THEN throws error', () => {
			const poll = new PollBuilder(dummyDataWithAnswer);

			// @ts-expect-error Invalid multi-select value
			expect(() => poll.setMultiSelect('string').toJSON()).toThrowError();
		});
	});

	describe('Poll answers', () => {
		test('GIVEN a poll without answers THEN throws error', () => {
			const poll = new PollBuilder(dummyData);

			expect(() => poll.toJSON()).toThrowError();
		});

		test('GIVEN a poll with pre-defined answer THEN returns valid toJSON data', () => {
			const poll = new PollBuilder({
				...dummyData,
				answers: [{ poll_media: { text: 'foo' } }],
			});
			expect(poll.toJSON()).toStrictEqual({
				...dummyData,
				answers: [{ poll_media: { text: 'foo' } }],
			});
		});

		test('GIVEN a poll using PollBuilder#addAnswers THEN returns valid toJSON data', () => {
			const poll = new PollBuilder(dummyData);

			poll.addAnswers({ poll_media: { text: 'foo' } });
			poll.addAnswers([{ poll_media: { text: 'foo' } }]);

			expect(poll.toJSON()).toStrictEqual({
				...dummyData,
				answers: [{ poll_media: { text: 'foo' } }, { poll_media: { text: 'foo' } }],
			});
		});

		test('GIVEN a poll using PollBuilder#spliceAnswers THEN returns valid toJSON data', () => {
			const poll = new PollBuilder(dummyData);

			poll.addAnswers({ poll_media: { text: 'foo' } }, { poll_media: { text: 'bar' } });

			expect(poll.spliceAnswers(0, 1).toJSON()).toStrictEqual({
				...dummyData,
				answers: [{ poll_media: { text: 'bar' } }],
			});
		});

		test('GIVEN a poll using PollBuilder#spliceAnswers THEN returns valid toJSON data 2', () => {
			const poll = new PollBuilder(dummyData);

			poll.addAnswers(...Array.from({ length: 8 }, () => ({ poll_media: { text: 'foo' } })));

			expect(() =>
				poll.spliceAnswers(0, 3, ...Array.from({ length: 2 }, () => ({ poll_media: { text: 'foo' } }))).toJSON(),
			).not.toThrowError();
		});

		test('GIVEN a poll using PollBuilder#spliceAnswers that adds additional answers resulting in answers > 10 THEN throws error', () => {
			const poll = new PollBuilder();

			poll.addAnswers(...Array.from({ length: 8 }, () => ({ poll_media: { text: 'foo' } })));

			expect(() =>
				poll.spliceAnswers(0, 3, ...Array.from({ length: 8 }, () => ({ poll_media: { text: 'foo' } }))).toJSON(),
			).toThrowError();
		});

		test('GIVEN a poll using PollBuilder#setAnswers THEN returns valid toJSON data', () => {
			const poll = new PollBuilder(dummyData);

			expect(() =>
				poll.setAnswers(...Array.from({ length: 10 }, () => ({ poll_media: { text: 'foo' } }))).toJSON(),
			).not.toThrowError();
			expect(() =>
				poll.setAnswers(Array.from({ length: 10 }, () => ({ poll_media: { text: 'foo' } }))).toJSON(),
			).not.toThrowError();
		});

		test('GIVEN a poll using PollBuilder#setAnswers that sets more than 10 answers THEN throws error', () => {
			const poll = new PollBuilder(dummyData);

			expect(() =>
				poll.setAnswers(...Array.from({ length: 11 }, () => ({ poll_media: { text: 'foo' } }))).toJSON(),
			).toThrowError();
			expect(() =>
				poll.setAnswers(Array.from({ length: 11 }, () => ({ poll_media: { text: 'foo' } }))).toJSON(),
			).toThrowError();
		});

		describe('GIVEN invalid answer amount THEN throws error', () => {
			test('1', () => {
				const poll = new PollBuilder(dummyData);

				expect(() =>
					poll.addAnswers(...Array.from({ length: 11 }, () => ({ poll_media: { text: 'foo' } }))).toJSON(),
				).toThrowError();
			});
		});

		describe('GIVEN invalid answer THEN throws error', () => {
			test('2', () => {
				const poll = new PollBuilder().setQuestion({ text: '.' });

				// @ts-expect-error Invalid answer
				expect(() => poll.addAnswers({}).toJSON()).toThrowError();
			});
		});

		describe('GIVEN invalid answer text length THEN throws error', () => {
			test('3', () => {
				expect(() => new PollAnswerMediaBuilder().setText('.'.repeat(56)).toJSON()).toThrowError();
			});
		});

		describe('GIVEN invalid answer text THEN throws error', () => {
			test('4', () => {
				expect(() => new PollAnswerMediaBuilder().setText('').toJSON()).toThrowError();
			});
		});

		describe('GIVEN invalid answer emoji THEN throws error', () => {
			test('5', () => {
				// @ts-expect-error Invalid emoji
				expect(() => new PollAnswerMediaBuilder().setEmoji('').toJSON()).toThrowError();
			});
		});
	});
});
