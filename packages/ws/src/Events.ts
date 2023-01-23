import type { GatewayDispatchPayload, GatewayReadyDispatchData } from 'discord-api-types/v10';
import { Evt, type Operator, type ToNonPostableEvt } from 'evt';

export interface CloseEvent {
	code: number;
	shardId: number;
}

export interface ConnectionErrorEvent {
	error: Error;
	shardId: number;
}

export interface DebugEvent {
	message: string;
	shardId: number;
}

export interface DispatchEvent {
	data: GatewayDispatchPayload;
	shardId: number;
}

export interface HelloEvent {
	shardId: number;
}

export interface ReadyEvent {
	data: GatewayReadyDispatchData;
	shardId: number;
}

export interface ResumedEvent {
	shardId: number;
}

export interface HeartbeatCompleteEvent {
	ackAt: number;
	heartbeatAt: number;
	latency: number;
	shardId: number;
}

export const InternalEvents = {
	Close: Evt.create<CloseEvent>(),
	ConnectionError: Evt.create<ConnectionErrorEvent>(),
	Debug: Evt.create<DebugEvent>(),
	Dispatch: Evt.create<DispatchEvent>(),
	Hello: Evt.create<HelloEvent>(),
	Ready: Evt.create<ReadyEvent>(),
	Resumed: Evt.create<ResumedEvent>(),
	HeartbeatComplete: Evt.create<HeartbeatCompleteEvent>(),
} as const;

export const Events = Object.fromEntries(
	Object.entries(InternalEvents).map(([key, evt]) => [key, Evt.asNonPostable(evt)]),
) as {
	readonly [Key in keyof typeof InternalEvents]: ToNonPostableEvt<(typeof InternalEvents)[Key]>;
};

export function filterEvtByShard<T extends { shardId: number }>(shardId: number): Operator.fλ<T, T> {
	return (data: T) => (data.shardId === shardId ? [data] : null);
}
