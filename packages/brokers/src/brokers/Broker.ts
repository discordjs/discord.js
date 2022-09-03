import { Buffer } from 'node:buffer';
import { randomBytes } from 'node:crypto';
import { encode, decode } from '@msgpack/msgpack';
import type { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';

/**
 * Base options for a broker implementation
 */
export interface BaseBrokerOptions {
	/**
	 * How long to block for messages when polling
	 */
	blockTimeout?: number;
	/**
	 * Function to use for decoding messages
	 */
	// eslint-disable-next-line @typescript-eslint/method-signature-style
	decode?: (data: Buffer) => unknown;
	/**
	 * Function to use for encoding messages
	 */
	// eslint-disable-next-line @typescript-eslint/method-signature-style
	encode?: (data: unknown) => Buffer;
	/**
	 * Max number of messages to poll at once
	 */
	maxChunk?: number;
	/**
	 * Unique consumer name. See: https://redis.io/commands/xreadgroup/
	 */
	name?: string;
}

export const DefaultBrokerOptions: Required<BaseBrokerOptions> = {
	name: randomBytes(20).toString('hex'),
	maxChunk: 10,
	blockTimeout: 5_000,
	encode: (data): Buffer => {
		const encoded = encode(data);
		return Buffer.from(encoded.buffer, encoded.byteOffset, encoded.byteLength);
	},
	decode: (data): unknown => decode(data),
};

export type ToEventMap<
	TRecord extends Record<string, any>,
	TResponses extends Record<keyof TRecord, any> | undefined = undefined,
> = {
	[TKey in keyof TRecord]: [
		event: TResponses extends Record<keyof TRecord, any>
			? { ack(): Promise<void>; reply(data: TResponses[TKey]): Promise<void> }
			: { ack(): Promise<void> } & { data: TRecord[TKey] },
	];
} & { [K: string]: any };

export interface IBaseBroker<TEvents extends Record<string, any>> {
	/**
	 * Subscribes to the given events, grouping them by the given group name
	 */
	subscribe(group: string, events: (keyof TEvents)[]): Promise<void>;
	/**
	 * Unsubscribes from the given events - it's required to pass the same group name as when subscribing for proper cleanup
	 */
	unsubscribe(group: string, events: (keyof TEvents)[]): Promise<void>;
}

export interface IPubSubBroker<TEvents extends Record<string, any>>
	extends IBaseBroker<TEvents>,
		AsyncEventEmitter<ToEventMap<TEvents>> {
	/**
	 * Publishes an event
	 */
	publish<T extends keyof TEvents>(event: T, data: TEvents[T]): Promise<void>;
}

export interface IRPCBroker<TEvents extends Record<string, any>, TResponses extends Record<keyof TEvents, any>>
	extends IBaseBroker<TEvents>,
		AsyncEventEmitter<ToEventMap<TEvents, TResponses>> {
	/**
	 * Makes an RPC call
	 */
	call<T extends keyof TEvents>(event: T, data: TEvents[T], timeoutDuration?: number): Promise<TResponses[T]>;
}
