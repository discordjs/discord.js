import { serialize, deserialize } from 'node:v8';
import { BaseMessageHandler } from './base/BaseMessageHandler';
import { DeserializedData, MessageOp, SerializedData } from './base/IMessageHandler';

export class BinaryMessageHandler extends BaseMessageHandler<Buffer> {
	public get name(): string {
		return 'binary';
	}

	public serialize(data: unknown, op: MessageOp = MessageOp.Message, id?: number): SerializedData<Buffer> {
		id ??= this.nextId;
		return { id, body: serialize({ id, op, data }) };
	}

	public deserialize(data: Buffer): DeserializedData {
		return deserialize(data);
	}
}
