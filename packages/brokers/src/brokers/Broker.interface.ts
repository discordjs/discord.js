import { randomBytes } from 'crypto';
import { encode, decode } from '@msgpack/msgpack';
import type { AsyncEventEmitter } from '@vladfrangu/async_event_emitter';

export interface BaseBrokerOptions {
	name?: string;
	maxChunk?: number;
	blockInterval?: number;
	encode?: (data: unknown) => Buffer;
	decode?: (data: Buffer) => unknown;
}

export const DefaultBrokerOptions: Required<BaseBrokerOptions> = {
	name: randomBytes(20).toString('hex'),
	maxChunk: 10,
	blockInterval: 5_000,
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
		event: { data: TRecord[TKey] } & (TResponses extends Record<keyof TRecord, any>
			? { ack: () => Promise<void>; reply: (data: TResponses[TKey]) => Promise<void> }
			: { ack: () => Promise<void> }),
	];
} & { [K: string]: any };

export interface IBaseBroker<TEvents extends Record<string, any>> {
	subscribe: (group: string, events: (keyof TEvents)[]) => Promise<void>;
	unsubscribe: (group: string, events: (keyof TEvents)[]) => Promise<void>;
}

export interface IPubSubBroker<TEvents extends Record<string, any>>
	extends IBaseBroker<TEvents>,
		AsyncEventEmitter<ToEventMap<TEvents>> {
	publish: <T extends keyof TEvents>(event: T, data: TEvents[T]) => Promise<void>;
}

export interface IRPCBroker<TEvents extends Record<string, any>, TResponses extends Record<keyof TEvents, any>>
	extends IBaseBroker<TEvents>,
		AsyncEventEmitter<ToEventMap<TEvents, TResponses>> {
	call: <T extends keyof TEvents>(event: T, data: TEvents[T], timeoutDuration?: number) => Promise<TResponses[T]>;
}
