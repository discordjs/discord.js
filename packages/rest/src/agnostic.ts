import { shouldUseGlobalFetchAndWebSocket } from '@discordjs/util';
import { setDefaultStrategy } from './environment.js';
import { makeRequest } from './strategies/undiciRequest.js';

setDefaultStrategy(shouldUseGlobalFetchAndWebSocket() ? makeRequest : fetch);

export * from './index.js';
