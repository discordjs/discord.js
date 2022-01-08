import { BinaryMessageHandler } from './BinaryMessageHandler';
import { JsonMessageHandler } from './JsonMessageHandler';
import { RawMessageHandler } from './RawMessageHandler';
import type { IMessageHandlerConstructor } from './base/IMessageHandler';

export * from './base/BaseMessageHandler';
export * from './base/IMessageHandler';
export * from './BinaryMessageHandler';
export * from './JsonMessageHandler';
export * from './RawMessageHandler';

export const messageHandlers = new Map<keyof MessageHandlers, IMessageHandlerConstructor<any>>([
	['binary', BinaryMessageHandler],
	['json', JsonMessageHandler],
	['raw', RawMessageHandler],
]);

export interface MessageHandlers {
	binary: BinaryMessageHandler;
	json: JsonMessageHandler;
	raw: RawMessageHandler;
}
