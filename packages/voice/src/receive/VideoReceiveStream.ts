import type { Buffer } from 'node:buffer';
import process from 'node:process';
import { Readable, type ReadableOptions } from 'node:stream';
import { EndBehaviorType, type EndBehavior } from './AudioReceiveStream';

/**
 * A parsed, decrypted video RTP packet (or, when DAVE end-to-end encryption is
 * active, a fully decrypted video frame).
 */
export interface VideoRtpPacket {
	/**
	 * Whether the RTP marker bit is set (end of frame).
	 */
	marker: boolean;

	/**
	 * The raw payload: coded video data (e.g. H.264 NAL units), still in RTP
	 * packetized form (FU-A fragments are not reassembled).
	 */
	payload: Buffer;

	/**
	 * The RTP payload type of the packet, e.g. 101 for H.264.
	 */
	payloadType: number;

	/**
	 * Whether this packet is a retransmission recovered from an RTX stream.
	 */
	retransmitted: boolean;

	/**
	 * The RTP sequence number of the packet.
	 *
	 * @remarks
	 * For retransmitted (RTX) packets this is the original sequence number of
	 * the recovered packet. For DAVE frames this is the sequence number of the
	 * final packet of the frame.
	 */
	sequence: number;

	/**
	 * The SSRC of the (media) stream this packet belongs to.
	 */
	ssrc: number;

	/**
	 * The RTP timestamp of the packet. All packets of a frame share a timestamp.
	 */
	timestamp: number;
}

export interface VideoReceiveStreamOptions extends ReadableOptions {
	end: EndBehavior;
}

export function createDefaultVideoReceiveStreamOptions(): VideoReceiveStreamOptions {
	return {
		end: {
			behavior: EndBehaviorType.Manual,
		},
	};
}

/**
 * A readable stream of decoded transport-level video packets received from a
 * specific user in a Discord voice connection.
 *
 * @remarks
 * The stream operates in object mode and pushes {@link VideoRtpPacket}s.
 * Payloads are still RTP-packetized video (H.264/VP8/...); use an
 * RTP-aware decoder such as ffmpeg to decode them.
 */
export class VideoReceiveStream extends Readable {
	/**
	 * The end behavior of the receive stream.
	 */
	public readonly end: EndBehavior;

	private endTimeout?: NodeJS.Timeout;

	public constructor(options: VideoReceiveStreamOptions) {
		const { end, ...rest } = options;

		super({
			...rest,
			objectMode: true,
		});

		this.end = end;
	}

	public override push(packet: VideoRtpPacket | null) {
		if (
			packet &&
			(this.end.behavior === EndBehaviorType.AfterInactivity || this.end.behavior === EndBehaviorType.AfterSilence)
		) {
			this.renewEndTimeout(this.end);
		}

		if (packet === null) {
			// null marks EOF for stream
			process.nextTick(() => this.destroy());
		}

		return super.push(packet);
	}

	private renewEndTimeout(end: EndBehavior & { duration: number }) {
		if (this.endTimeout) {
			clearTimeout(this.endTimeout);
		}

		this.endTimeout = setTimeout(() => this.push(null), end.duration);
	}

	public override _read() {}
}
