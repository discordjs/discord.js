import { Buffer } from 'node:buffer';
import process from 'node:process';
import { Readable } from 'node:stream';
import prism from 'prism-media';
import { StreamType } from '..';
import { noop } from './util';

/**
 * Takes an Opus Head, and verifies whether the associated Opus audio is suitable to play in a Discord voice channel.
 *
 * @param opusHead - The Opus Head to validate
 * @returns `true` if suitable to play in a Discord voice channel, otherwise `false`
 */
export function validateDiscordOpusHead(opusHead: Buffer): boolean {
	const channels = opusHead.readUInt8(9);
	const sampleRate = opusHead.readUInt32LE(12);
	return channels === 2 && sampleRate === 48_000;
}

/**
 * The resulting information after probing an audio stream
 */
export interface ProbeInfo {
	/**
	 * The readable audio stream to use. You should use this rather than the input stream, as the probing
	 * function can sometimes read the input stream to its end and cause the stream to close.
	 */
	stream: Readable;

	/**
	 * The recommended stream type for this audio stream.
	 */
	type: StreamType;
}

/**
 * Attempt to probe a readable stream to figure out whether it can be demuxed using an Ogg or WebM Opus demuxer.
 *
 * @param stream - The readable stream to probe
 * @param probeSize - The number of bytes to attempt to read before giving up on the probe
 * @param validator - The Opus Head validator function
 * @experimental
 */
export async function demuxProbe(
	stream: Readable,
	probeSize = 1_024,
	validator = validateDiscordOpusHead,
): Promise<ProbeInfo> {
	return new Promise((resolve, reject) => {
		// Preconditions
		if (stream.readableObjectMode) {
			reject(new Error('Cannot probe a readable stream in object mode'));
			return;
		}

		if (stream.readableEnded) {
			reject(new Error('Cannot probe a stream that has ended'));
			return;
		}

		let readBuffer = Buffer.alloc(0);

		let resolved: StreamType | undefined;

		const finish = (type: StreamType) => {
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			stream.off('data', onData);
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			stream.off('close', onClose);
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			stream.off('end', onClose);
			stream.pause();
			resolved = type;
			if (stream.readableEnded) {
				resolve({
					stream: Readable.from(readBuffer),
					type,
				});
			} else {
				if (readBuffer.length > 0) {
					stream.push(readBuffer);
				}

				resolve({
					stream,
					type,
				});
			}
		};

		const foundHead = (type: StreamType) => (head: Buffer) => {
			if (validator(head)) {
				finish(type);
			}
		};

		const webm = new prism.opus.WebmDemuxer();
		webm.once('error', noop);
		webm.on('head', foundHead(StreamType.WebmOpus));

		const ogg = new prism.opus.OggDemuxer();
		ogg.once('error', noop);
		ogg.on('head', foundHead(StreamType.OggOpus));

		const onClose = () => {
			if (!resolved) {
				finish(StreamType.Arbitrary);
			}
		};

		const onData = (buffer: Buffer) => {
			readBuffer = Buffer.concat([readBuffer, buffer]);

			webm.write(buffer);
			ogg.write(buffer);

			if (readBuffer.length >= probeSize) {
				stream.off('data', onData);
				stream.pause();
				process.nextTick(onClose);
			}
		};

		stream.once('error', reject);
		stream.on('data', onData);
		stream.once('close', onClose);
		stream.once('end', onClose);
	});
}
