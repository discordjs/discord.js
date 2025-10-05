// @ts-nocheck
import { Buffer } from 'node:buffer';
import EventEmitter, { once } from 'node:events';
import process from 'node:process';
import { Readable } from 'node:stream';
import { opus as _opus } from 'prism-media';
import { describe, test, expect, vitest, type Mock, beforeAll, beforeEach } from 'vitest';
import { StreamType } from '../src/audio/index';
import { demuxProbe } from '../src/util/demuxProbe';

vitest.mock('prism-media');

const WebmDemuxer = _opus.WebmDemuxer as unknown as Mock<_opus.WebmDemuxer>;
const OggDemuxer = _opus.OggDemuxer as unknown as Mock<_opus.OggDemuxer>;

async function nextTick() {
	// eslint-disable-next-line no-promise-executor-return
	return new Promise((resolve) => process.nextTick(resolve));
}

async function* gen(num: number) {
	for (let index = 0; index < num; index++) {
		yield Buffer.from([index]);
		await nextTick();
	}
}

function range(num: number) {
	return Buffer.from(Array.from(Array.from({ length: num }).keys()));
}

const validHead = Buffer.from([
	0x4f, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64, 0x01, 0x02, 0x38, 0x01, 0x80, 0xbb, 0, 0, 0, 0, 0,
]);

const invalidHead = Buffer.from([
	0x4f, 0x70, 0x75, 0x73, 0x48, 0x65, 0x61, 0x64, 0x01, 0x01, 0x38, 0x01, 0x80, 0xbb, 0, 0, 0, 0, 0,
]);

async function collectStream(stream: Readable): Promise<Buffer> {
	let output = Buffer.alloc(0);
	await once(stream, 'readable');
	for await (const data of stream) {
		output = Buffer.concat([output, data]);
	}

	return output;
}

describe('demuxProbe', () => {
	const webmWrite: Mock<(buffer: Buffer) => void> = vitest.fn();
	const oggWrite: Mock<(buffer: Buffer) => void> = vitest.fn();

	beforeAll(() => {
		WebmDemuxer.prototype = {
			...WebmDemuxer,
			...EventEmitter.prototype,
			write: webmWrite,
		};
		OggDemuxer.prototype = {
			...OggDemuxer,
			...EventEmitter.prototype,
			write: oggWrite,
		};
	});

	beforeEach(() => {
		webmWrite.mockReset();
		oggWrite.mockReset();
	});

	test('Defaults to arbitrary', async () => {
		const stream = Readable.from(gen(10), { objectMode: false });
		const probe = await demuxProbe(stream);
		expect(probe.type).toEqual(StreamType.Arbitrary);
		await expect(collectStream(probe.stream)).resolves.toEqual(range(10));
	});

	test('Detects WebM', async () => {
		const stream = Readable.from(gen(10), { objectMode: false });
		webmWrite.mockImplementation(function mock(data: Buffer) {
			if (data[0] === 5) {
				this.emit('head', validHead);
			}
		} as any);
		const probe = await demuxProbe(stream);
		expect(probe.type).toEqual(StreamType.WebmOpus);
		await expect(collectStream(probe.stream)).resolves.toEqual(range(10));
	});

	test('Detects Ogg', async () => {
		const stream = Readable.from(gen(10), { objectMode: false });
		oggWrite.mockImplementation(function mock(data: Buffer) {
			if (data[0] === 5) {
				this.emit('head', validHead);
			}
		} as any);
		const probe = await demuxProbe(stream);
		expect(probe.type).toEqual(StreamType.OggOpus);
		await expect(collectStream(probe.stream)).resolves.toEqual(range(10));
	});

	test('Rejects invalid OpusHead', async () => {
		const stream = Readable.from(gen(10), { objectMode: false });
		oggWrite.mockImplementation(function mock(data: Buffer) {
			if (data[0] === 5) {
				this.emit('head', invalidHead);
			}
		} as any);
		const probe = await demuxProbe(stream);
		expect(probe.type).toEqual(StreamType.Arbitrary);
		await expect(collectStream(probe.stream)).resolves.toEqual(range(10));
	});

	test('Gives up on larger streams', async () => {
		const stream = Readable.from(gen(8_192), { objectMode: false });
		const probe = await demuxProbe(stream);
		expect(probe.type).toEqual(StreamType.Arbitrary);
		await expect(collectStream(probe.stream)).resolves.toEqual(range(8_192));
	});

	test('Propagates errors', async () => {
		const testError = new Error('test error');
		const stream = new Readable({
			read() {
				this.destroy(testError);
			},
		});
		await expect(demuxProbe(stream)).rejects.toEqual(testError);
	});
});
