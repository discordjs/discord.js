import {
	PollLayoutType,
	type APIPoll,
	type APIPollAnswer,
	type APIPollAnswerCount,
	type APIPollMedia,
	type APIPollResults,
} from 'discord-api-types/v10';
import { describe, test, expect, beforeEach } from 'vitest';
import { Poll, PollAnswer, PollAnswerCount, PollMedia, PollResults } from '../src/index.js';
import { kPatch } from '../src/utils/symbols';

const answerCount: APIPollAnswerCount = {
	id: 1, // not snowflake
	count: 1,
	me_voted: true,
};

const results: APIPollResults = {
	is_finalized: false,
	answer_counts: [answerCount],
};

const media: APIPollMedia = {
	text: 'pollMedia_Text',
	emoji: { id: '1', name: 'emojiName' },
};

const answer: APIPollAnswer = {
	answer_id: 22,
	poll_media: media,
};

const poll: APIPoll = {
	question: media,
	answers: [answer],
	expiry: '2020-10-10T13:50:17.209000+00:00',
	results,
	allow_multiselect: true,
	layout_type: PollLayoutType.Default,
};

describe('Poll structure and substructures', () => {
	let instance: Poll;

	beforeEach(() => {
		instance = new Poll(poll);
	});

	test('correct value for all getters', () => {
		expect(instance.layoutType).toBe(poll.layout_type);
		expect(instance.allowMultiselect).toBe(poll.allow_multiselect);

		const expiresTimestamp = Date.parse(poll.expiry!);
		expect(instance.expiresTimestamp).toBe(expiresTimestamp);
		expect(instance.expiresDate!.valueOf()).toEqual(expiresTimestamp);
	});

	test('toJSON() returns expected values', () => {
		expect(instance.toJSON()).toStrictEqual(poll);
	});

	test('returns null when no expiry provided', () => {
		const instanceWithoutExpiry = new Poll({ ...poll, expiry: null });

		expect(instanceWithoutExpiry.expiresDate).toBeNull();
		expect(instanceWithoutExpiry.expiresTimestamp).toBeNull();

		expect(instanceWithoutExpiry.toJSON()).toStrictEqual({
			question: poll.question,
			answers: poll.answers,
			results: poll.results,
			allow_multiselect: poll.allow_multiselect,
			layout_type: poll.layout_type,
		});
	});

	test('patching the structure works in-place', () => {
		const patched = instance[kPatch]({
			allow_multiselect: false,
		});

		expect(patched.allowMultiselect).toEqual(false);

		expect(patched.toJSON()).toEqual({ ...poll, allow_multiselect: false });
		expect(patched).toBe(instance);
	});

	describe('PollAnswer substructure', () => {
		let instance: PollAnswer;

		beforeEach(() => {
			instance = new PollAnswer(answer);
		});

		test('correct value for all getters', () => {
			expect(instance.answerId).toBe(answer.answer_id);
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(answer);
		});

		test('patching the structure works in-place', () => {
			const answer_id = 12;

			const patched = instance[kPatch]({
				answer_id,
			});

			expect(patched.answerId).toEqual(answer_id);

			expect(patched.toJSON()).toEqual({ ...answer, answer_id });
			expect(patched).toBe(instance);
		});
	});

	describe('PollMedia substructure', () => {
		let instance: PollMedia;

		beforeEach(() => {
			instance = new PollMedia(media);
		});

		test('correct value for all getters', () => {
			expect(instance.text).toBe(media.text);
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(media);
		});

		test('patching the structure works in-place', () => {
			const text = 'poll-media-text';

			const patched = instance[kPatch]({
				text,
			});

			expect(patched.text).toEqual(text);

			expect(patched.toJSON()).toEqual({ ...media, text });
			expect(patched).toBe(instance);
		});
	});

	describe('PollResults substructure', () => {
		let instance: PollResults;

		beforeEach(() => {
			instance = new PollResults(results);
		});

		test('correct value for all getters', () => {
			expect(instance.isFinalized).toBe(results.is_finalized);
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(results);
		});

		test('patching the structure works in-place', () => {
			const patched = instance[kPatch]({
				is_finalized: true,
			});

			expect(patched.isFinalized).toEqual(true);

			expect(patched.toJSON()).toEqual({ ...results, is_finalized: true });
			expect(patched).toBe(instance);
		});
	});

	describe('PollAnswerCount substructure', () => {
		let instance: PollAnswerCount;

		beforeEach(() => {
			instance = new PollAnswerCount(answerCount);
		});

		test('correct value for all getters', () => {
			expect(instance.id).toBe(answerCount.id);
			expect(instance.count).toBe(answerCount.count);
			expect(instance.meVoted).toBe(answerCount.me_voted);
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(answerCount);
		});

		test('patching the structure works in-place', () => {
			const count = 111;
			const me_voted = false;

			const patched = instance[kPatch]({
				count,
				me_voted,
			});

			expect(patched.count).toEqual(count);
			expect(patched.meVoted).toEqual(me_voted);

			expect(patched.toJSON()).toEqual({ ...answerCount, count, me_voted });
		});
	});
});
