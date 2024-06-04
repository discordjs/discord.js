import { PollLayoutType } from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
import { PollBuilder } from '../../src/index.js';

describe('Poll', () => {
	describe('Poll question', () => {
		test('GIVEN a poll with pre-defined question text THEN return valid toJSON data', () => {
			const poll = new PollBuilder({ question: { text: 'foo' } });

			expect(poll.toJSON()).toStrictEqual({ question: { text: 'foo' } });
		});

		test('GIVEN a poll with question text THEN return valid toJSON data', () => {
			const poll = new PollBuilder();

			poll.setQuestion('foo');

			expect(poll.toJSON()).toStrictEqual({ question: { text: 'foo' } });
		});

		test('GIVEN a poll with invalid question THEN throws error', () => {
			const poll = new PollBuilder();

			expect(() => poll.setQuestion('.'.repeat(301))).toThrowError();
		});
	});

	describe('Poll duration', () => {
		test('GIVEN a poll with pre-defined duration THEN return valid toJSON data', () => {
			const poll = new PollBuilder({ duration: 1 });

			expect(poll.toJSON()).toStrictEqual({ duration: 1 });
		});

		test('GIVEN a poll with duration THEN return valid toJSON data', () => {
			const poll = new PollBuilder();

			poll.setDuration(1);

			expect(poll.toJSON()).toStrictEqual({ duration: 1 });
		});

		test('GIVEN a poll with invalid duration THEN throws error', () => {
			const poll = new PollBuilder();

			expect(() => poll.setDuration(999)).toThrowError();
		});
	});

	describe('Poll layout type', () => {
		test('GIVEN a poll with pre-defined layout type THEN return valid toJSON data', () => {
			const poll = new PollBuilder({ layout_type: PollLayoutType.Default });

			expect(poll.toJSON()).toStrictEqual({ layout_type: PollLayoutType.Default });
		});

		test('GIVEN a poll with layout type THEN return valid toJSON data', () => {
			const poll = new PollBuilder();

			poll.setLayoutType();

			expect(poll.toJSON()).toStrictEqual({ layout_type: PollLayoutType.Default });
		});

		test('GIVEN a poll with invalid layout type THEN throws error', () => {
			const poll = new PollBuilder();

			// @ts-expect-error Invalid layout type
			expect(() => poll.setLayoutType(-1)).toThrowError();
		});
	});

	describe('Poll multi select', () => {
		test('GIVEN a poll with pre-defined multi select enabled THEN return valid toJSON data', () => {
			const poll = new PollBuilder({ allow_multiselect: true });

			expect(poll.toJSON()).toStrictEqual({ allow_multiselect: true });
		});

		test('GIVEN a poll with multi select enabled THEN return valid toJSON data', () => {
			const poll = new PollBuilder();

			poll.setMultiSelect();

			expect(poll.toJSON()).toStrictEqual({ allow_multiselect: true });
		});

		test('GIVEN a poll with invalid multi select value THEN throws error', () => {
			const poll = new PollBuilder();

			// @ts-expect-error Invalid multi-select value
			expect(() => poll.setMultiSelect('string')).toThrowError();
		});
	});

	describe('Poll answers', () => {
		test('GIVEN a poll with pre-defined answer THEN returns valid toJSON data', () => {
			const poll = new PollBuilder({
				answers: [{ poll_media: { text: 'foo' } }],
			});
			expect(poll.toJSON()).toStrictEqual({
				answers: [{ poll_media: { text: 'foo' } }],
			});
		});

		test('GIVEN a poll using PollBuilder#addAnswers THEN returns valid toJSON data', () => {
			const poll = new PollBuilder();

			poll.addAnswers({ text: 'foo' });
			poll.addAnswers([{ text: 'foo' }]);

			expect(poll.toJSON()).toStrictEqual({
				answers: [{ poll_media: { text: 'foo' } }, { poll_media: { text: 'foo' } }],
			});
		});

		test('GIVEN a poll using PollBuilder#spliceAnswers THEN returns valid toJSON data', () => {
			const poll = new PollBuilder();

			poll.addAnswers({ text: 'foo' }, { text: 'bar' });

			expect(poll.spliceAnswers(0, 1).toJSON()).toStrictEqual({
				answers: [{ poll_media: { text: 'bar' } }],
			});
		});

		test('GIVEN a poll using PollBuilder#spliceAnswers THEN returns valid toJSON data 2', () => {
			const poll = new PollBuilder();

			poll.addAnswers(...Array.from({ length: 8 }, () => ({ text: 'foo' })));

			expect(() => poll.spliceAnswers(0, 3, ...Array.from({ length: 2 }, () => ({ text: 'foo' })))).not.toThrowError();
		});

		test('GIVEN a poll using PollBuilder#spliceAnswers that adds additional answers resulting in answers > 10 THEN throws error', () => {
			const poll = new PollBuilder();

			poll.addAnswers(...Array.from({ length: 8 }, () => ({ text: 'foo' })));

			expect(() => poll.spliceAnswers(0, 3, ...Array.from({ length: 8 }, () => ({ text: 'foo' })))).toThrowError();
		});

		test('GIVEN a poll using PollBuilder#setAnswers THEN returns valid toJSON data', () => {
			const poll = new PollBuilder();

			expect(() => poll.setAnswers(...Array.from({ length: 10 }, () => ({ text: 'foo' })))).not.toThrowError();
			expect(() => poll.setAnswers(Array.from({ length: 10 }, () => ({ text: 'foo' })))).not.toThrowError();
		});

		test('GIVEN a poll using PollBuilder#setAnswers that sets more than 10 answers THEN throws error', () => {
			const poll = new PollBuilder();

			expect(() => poll.setAnswers(...Array.from({ length: 11 }, () => ({ text: 'foo' })))).toThrowError();
			expect(() => poll.setAnswers(Array.from({ length: 11 }, () => ({ text: 'foo' })))).toThrowError();
		});

		describe('GIVEN invalid answer amount THEN throws error', () => {
			test('1', () => {
				const poll = new PollBuilder();

				expect(() => poll.addAnswers(...Array.from({ length: 11 }, () => ({ text: 'foo' })))).toThrowError();
			});
		});

		describe('GIVEN invalid answer THEN throws error', () => {
			test('2', () => {
				const poll = new PollBuilder();

				expect(() => poll.addAnswers({})).toThrowError();
			});
		});

		describe('GIVEN invalid answer text length THEN throws error', () => {
			test('3', () => {
				const poll = new PollBuilder();

				expect(() => poll.addAnswers({ text: '.'.repeat(56) })).toThrowError();
			});
		});

		describe('GIVEN invalid answer text THEN throws error', () => {
			test('4', () => {
				const poll = new PollBuilder();

				expect(() => poll.addAnswers({ text: '' })).toThrowError();
			});
		});

		describe('GIVEN invalid answer emoji THEN throws error', () => {
			test('5', () => {
				const poll = new PollBuilder();

				// @ts-expect-error Invalid emoji
				expect(() => poll.addAnswers({ text: 'foo', emoji: '' })).toThrowError();
			});
		});
	});
});
