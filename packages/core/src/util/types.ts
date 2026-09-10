import type { RequestData } from '@discordjs/rest';

/**
 * Per-request options accepted by API methods that do not take alternate authorization
 */
export type BaseRequestOptions = Pick<RequestData, 'dispatcher' | 'headers' | 'rejectOnRateLimit' | 'signal'>;

/**
 * Per-request options accepted by API methods that take an audit log reason but no alternate authorization
 */
export type BaseRequestOptionsWithReason = BaseRequestOptions & Pick<RequestData, 'reason'>;

/**
 * Per-request options accepted by API methods
 */
export type RequestOptions = BaseRequestOptions & Pick<RequestData, 'auth'>;

/**
 * Per-request options accepted by API methods that take an audit log reason
 */
export type RequestOptionsWithReason = Pick<RequestData, 'reason'> & RequestOptions;
