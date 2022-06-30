import type { IncomingMessage, ServerResponse } from 'node:http';

/**
 * Represents a potentially awaitable value
 */
export type Awaitable<T> = T | PromiseLike<T>;

/**
 * Represents a simple HTTP request handler
 */
export type RequestHandler = (req: IncomingMessage, res: ServerResponse) => Awaitable<void>;
