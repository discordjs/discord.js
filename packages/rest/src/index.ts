import { shouldUseGlobalFetchAndWebSocket } from '@discordjs/util';
import { setDefaultStrategy } from './environment.js';
import { makeRequest } from './strategies/undiciRequest.js';

// This cast is needed because of a mismatch between the version of undici-types provided by @types/node and undici
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
setDefaultStrategy(shouldUseGlobalFetchAndWebSocket() ? (fetch as typeof import('undici').fetch) : makeRequest);

export * from './shared.js';
