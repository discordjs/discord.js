import type { GatewayOpcodeRateLimitMetadataMap, GatewayRateLimitedDispatchData } from 'discord-api-types/v10';

/**
 * Represents the error thrown when the gateway emits a RATE_LIMITED event after a certain request.
 */
export class GatewayRateLimitError extends Error {
	public override readonly name = GatewayRateLimitError.name;

	/**
	 * The number of seconds to wait before retrying the request
	 */
	public readonly retryAfter: number;

	/**
	 * The opcode of the request that was rate limited
	 */
	public readonly opCode: keyof GatewayOpcodeRateLimitMetadataMap;

	/**
	 * Metadata associated with the rate limit, different depending on the OpCode
	 */
	public readonly meta: GatewayOpcodeRateLimitMetadataMap[keyof GatewayOpcodeRateLimitMetadataMap];

	public constructor(data: GatewayRateLimitedDispatchData<keyof GatewayOpcodeRateLimitMetadataMap>) {
		super(`Request with opcode ${data.opcode} was rate limited. Retry after ${data.retry_after} seconds.`);

		this.retryAfter = data.retry_after;
		this.opCode = data.opcode;
		this.meta = data.meta;
	}
}
