import { createDeferredPromise, type DeferredPromise } from '../../utils/DeferredPromise.js';
import type {
	DeserializedMessage,
	IMessageHandler,
	MessageOp,
	SerializedInput,
	SerializedMessage,
} from './IMessageHandler.js';

export abstract class BaseMessageHandler<SerializedType = SerializedInput> implements IMessageHandler<SerializedType> {
	protected lastId = 0;

	private readonly tracked = new Map<number, DeferredPromise>();

	public abstract deserialize(data: SerializedType): DeserializedMessage;
	public abstract serialize(body: unknown, op: MessageOp, id?: number | undefined): SerializedMessage<SerializedType>;

	public handle(id: number, data: unknown): void {
		const deferred = this.tracked.get(id);
		if (!deferred) return;

		this.tracked.delete(id);
		deferred.resolve(data);
	}

	public track(id: number): void {
		if (this.tracked.has(id)) throw new Error(`Cannot track '${id}' twice`);
		this.tracked.set(id, createDeferredPromise());
	}

	public untrack(id: number): void {
		const deferred = this.tracked.get(id);
		if (!deferred) return;

		this.tracked.delete(id);
		deferred.reject(new Error('Aborted tracking'));
	}

	public async waitForId(id: number): Promise<unknown> {
		return this.tracked.get(id)?.promise ?? Promise.reject(new Error(`The message id ${id} is not being tracked`));
	}
}
