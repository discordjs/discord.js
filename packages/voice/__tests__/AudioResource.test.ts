/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Buffer } from 'node:buffer';
import process from 'node:process';
import { PassThrough, Readable } from 'node:stream';
import { opus, VolumeTransformer } from 'prism-media';
import { SILENCE_FRAME } from '../src/audio/AudioPlayer.js';
import { AudioResource, createAudioResource, NO_CONSTRAINT, VOLUME_CONSTRAINT } from '../src/audio/AudioResource.js';
import type { Edge } from '../src/audio/TransformerGraph.js';
import { findPipeline as _findPipeline, StreamType, TransformerType } from '../src/audio/TransformerGraph.js';

jest.mock('prism-media');
jest.mock('../src/audio/TransformerGraph');

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

const findPipeline = _findPipeline as unknown as jest.MockedFunction<typeof _findPipeline>;

beforeAll(() => {
	// @ts-expect-error no type
	findPipeline.mockImplementation((from: StreamType, constraint: (path: Edge[]) => boolean) => {
		const base = [
			{
				cost: 1,
				transformer: () => new PassThrough(),
				type: TransformerType.FFmpegPCM,
			},
		];
		if (constraint === VOLUME_CONSTRAINT) {
			base.push({
				cost: 1,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				transformer: () => new VolumeTransformer({} as any),
				type: TransformerType.InlineVolume,
			});
		}

		return base as any[];
	});
});

beforeEach(() => {
	findPipeline.mockClear();
});

describe('createAudioResource', () => {
	test('Creates a resource from string path', () => {
		const resource = createAudioResource('mypath.mp3');
		expect(findPipeline).toHaveBeenCalledWith(StreamType.Arbitrary, NO_CONSTRAINT);
		expect(resource.volume).toBeUndefined();
	});

	test('Creates a resource from string path (volume)', () => {
		const resource = createAudioResource('mypath.mp3', { inlineVolume: true });
		expect(findPipeline).toHaveBeenCalledWith(StreamType.Arbitrary, VOLUME_CONSTRAINT);
		expect(resource.volume).toBeInstanceOf(VolumeTransformer);
	});

	test('Only infers type if not explicitly given', () => {
		const resource = createAudioResource(new opus.Encoder(), { inputType: StreamType.Arbitrary });
		expect(findPipeline).toHaveBeenCalledWith(StreamType.Arbitrary, NO_CONSTRAINT);
		expect(resource.volume).toBeUndefined();
	});

	test('Infers from opus.Encoder', () => {
		const resource = createAudioResource(new opus.Encoder(), { inlineVolume: true });
		expect(findPipeline).toHaveBeenCalledWith(StreamType.Opus, VOLUME_CONSTRAINT);
		expect(resource.volume).toBeInstanceOf(VolumeTransformer);
		expect(resource.encoder).toBeInstanceOf(opus.Encoder);
	});

	test('Infers from opus.OggDemuxer', () => {
		const resource = createAudioResource(new opus.OggDemuxer());
		expect(findPipeline).toHaveBeenCalledWith(StreamType.Opus, NO_CONSTRAINT);
		expect(resource.volume).toBeUndefined();
		expect(resource.encoder).toBeUndefined();
	});

	test('Infers from opus.WebmDemuxer', () => {
		const resource = createAudioResource(new opus.WebmDemuxer());
		expect(findPipeline).toHaveBeenCalledWith(StreamType.Opus, NO_CONSTRAINT);
		expect(resource.volume).toBeUndefined();
	});

	test('Infers from opus.Decoder', () => {
		const resource = createAudioResource(new opus.Decoder());
		expect(findPipeline).toHaveBeenCalledWith(StreamType.Raw, NO_CONSTRAINT);
		expect(resource.volume).toBeUndefined();
	});

	test('Infers from VolumeTransformer', () => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		const stream = new VolumeTransformer({} as any);
		const resource = createAudioResource(stream, { inlineVolume: true });
		expect(findPipeline).toHaveBeenCalledWith(StreamType.Raw, NO_CONSTRAINT);
		expect(resource.volume).toEqual(stream);
	});

	test('Falls back to Arbitrary for unknown stream type', () => {
		const resource = createAudioResource(new PassThrough());
		expect(findPipeline).toHaveBeenCalledWith(StreamType.Arbitrary, NO_CONSTRAINT);
		expect(resource.volume).toBeUndefined();
	});

	test('Appends silence frames when ended', async () => {
		const stream = Readable.from(Buffer.from([1]));

		const resource = new AudioResource([], [stream], null, 5);

		await started(resource);
		expect(resource.readable).toEqual(true);
		expect(resource.read()).toEqual(Buffer.from([1]));
		for (let index = 0; index < 5; index++) {
			await wait();
			expect(resource.readable).toEqual(true);
			expect(resource.read()).toEqual(SILENCE_FRAME);
		}

		await wait();
		expect(resource.readable).toEqual(false);
		expect(resource.read()).toEqual(null);
	});
});
