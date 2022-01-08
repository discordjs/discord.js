import type { IClusterHandler } from './clusters/base/IClusterHandler';
import { MessageOp } from '../messages/base/IMessageHandler';
import type { NonNullObject } from '../utils/types';

export class ShardPing<ShardOptions = NonNullObject> {
	public lastSentTimestamp = -1;
	public lastReceivedTimestamp = -1;
	public lastLatency = -1;
	public readonly shard: IClusterHandler<ShardOptions>;

	private timeout: NodeJS.Timer | null = null;

	public constructor(shard: IClusterHandler<ShardOptions>) {
		this.shard = shard;
	}

	public start() {
		if (this.timeout !== null) return this;

		const { delay } = this.options;
		if (delay < 0 || delay === Infinity) return this.stop();

		this.timeout = setTimeout(() => void this.send(), delay).unref();

		return this;
	}

	public stop() {
		if (this.timeout === null) return this;

		clearTimeout(this.timeout);
		this.timeout = null;

		return this;
	}

	public async send() {
		this.lastSentTimestamp = Date.now();
		await this.shard.send(this.lastSentTimestamp, { opcode: MessageOp.Ping });

		// If the timeout is to be refreshed on send, refresh:
		if (!this.options.delaySinceReceived) this.timeout?.refresh();
	}

	public receive(timestamp: number) {
		this.lastReceivedTimestamp = Date.now();
		this.lastLatency = this.lastReceivedTimestamp - timestamp;

		// If the timeout is to be refreshed on receive, refresh:
		if (this.options.delaySinceReceived) this.timeout?.refresh();
	}

	public get options() {
		return this.shard.manager.pingOptions;
	}

	public get hasReceivedResponse() {
		return this.lastReceivedTimestamp >= this.lastSentTimestamp;
	}

	public get lastSentAt(): Date {
		return new Date(this.lastSentTimestamp);
	}

	public get lastReceivedAt(): Date {
		return new Date(this.lastReceivedTimestamp);
	}

	public get nextPingIn() {
		const { delay, delaySinceReceived } = this.options;
		return delay + (delaySinceReceived ? this.lastReceivedTimestamp : this.lastSentTimestamp);
	}
}

export interface ShardPingOptions {
	/**
	 * The delay in milliseconds between pings.
	 * @default 45_000
	 */
	delay?: number;

	/**
	 * Whether the next ping should happen after {@link ShardPing.lastReceivedTimestamp} or after {@link ShardPing.lastSentTimestamp}.
	 * @default false
	 */
	delaySinceReceived?: boolean;
}
