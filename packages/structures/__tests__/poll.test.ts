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
	text: 'djs://poll-media-text',
	emoji: { id: '1', name: 'djs://emoji-name' },
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

		expect(instance.expiresTimestamp).toBe(new Date(data.expiry!).getTime());
		expect(instance.expiresAt).toEqual(new Date(instance.expiresTimestamp!));
	});

	test('toJSON() returns expected values', () => {
		expect(instance.toJSON()).toStrictEqual(data);
	});

	test('patching the structure works in-place', () => {
		const patched = instance[kPatch]({
			allow_multiselect: false,
		});

		expect(patched.allowMultiselect).toEqual(false);

		expect(patched.toJSON()).not.toEqual(data);
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
			const patched = instance[kPatch]({
				answer_id: 12,
			});

			expect(patched.answerId).toEqual(12);

			expect(patched.toJSON()).not.toEqual(data);
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
			const patched = instance[kPatch]({
				text: 'djs://[PATCHED]-poll-media',
			});

			expect(patched.text).toEqual('djs://[PATCHED]-poll-media');

			expect(patched.toJSON()).not.toEqual(data);
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

			expect(patched.toJSON()).not.toEqual(data);
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
			const patched = instance[kPatch]({
				count: 111,
				me_voted: false,
			});

			expect(patched.count).toEqual(111);
			expect(patched.meVoted).toEqual(false);

			expect(patched.toJSON()).not.toEqual(data);
			expect(patched).toBe(instance);
		});
	});
});
