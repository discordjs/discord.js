import type { RateLimitData } from '../REST';
export declare class RateLimitError extends Error implements RateLimitData {
    timeToReset: number;
    limit: number;
    method: string;
    hash: string;
    url: string;
    route: string;
    majorParameter: string;
    global: boolean;
    constructor({ timeToReset, limit, method, hash, url, route, majorParameter, global }: RateLimitData);
    /**
     * The name of the error
     */
    get name(): string;
}
