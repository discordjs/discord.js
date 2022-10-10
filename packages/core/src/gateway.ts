import EventEmitter from 'node:events';
import type { REST } from '@discordjs/rest';
import type { WebSocketManager } from '@discordjs/ws';
import { WebSocketShardEvents } from '@discordjs/ws';
import type { APIInteraction, APIMessage, GatewayReadyDispatchData } from 'discord-api-types/v10';
import { GatewayDispatchEvents } from 'discord-api-types/v10';

export interface MappedEvents {
	interactionCreate: [{ api: REST; interaction: APIInteraction }];
	messageCreate: [{ api: REST; message: APIMessage }];
}

export class Events extends EventEmitter {
	public constructor(rest: REST, ws: WebSocketManager) {
		super();
		ws.on(WebSocketShardEvents.Dispatch, ({ data }) => {
			switch (data.t) {
				case GatewayDispatchEvents.MessageCreate:
					this.emit('messageCreate', { api: rest, message: data.d });
					break;
				case GatewayDispatchEvents.InteractionCreate:
					this.emit('interactionCreate', { api: rest, interaction: data.d });
					break;
				default:
					break;
			}
		});
	}

	public async login(): Promise<GatewayReadyDispatchData> {
		return new Promise((resolve, reject) => {
			this.once('ready', (dispatch) => resolve(dispatch.data));
			this.once('error', reject);
		});
	}
}

export interface Events {
	on<K extends keyof MappedEvents>(event: K, listener: (...args: MappedEvents[K]) => void): this;
}
