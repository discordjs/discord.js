/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/dot-notation */
import { Buffer } from 'node:buffer';
import { once } from 'node:events';
import process from 'node:process';
import { Readable } from 'node:stream';
import { addAudioPlayer, deleteAudioPlayer } from '../src/DataStore';
import { VoiceConnection, VoiceConnectionStatus } from '../src/VoiceConnection';
import type { AudioPlayer } from '../src/audio/AudioPlayer';
import { createAudioPlayer, AudioPlayerStatus, SILENCE_FRAME } from '../src/audio/AudioPlayer';
import { AudioPlayerError } from '../src/audio/AudioPlayerError';
import { AudioResource } from '../src/audio/AudioResource';
import { NoSubscriberBehavior } from '../src/index';

jest.mock('../src/DataStore');
jest.mock('../src/VoiceConnection');
jest.mock('../src/audio/AudioPlayerError');

const addAudioPlayerMock = addAudioPlayer as unknown as jest.Mock<typeof addAudioPlayer>;
const deleteAudioPlayerMock = deleteAudioPlayer as unknown as jest.Mock<typeof deleteAudioPlayer>;
const AudioPlayerErrorMock = AudioPlayerError as unknown as jest.Mock<typeof AudioPlayerError>;
const VoiceConnectionMock = VoiceConnection as unknown as jest.Mock<VoiceConnection>;

function* silence() {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	while (true) {
		yield Buffer.from([0xf8, 0xff, 0xfe]);
	}
}

function createVoiceConnectionMock() {
	const connection = new VoiceConnectionMock();
	connection.state = {
		status: VoiceConnectionStatus.Signalling,
		adapter: {
			sendPayload: jest.fn(),
			destroy: jest.fn(),
		},
	};
	connection.subscribe = jest.fn((player) => player['subscribe'](connection));
	return connection;
}

async function wait() {
	// eslint-disable-next-line no-promise-executor-return
	return new Promise((resolve) => process.nextTick(resolve));
}

async function started(resource: AudioResource) {
	while (!resource.started) {
		await wait();
	}

	return resource;
}

let player: AudioPlayer | undefined;

beforeEach(() => {
	AudioPlayerErrorMock.mockReset();
	VoiceConnectionMock.mockReset();
	addAudioPlayerMock.mockReset();
	deleteAudioPlayerMock.mockReset();
});

afterEach(() => {
	player?.stop(true);
});

describe('State transitions', () => {
	test('Starts in Idle state', () => {
		player = createAudioPlayer();
		expect(player.state.status).toEqual(AudioPlayerStatus.Idle);
		expect(addAudioPlayerMock).toBeCalledTimes(0);
		expect(deleteAudioPlayerMock).toBeCalledTimes(0);
	});

	test('Playing resource with pausing and resuming', async () => {
		// Call AudioResource constructor directly to avoid analysing pipeline for stream
		const resource = await started(new AudioResource([], [Readable.from(silence())], null, 5));
		player = createAudioPlayer();
		expect(player.state.status).toEqual(AudioPlayerStatus.Idle);

		// Pause and unpause should not affect the status of an Idle player
		expect(player.pause()).toEqual(false);
		expect(player.state.status).toEqual(AudioPlayerStatus.Idle);
		expect(player.unpause()).toEqual(false);
		expect(player.state.status).toEqual(AudioPlayerStatus.Idle);
		expect(addAudioPlayerMock).toBeCalledTimes(0);

		player.play(resource);
		expect(player.state.status).toEqual(AudioPlayerStatus.Playing);
		expect(addAudioPlayerMock).toBeCalledTimes(1);

		// Expect pause() to return true and transition to paused state
		expect(player.pause()).toEqual(true);
		expect(player.state.status).toEqual(AudioPlayerStatus.Paused);

		// further calls to pause() should be unsuccessful
		expect(player.pause()).toEqual(false);
		expect(player.state.status).toEqual(AudioPlayerStatus.Paused);

		// unpause() should transition back to Playing
		expect(player.unpause()).toEqual(true);
		expect(player.state.status).toEqual(AudioPlayerStatus.Playing);

		// further calls to unpause() should be unsuccessful
		expect(player.unpause()).toEqual(false);
		expect(player.state.status).toEqual(AudioPlayerStatus.Playing);

		// The audio player should not have been deleted throughout these changes
		expect(deleteAudioPlayerMock).toBeCalledTimes(0);
	});

	test('Playing to Stopping', async () => {
		const resource = await started(new AudioResource([], [Readable.from(silence())], null, 5));
		player = createAudioPlayer();

		// stop() shouldn't do anything in Idle state
		expect(player.stop(true)).toEqual(false);
		expect(player.state.status).toEqual(AudioPlayerStatus.Idle);

		player.play(resource);
		expect(player.state.status).toEqual(AudioPlayerStatus.Playing);
		expect(addAudioPlayerMock).toBeCalledTimes(1);
		expect(deleteAudioPlayerMock).toBeCalledTimes(0);

		expect(player.stop()).toEqual(true);
		expect(player.state.status).toEqual(AudioPlayerStatus.Playing);
		expect(addAudioPlayerMock).toBeCalledTimes(1);
		expect(deleteAudioPlayerMock).toBeCalledTimes(0);
		expect(resource.silenceRemaining).toEqual(5);
	});

	test('Buffering to Playing', async () => {
		const resource = new AudioResource([], [Readable.from(silence())], null, 5);
		player = createAudioPlayer();

		player.play(resource);
		expect(player.state.status).toEqual(AudioPlayerStatus.Buffering);

		await started(resource);

		expect(player.state.status).toEqual(AudioPlayerStatus.Playing);
		expect(addAudioPlayerMock).toHaveBeenCalled();
		expect(deleteAudioPlayerMock).not.toHaveBeenCalled();
	});

	describe('NoSubscriberBehavior transitions', () => {
		test('NoSubscriberBehavior.Pause', async () => {
			const connection = createVoiceConnectionMock();
			if (connection.state.status !== VoiceConnectionStatus.Signalling) {
				throw new Error('Voice connection should have been Signalling');
			}

			const resource = await started(new AudioResource([], [Readable.from(silence())], null, 5));
			player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });
			connection.subscribe(player);

			player.play(resource);
			expect(player.checkPlayable()).toEqual(true);
			player['_stepPrepare']();
			expect(player.state.status).toEqual(AudioPlayerStatus.AutoPaused);

			connection.state = {
				...connection.state,
				status: VoiceConnectionStatus.Ready,
				networking: null as any,
			};

			expect(player.checkPlayable()).toEqual(true);
			player['_stepPrepare']();
			expect(player.state.status).toEqual(AudioPlayerStatus.Playing);
		});

		test('NoSubscriberBehavior.Play', async () => {
			const resource = await started(new AudioResource([], [Readable.from(silence())], null, 5));
			player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });

			player.play(resource);
			expect(player.checkPlayable()).toEqual(true);
			player['_stepPrepare']();
			expect(player.state.status).toEqual(AudioPlayerStatus.Playing);
		});

		test('NoSubscriberBehavior.Stop', async () => {
			const resource = await started(new AudioResource([], [Readable.from(silence())], null, 5));
			player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Stop } });

			player.play(resource);
			expect(addAudioPlayerMock).toBeCalledTimes(1);
			expect(player.checkPlayable()).toEqual(true);
			player['_stepPrepare']();
			expect(player.state.status).toEqual(AudioPlayerStatus.Idle);
			expect(deleteAudioPlayerMock).toBeCalledTimes(1);
		});
	});

	test('Normal playing state', async () => {
		const connection = createVoiceConnectionMock();
		if (connection.state.status !== VoiceConnectionStatus.Signalling) {
			throw new Error('Voice connection should have been Signalling');
		}

		connection.state = {
			...connection.state,
			status: VoiceConnectionStatus.Ready,
			networking: null as any,
		};

		const buffer = Buffer.from([1, 2, 4, 8]);
		const resource = await started(
			new AudioResource([], [Readable.from([buffer, buffer, buffer, buffer, buffer])], null, 5),
		);
		player = createAudioPlayer();
		connection.subscribe(player);

		player.play(resource);
		expect(player.state.status).toEqual(AudioPlayerStatus.Playing);
		expect(addAudioPlayerMock).toBeCalledTimes(1);
		expect(player.checkPlayable()).toEqual(true);

		// Run through a few packet cycles
		for (let index = 1; index <= 5; index++) {
			player['_stepDispatch']();
			expect(connection.dispatchAudio).toHaveBeenCalledTimes(index);

			await wait(); // Wait for the stream

			player['_stepPrepare']();
			expect(connection.prepareAudioPacket).toHaveBeenCalledTimes(index);
			expect(connection.prepareAudioPacket).toHaveBeenLastCalledWith(buffer);
			expect(player.state.status).toEqual(AudioPlayerStatus.Playing);
			if (player.state.status === AudioPlayerStatus.Playing) {
				expect(player.state.playbackDuration).toStrictEqual(index * 20);
			}
		}

		// Expect silence to be played
		player['_stepDispatch']();
		expect(connection.dispatchAudio).toHaveBeenCalledTimes(6);
		await wait();
		player['_stepPrepare']();
		const prepareAudioPacket = connection.prepareAudioPacket as unknown as jest.Mock<
			typeof connection.prepareAudioPacket
		>;
		expect(prepareAudioPacket).toHaveBeenCalledTimes(6);
		expect(prepareAudioPacket.mock.calls[5][0]).toEqual(silence().next().value);

		player.stop(true);
		expect(player.state.status).toEqual(AudioPlayerStatus.Idle);
		expect(connection.setSpeaking).toBeCalledTimes(1);
		expect(connection.setSpeaking).toHaveBeenLastCalledWith(false);
		expect(deleteAudioPlayerMock).toHaveBeenCalledTimes(1);
	});

	test('stop() causes resource to use silence padding frames', async () => {
		const connection = createVoiceConnectionMock();
		if (connection.state.status !== VoiceConnectionStatus.Signalling) {
			throw new Error('Voice connection should have been Signalling');
		}

		connection.state = {
			...connection.state,
			status: VoiceConnectionStatus.Ready,
			networking: null as any,
		};

		const buffer = Buffer.from([1, 2, 4, 8]);
		const resource = await started(
			new AudioResource([], [Readable.from([buffer, buffer, buffer, buffer, buffer])], null, 5),
		);
		player = createAudioPlayer();
		connection.subscribe(player);

		player.play(resource);
		expect(player.state.status).toEqual(AudioPlayerStatus.Playing);
		expect(addAudioPlayerMock).toBeCalledTimes(1);
		expect(player.checkPlayable()).toEqual(true);

		player.stop();

		// Run through a few packet cycles
		for (let index = 1; index <= 5; index++) {
			player['_stepDispatch']();
			expect(connection.dispatchAudio).toHaveBeenCalledTimes(index);

			await wait(); // Wait for the stream

			player['_stepPrepare']();
			expect(connection.prepareAudioPacket).toHaveBeenCalledTimes(index);
			expect(connection.prepareAudioPacket).toHaveBeenLastCalledWith(SILENCE_FRAME);
			expect(player.state.status).toEqual(AudioPlayerStatus.Playing);
			if (player.state.status === AudioPlayerStatus.Playing) {
				expect(player.state.playbackDuration).toStrictEqual(index * 20);
			}
		}

		await wait();
		expect(player.checkPlayable()).toEqual(false);
		const prepareAudioPacket = connection.prepareAudioPacket as unknown as jest.Mock<
			typeof connection.prepareAudioPacket
		>;
		expect(prepareAudioPacket).toHaveBeenCalledTimes(5);

		expect(player.state.status).toEqual(AudioPlayerStatus.Idle);
		expect(connection.setSpeaking).toBeCalledTimes(1);
		expect(connection.setSpeaking).toHaveBeenLastCalledWith(false);
		expect(deleteAudioPlayerMock).toHaveBeenCalledTimes(1);
	});

	test('Plays silence 5 times for unreadable stream before quitting', async () => {
		const connection = createVoiceConnectionMock();
		if (connection.state.status !== VoiceConnectionStatus.Signalling) {
			throw new Error('Voice connection should have been Signalling');
		}

		connection.state = {
			...connection.state,
			status: VoiceConnectionStatus.Ready,
			networking: null as any,
		};

		const resource = await started(new AudioResource([], [Readable.from([1])], null, 0));
		resource.playStream.read();
		player = createAudioPlayer({ behaviors: { maxMissedFrames: 5 } });
		connection.subscribe(player);

		player.play(resource);
		expect(player.state.status).toEqual(AudioPlayerStatus.Playing);
		expect(addAudioPlayerMock).toBeCalledTimes(1);
		expect(player.checkPlayable()).toEqual(true);

		const prepareAudioPacket = connection.prepareAudioPacket as unknown as jest.Mock<
			typeof connection.prepareAudioPacket
		>;

		// Run through a few packet cycles
		for (let index = 1; index <= 5; index++) {
			expect(player.state.status).toEqual(AudioPlayerStatus.Playing);
			if (player.state.status !== AudioPlayerStatus.Playing) throw new Error('Error');
			expect(player.state.playbackDuration).toStrictEqual((index - 1) * 20);
			expect(player.state.missedFrames).toEqual(index - 1);
			player['_stepDispatch']();
			expect(connection.dispatchAudio).toHaveBeenCalledTimes(index);
			player['_stepPrepare']();
			expect(prepareAudioPacket).toHaveBeenCalledTimes(index);
			expect(prepareAudioPacket.mock.calls[index - 1][0]).toEqual(silence().next().value);
		}

		expect(player.state.status).toEqual(AudioPlayerStatus.Idle);
		expect(connection.setSpeaking).toBeCalledTimes(1);
		expect(connection.setSpeaking).toHaveBeenLastCalledWith(false);
		expect(deleteAudioPlayerMock).toHaveBeenCalledTimes(1);
	});

	test('checkPlayable() transitions to Idle for unreadable stream', async () => {
		const resource = await started(new AudioResource([], [Readable.from([1])], null, 0));
		player = createAudioPlayer();
		player.play(resource);
		expect(player.checkPlayable()).toEqual(true);
		expect(player.state.status).toEqual(AudioPlayerStatus.Playing);
		for (let index = 0; index < 3; index++) {
			resource.playStream.read();
			await wait();
		}

		expect(resource.playStream.readableEnded).toEqual(true);
		expect(player.checkPlayable()).toEqual(false);
		expect(player.state.status).toEqual(AudioPlayerStatus.Idle);
	});
});

test('play() throws when playing a resource that has already ended', async () => {
	const resource = await started(new AudioResource([], [Readable.from([1])], null, 5));
	player = createAudioPlayer();
	player.play(resource);
	expect(player.state.status).toEqual(AudioPlayerStatus.Playing);
	for (let index = 0; index < 3; index++) {
		resource.playStream.read();
		await wait();
	}

	expect(resource.playStream.readableEnded).toEqual(true);
	player.stop(true);
	expect(player.state.status).toEqual(AudioPlayerStatus.Idle);
	expect(() => player?.play(resource)).toThrow();
});

test('Propagates errors from streams', async () => {
	const resource = await started(new AudioResource([], [Readable.from(silence())], null, 5));
	player = createAudioPlayer();
	player.play(resource);
	expect(player.state.status).toEqual(AudioPlayerStatus.Playing);
	const error = new Error('AudioPlayer test error');
	process.nextTick(() => resource.playStream.emit('error', error));
	const res = await once(player, 'error');
	const playerError = res[0] as AudioPlayerError;
	expect(playerError).toBeInstanceOf(AudioPlayerError);
	expect(AudioPlayerErrorMock).toHaveBeenCalledWith(error, resource);
	expect(player.state.status).toEqual(AudioPlayerStatus.Idle);
});
