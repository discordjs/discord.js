import type { GatewayOpcodeRateLimitMetadataMap } from 'discord-api-types/v10';

/**
 * Represents the error thrown when the gateway emits a RATE_LIMITED event after a certain request.
 */
export class GatewayRateLimitError extends Error {
	public override readonly name = GatewayRateLimitError.name;

	public constructor(
		/**
		 * The number of seconds to wait before retrying the request
		 */
		public readonly retryAfter: number,
		/**
		 * The opcode of the request that was rate limited
		 */
		public readonly opCode: keyof GatewayOpcodeRateLimitMetadataMap,
		/**
		 * Metadata associated with the rate limit, different depending on the OpCode
		 */
		public readonly meta: GatewayOpcodeRateLimitMetadataMap[keyof GatewayOpcodeRateLimitMetadataMap],
	) {
		super(`Request with opcode ${opCode} was rate limited. Retry after ${retryAfter} seconds.`);
	}
}
