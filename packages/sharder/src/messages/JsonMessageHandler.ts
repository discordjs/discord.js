import { BaseMessageHandler } from './base/BaseMessageHandler.js';
import type { DeserializedMessage, MessageOp, SerializedMessage } from './base/IMessageHandler.js';

export class JsonMessageHandler extends BaseMessageHandler<string> {
	public deserialize(data: string): DeserializedMessage {
		return JSON.parse(data);
	}

	public serialize(body: unknown, op: MessageOp, id: number = this.lastId++): SerializedMessage<string> {
		return { id, body: JSON.stringify({ id, op, body }) };
	}
}
