import { clearTimeout, setTimeout } from 'node:timers';
import type { IChannel } from '../channels/base/IChannel.js';
import { MessageOp } from '../messages/base/IMessageHandler.js';

export class ShardPing {
	/**
	 * The channel this ping handler is for.
	 */
	public readonly channel: IChannel;

	/**
	 * The delay in milliseconds between pings. Starts upon ACK response.
	 */
	public readonly delay: number;

	/**
	 * The maximum wait time in milliseconds since the PING was sent, before considering the shard as dead.
	 */
	public readonly wait: number;

	/**
	 * The last time the handler has sent a ping message.
	 */
	public lastSentTimestamp = -1;

	/**
	 * The last time the handler has received a ping message.
	 */
	public lastReceivedTimestamp = -1;

	/**
	 * The latency between the last {@link lastSentTimestamp} and {@link lastReceivedTimestamp}, after the update of the
	 * latter.
	 */
	public lastLatency = -1;

	private timeout: NodeJS.Timer | null = null;

	public constructor(channel: IChannel) {
		this.channel = channel;
		this.delay = channel.manager.pingOptions.delay ?? 45_000;
		this.wait = channel.manager.pingOptions.wait ?? 5_000;
	}

	public start() {
		if (this.timeout !== null) return;
		if (this.delay === -1) {
			this.stop();
			return;
		}

		this.timeout = setTimeout(() => void this.send(), this.delay);
	}

	public stop() {
		if (this.timeout === null) return;

		clearTimeout(this.timeout);
		this.timeout = null;
	}

	public async send() {
		this.lastSentTimestamp = Date.now();
		await this.channel.send(this.lastSentTimestamp, { opcode: MessageOp.Ping });
	}

	public receive(timestamp: number) {
		this.lastReceivedTimestamp = Date.now();
		this.lastLatency = this.lastReceivedTimestamp - timestamp;
		this.timeout?.refresh();
	}

	public hasReceivedAck() {
		return this.lastReceivedTimestamp >= this.lastSentTimestamp;
	}

	public get lastSentAt() {
		return new Date(this.lastSentTimestamp);
	}

	public get lastReceivedAt() {
		return new Date(this.lastReceivedTimestamp);
	}
}

export interface ShardPingOptions {
	/**
	 * The delay in milliseconds between pings. Starts upon ACK response.
	 *
	 * Defaults to `45_000` (45 seconds).
	 */
	delay?: number;

	/**
	 * The maximum wait time in milliseconds since the PING was sent, before considering the shard as dead.
	 *
	 * Defaults to `5_000` (5 seconds).
	 */
	wait?: number;
}
