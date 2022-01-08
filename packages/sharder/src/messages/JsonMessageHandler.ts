import { BaseMessageHandler } from './base/BaseMessageHandler';
import { DeserializedData, MessageOp, SerializedData } from './base/IMessageHandler';

export class JsonMessageHandler extends BaseMessageHandler<string> {
	public get name(): string {
		return 'json';
	}

	public serialize(data: unknown, op: MessageOp = MessageOp.Message, id?: number): SerializedData<string> {
		id ??= this.nextId;
		return { id, body: JSON.stringify({ id, op, data }) };
	}

	public deserialize(data: string): DeserializedData {
		return JSON.parse(data);
	}
}
