import { shouldUseGlobalFetchAndWebSocket } from '@discordjs/util';
import { setDefaultStrategy } from './environment.js';
import type { RESTOptions } from './shared.js';
import { makeRequest } from './strategies/undiciRequest.js';

// Global fetch's bundled dispatcher types may differ from the installed undici types.
setDefaultStrategy(shouldUseGlobalFetchAndWebSocket() ? (fetch as unknown as RESTOptions['makeRequest']) : makeRequest);

export * from './shared.js';
