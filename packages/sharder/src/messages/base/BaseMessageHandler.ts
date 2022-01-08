import type { DeserializedData, IMessageHandler, MessageOp, SerializedData } from './IMessageHandler';
import { createDeferredPromise, DeferredPromise } from '../../server/utils/utils';

export abstract class BaseMessageHandler<SerializedType = string | Buffer> implements IMessageHandler<SerializedType> {
	private lastId = 0;
	private readonly tracked = new Map<number, DeferredPromise>();

	public abstract serialize(data: unknown, op?: MessageOp, id?: number): SerializedData<SerializedType>;
	public abstract deserialize(data: SerializedType): DeserializedData;

	public abstract get name(): string;

	protected get nextId() {
		return this.lastId++;
	}

	public handle(id: number, data: unknown): void {
		const deferred = this.tracked.get(id);
		if (!deferred) return;

		this.tracked.delete(id);
		deferred.resolve(data);
	}

	public track(id: number): void {
		if (this.tracked.has(id)) throw new Error(`Duplicate message id: ${id}`);
		this.tracked.set(id, createDeferredPromise());
	}

	public untrack(id: number): void {
		const deferred = this.tracked.get(id);
		if (!deferred) return;

		this.tracked.delete(id);
		deferred.reject(new Error('Aborted tracking'));
	}

	public clear(): void {
		for (const deferred of this.tracked.values()) {
			deferred.reject(new Error('Aborted tracking'));
		}

		this.tracked.clear();
	}

	public waitForId(id: number): Promise<unknown> {
		return this.tracked.get(id)?.promise ?? Promise.reject(new Error(`The message id ${id} is not being tracked`));
	}

	public static build(): IMessageHandler {
		return Reflect.construct(this, []);
	}
}
