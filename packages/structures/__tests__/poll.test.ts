import {
	PollLayoutType,
	type APIPoll,
	type APIPollAnswer,
	type APIPollAnswerCount,
	type APIPollMedia,
	type APIPollResults,
} from 'discord-api-types/v10';
import { describe, test, expect } from 'vitest';
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
	const data = poll;
	const instance = new Poll(data);

	test('correct value for all getters', () => {
		expect(instance.layoutType).toBe(data.layout_type);
		expect(instance.allowMultiselect).toBe(data.allow_multiselect);

		const expiresTimestamp = Date.parse(data.expiry!);
		expect(instance.expiresTimestamp).toBe(expiresTimestamp);
		expect(instance.expiresDate!.valueOf()).toEqual(expiresTimestamp);
	});

	test('toJSON() returns expected values', () => {
		expect(instance.toJSON()).toStrictEqual(data);
	});

	test('returns null when no expiry provided', () => {
		const instanceWithoutExpiry = new Poll({ ...data, expiry: null });

		expect(instanceWithoutExpiry.expiresDate).toBeNull();
		expect(instanceWithoutExpiry.expiresTimestamp).toBeNull();

		expect(instanceWithoutExpiry.toJSON()).toEqual({ ...data, expiry: undefined });
	});

	test('patching the structure works in-place', () => {
		const patched = instance[kPatch]({
			allow_multiselect: false,
		});

		expect(patched.allowMultiselect).toEqual(false);

		expect(patched.toJSON()).toEqual({ ...data, allow_multiselect: false });
		expect(patched).toBe(instance);
	});

	describe('PollAnswer substructure', () => {
		const data = answer;
		const instance = new PollAnswer(data);

		test('correct value for all getters', () => {
			expect(instance.answerId).toBe(data.answer_id);
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const answer_id = 12;

			const patched = instance[kPatch]({
				answer_id,
			});

			expect(patched.answerId).toEqual(answer_id);

			expect(patched.toJSON()).toEqual({ ...data, answer_id });
			expect(patched).toBe(instance);
		});
	});

	describe('PollMedia substructure', () => {
		const data = media;
		const instance = new PollMedia(data);

		test('correct value for all getters', () => {
			expect(instance.text).toBe(data.text);
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const text = 'poll-media-text';

			const patched = instance[kPatch]({
				text,
			});

			expect(patched.text).toEqual(text);

			expect(patched.toJSON()).toEqual({ ...data, text });
			expect(patched).toBe(instance);
		});
	});

	describe('PollResults substructure', () => {
		const data = results;
		const instance = new PollResults(data);

		test('correct value for all getters', () => {
			expect(instance.isFinalized).toBe(data.is_finalized);
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(data);
		});

		test('patching the structure works in-place', () => {
			const patched = instance[kPatch]({
				is_finalized: true,
			});

			expect(patched.isFinalized).toEqual(true);

			expect(patched.toJSON()).toEqual({ ...data, is_finalized: true });
			expect(patched).toBe(instance);
		});
	});

	describe('PollAnswerCount substructure', () => {
		const data = answerCount;
		const instance = new PollAnswerCount(data);

		test('correct value for all getters', () => {
			expect(instance.id).toBe(data.id);
			expect(instance.count).toBe(data.count);
			expect(instance.meVoted).toBe(data.me_voted);
		});

		test('toJSON() returns expected values', () => {
			expect(instance.toJSON()).toStrictEqual(data);
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

			expect(patched.toJSON()).toEqual({ ...data, count, me_voted });
		});
	});
});
