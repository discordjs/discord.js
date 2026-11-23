import type { RequestData } from '@discordjs/rest';

/**
 * Request options that are always set by the API methods themselves
 */
type LocalRequestOptions = 'appendToFormData' | 'body' | 'files' | 'passThroughBody' | 'query' | 'versioned';

/**
 * Per-request options accepted by API methods that take an audit log reason
 */
export type RequestOptionsWithReason = Omit<RequestData, LocalRequestOptions>;

/**
 * Per-request options accepted by API methods
 */
export type RequestOptions = Omit<RequestOptionsWithReason, 'reason'>;

/**
 * Per-request options accepted by API methods that take an audit log reason but no alternate authorization
 */
export type BaseRequestOptionsWithReason = Omit<RequestOptionsWithReason, 'auth'>;

/**
 * Per-request options accepted by API methods that do not take alternate authorization
 */
export type BaseRequestOptions = Omit<RequestOptions, 'auth'>;
