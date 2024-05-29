import { Buffer } from 'node:buffer';
import { encode, decode } from '@msgpack/msgpack';
import type { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';

/**
 * Base options for a broker implementation
 */
export interface BaseBrokerOptions {
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
}

/**
 * Default broker options
 */
export const DefaultBrokerOptions = {
	encode: (data): Buffer => {
		const encoded = encode(data);
		return Buffer.from(encoded.buffer, encoded.byteOffset, encoded.byteLength);
	},
	decode: (data): unknown => decode(data),
} as const satisfies Required<BaseBrokerOptions>;

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
	 * Subscribes to the given events
	 */
	subscribe(events: (keyof TEvents)[]): Promise<void>;
	/**
	 * Unsubscribes from the given events
	 */
	unsubscribe(events: (keyof TEvents)[]): Promise<void>;
}

export interface IPubSubBroker<TEvents extends Record<string, any>>
	extends IBaseBroker<TEvents>,
		AsyncEventEmitter<ToEventMap<TEvents>> {
	/**
	 * Publishes an event
	 */
	publish<Event extends keyof TEvents>(event: Event, data: TEvents[Event]): Promise<void>;
}

export interface IRPCBroker<TEvents extends Record<string, any>, TResponses extends Record<keyof TEvents, any>>
	extends IBaseBroker<TEvents>,
		AsyncEventEmitter<ToEventMap<TEvents, TResponses>> {
	/**
	 * Makes an RPC call
	 */
	call<Event extends keyof TEvents>(
		event: Event,
		data: TEvents[Event],
		timeoutDuration?: number,
	): Promise<TResponses[Event]>;
}
