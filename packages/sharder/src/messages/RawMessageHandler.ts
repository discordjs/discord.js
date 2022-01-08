import { BaseMessageHandler } from './base/BaseMessageHandler';
import { DeserializedData, MessageOp, SerializedData } from './base/IMessageHandler';

export class RawMessageHandler extends BaseMessageHandler<unknown> {
	public get name(): string {
		return 'raw';
	}

	public serialize(data: unknown, op: MessageOp = MessageOp.Message, id?: number): SerializedData<unknown> {
		id ??= this.nextId;
		return { id, body: { id, op, data } };
	}

	public deserialize(data: unknown): DeserializedData {
		return data as DeserializedData;
	}
}
