import type { RPCErrorCodes, RPCErrorDispatchData } from 'discord-api-types/v10';

export class RPCEventError extends Error {
	public code?: RPCErrorCodes;

	public data?: RPCErrorDispatchData;

	public constructor(data: RPCErrorDispatchData | string) {
		if (typeof data === 'string') {
			super(data);
			return;
		}

		super(data.message);
		this.name = 'RPCEventError';
		this.code = data.code;
		this.data = data;
	}
}
