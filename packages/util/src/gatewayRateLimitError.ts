import type { GatewayOpcodeRateLimitMetadataMap, GatewayRateLimitedDispatchData } from 'discord-api-types/v10';

/**
 * Represents the error thrown when the gateway emits a `RATE_LIMITED` event after a certain request.
 */
export class GatewayRateLimitError extends Error {
	public override readonly name = GatewayRateLimitError.name;

	public constructor(
		/**
		 * The data associated with the rate limit event
		 */
		public readonly data: GatewayRateLimitedDispatchData<keyof GatewayOpcodeRateLimitMetadataMap>,
		/**
		 * The payload data that lead to this rate limit
		 *
		 * @privateRemarks
		 * Too complicated to type properly here (i.e. extract the ['data']
		 * of event payloads that have t = keyof GatewayOpcodeRateLimitMetadataMap)
		 */
		public readonly payload: unknown,
	) {
		super(`Request with opcode ${data.opcode} was rate limited. Retry after ${data.retry_after} seconds.`);
	}
}
