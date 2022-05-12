/// <reference types="node" />
import { EventEmitter } from 'node:events';
import Collection from '@discordjs/collection';
import type { BodyInit } from 'node-fetch';
import type { RESTOptions, RestEvents } from './REST';
import type { IHandler } from './handlers/IHandler';
/**
 * Represents a file to be added to the request
 */
export interface RawFile {
    /**
     * The name of the file
     */
    name: string;
    /**
     * An explicit key to use for key of the formdata field for this file.
     * When not provided, the index of the file in the files array is used in the form `files[${index}]`.
     * If you wish to alter the placeholder snowflake, you must provide this property in the same form (`files[${placeholder}]`)
     */
    key?: string;
    /**
     * The actual data for the file
     */
    data: string | number | boolean | Buffer;
}
/**
 * Represents possible data to be given to an endpoint
 */
export interface RequestData {
    /**
     * Whether to append JSON data to form data instead of `payload_json` when sending files
     */
    appendToFormData?: boolean;
    /**
     * If this request needs the `Authorization` header
     * @default true
     */
    auth?: boolean;
    /**
     * The authorization prefix to use for this request, useful if you use this with bearer tokens
     * @default 'Bot'
     */
    authPrefix?: 'Bot' | 'Bearer';
    /**
     * The body to send to this request.
     * If providing as BodyInit, set `passThroughBody: true`
     */
    body?: BodyInit | unknown;
    /**
     * Files to be attached to this request
     */
    files?: RawFile[] | undefined;
    /**
     * Additional headers to add to this request
     */
    headers?: Record<string, string>;
    /**
     * Whether to pass-through the body property directly to `fetch()`.
     * <warn>This only applies when files is NOT present</warn>
     */
    passThroughBody?: boolean;
    /**
     * Query string parameters to append to the called endpoint
     */
    query?: URLSearchParams;
    /**
     * Reason to show in the audit logs
     */
    reason?: string;
    /**
     * If this request should be versioned
     * @default true
     */
    versioned?: boolean;
}
/**
 * Possible headers for an API call
 */
export interface RequestHeaders {
    Authorization?: string;
    'User-Agent': string;
    'X-Audit-Log-Reason'?: string;
}
/**
 * Possible API methods to be used when doing requests
 */
export declare const enum RequestMethod {
    Delete = "delete",
    Get = "get",
    Patch = "patch",
    Post = "post",
    Put = "put"
}
export declare type RouteLike = `/${string}`;
/**
 * Internal request options
 *
 * @internal
 */
export interface InternalRequest extends RequestData {
    method: RequestMethod;
    fullRoute: RouteLike;
}
export declare type HandlerRequestData = Pick<InternalRequest, 'files' | 'body' | 'auth'>;
/**
 * Parsed route data for an endpoint
 *
 * @internal
 */
export interface RouteData {
    majorParameter: string;
    bucketRoute: string;
    original: RouteLike;
}
/**
 * Represents a hash and its associated fields
 *
 * @internal
 */
export interface HashData {
    value: string;
    lastAccess: number;
}
export interface RequestManager {
    on: (<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void) => this) & (<S extends string | symbol>(event: Exclude<S, keyof RestEvents>, listener: (...args: any[]) => void) => this);
    once: (<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void) => this) & (<S extends string | symbol>(event: Exclude<S, keyof RestEvents>, listener: (...args: any[]) => void) => this);
    emit: (<K extends keyof RestEvents>(event: K, ...args: RestEvents[K]) => boolean) & (<S extends string | symbol>(event: Exclude<S, keyof RestEvents>, ...args: any[]) => boolean);
    off: (<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void) => this) & (<S extends string | symbol>(event: Exclude<S, keyof RestEvents>, listener: (...args: any[]) => void) => this);
    removeAllListeners: (<K extends keyof RestEvents>(event?: K) => this) & (<S extends string | symbol>(event?: Exclude<S, keyof RestEvents>) => this);
}
/**
 * Represents the class that manages handlers for endpoints
 */
export declare class RequestManager extends EventEmitter {
    #private;
    /**
     * The number of requests remaining in the global bucket
     */
    globalRemaining: number;
    /**
     * The promise used to wait out the global rate limit
     */
    globalDelay: Promise<void> | null;
    /**
     * The timestamp at which the global bucket resets
     */
    globalReset: number;
    /**
     * API bucket hashes that are cached from provided routes
     */
    readonly hashes: Collection<string, HashData>;
    /**
     * Request handlers created from the bucket hash and the major parameters
     */
    readonly handlers: Collection<string, IHandler>;
    private hashTimer;
    private handlerTimer;
    private agent;
    readonly options: RESTOptions;
    constructor(options: Partial<RESTOptions>);
    private setupSweepers;
    /**
     * Sets the authorization token that should be used for requests
     * @param token The authorization token to use
     */
    setToken(token: string): this;
    /**
     * Queues a request to be sent
     * @param request All the information needed to make a request
     * @returns The response from the api request
     */
    queueRequest(request: InternalRequest): Promise<unknown>;
    /**
     * Creates a new rate limit handler from a hash, based on the hash and the major parameter
     * @param hash The hash for the route
     * @param majorParameter The major parameter for this handler
     * @private
     */
    private createHandler;
    /**
     * Formats the request data to a usable format for fetch
     * @param request The request data
     */
    private resolveRequest;
    /**
     * Stops the hash sweeping interval
     */
    clearHashSweeper(): void;
    /**
     * Stops the request handler sweeping interval
     */
    clearHandlerSweeper(): void;
    /**
     * Generates route data for an endpoint:method
     * @param endpoint The raw endpoint to generalize
     * @param method The HTTP method this endpoint is called without
     * @private
     */
    private static generateRouteData;
}
