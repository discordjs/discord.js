/* eslint-disable no-promise-executor-return */
import { Buffer } from 'node:buffer';
import { setTimeout } from 'node:timers';
import { SILENCE_FRAME } from '../src/audio/AudioPlayer.js';
import { AudioReceiveStream, EndBehaviorType } from '../src/receive/AudioReceiveStream.js';

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
	});

	// TODO: Fix this test
	// test('AfterSilence end behavior', async () => {
	// 	const duration = 100;
	// 	const increment = 20;

	// 	const stream = new AudioReceiveStream({ end: { behavior: EndBehaviorType.AfterSilence, duration: 100 } });
	// 	stream.resume();

	// 	for (let i = increment; i < duration / 2; i += increment) {
	// 		await stepSilence(stream, increment);
	// 	}

	// 	stream.push(DUMMY_BUFFER);

	// 	for (let i = increment; i < duration; i += increment) {
	// 		await stepSilence(stream, increment);
	// 	}

	// 	await wait(increment);
	// 	expect(stream.readableEnded).toEqual(true);
	// });

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
});
