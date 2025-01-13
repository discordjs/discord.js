/* eslint-disable no-promise-executor-return */
import { Buffer } from 'node:buffer';
import { describe, test, expect } from 'vitest';
import { SILENCE_FRAME } from '../src/audio/AudioPlayer';
import { AudioReceiveStream, EndBehaviorType } from '../src/receive/AudioReceiveStream';

const DUMMY_BUFFER = Buffer.allocUnsafe(16);

async function wait(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function stepSilence(stream: AudioReceiveStream, increment: number) {
	stream.push(SILENCE_FRAME);
	await wait(increment);
	expect(stream.readable).toEqual(true);
}

describe('AudioReceiveStream', () => {
	test('Manual end behavior', async () => {
		const stream = new AudioReceiveStream({ end: { behavior: EndBehaviorType.Manual } });
		stream.push(DUMMY_BUFFER);
		expect(stream.readable).toEqual(true);
		await wait(200);
		stream.push(DUMMY_BUFFER);
		expect(stream.readable).toEqual(true);
		stream.push(null);
		await wait(200);
		expect(stream.readable).toEqual(false);
	});

	test('AfterSilence end behavior', async () => {
		const duration = 100;
		const increment = 20;

		const stream = new AudioReceiveStream({ end: { behavior: EndBehaviorType.AfterSilence, duration } });
		stream.resume();

		for (let step = increment; step < duration / 2; step += increment) {
			await stepSilence(stream, increment);
		}

		stream.push(DUMMY_BUFFER);

		await wait(duration);
		expect(stream.readableEnded).toEqual(true);
	});

	test('AfterInactivity end behavior', async () => {
		const duration = 100;
		const increment = 20;

		const stream = new AudioReceiveStream({ end: { behavior: EndBehaviorType.AfterInactivity, duration: 100 } });
		stream.resume();

		for (let index = increment; index < duration / 2; index += increment) {
			await stepSilence(stream, increment);
		}

		stream.push(DUMMY_BUFFER);

		for (let index = increment; index < duration; index += increment) {
			await stepSilence(stream, increment);
		}

		await wait(increment);
		expect(stream.readableEnded).toEqual(false);

		await wait(duration - increment);

		expect(stream.readableEnded).toEqual(true);
	});

	test('Stream ends after pushing null', async () => {
		const stream = new AudioReceiveStream({ end: { behavior: EndBehaviorType.AfterInactivity, duration: 100 } });
		stream.resume();

		stream.push(DUMMY_BUFFER);

		expect(stream.readable).toEqual(true);
		expect(stream.readableEnded).toEqual(false);
		expect(stream.destroyed).toEqual(false);

		stream.push(null);
		await wait(50);

		expect(stream.readable).toEqual(false);
		expect(stream.readableEnded).toEqual(true);
		expect(stream.destroyed).toEqual(true);
	});
});
