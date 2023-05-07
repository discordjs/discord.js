import type { GatewayDispatchEvents, GatewayDispatchPayload, GatewaySendPayload } from 'discord-api-types/v10';

// need this to be its own type for some reason, the compiler doesn't behave the same way if we in-line it
type _DiscordEvents = {
	[K in GatewayDispatchEvents]: GatewayDispatchPayload & {
		t: K;
	};
};

export type DiscordEvents = {
	// @ts-expect-error - unclear why this ignore is needed, might be because dapi-types is missing some events from the union again
	[K in keyof _DiscordEvents]: _DiscordEvents[K]['d'];
} & {
	gateway_send: GatewaySendPayload;
};
