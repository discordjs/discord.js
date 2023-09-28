import { Blob } from 'node:buffer';
import { shouldUseGlobalFetchAndWebSocket } from '@discordjs/util';
import { FormData } from 'undici';
import { setDefaultStrategy } from './environment.js';
import { makeRequest } from './strategies/undiciRequest.js';

// TODO(ckohen): remove once node engine req is bumped to > v18
(globalThis as any).FormData ??= FormData;
globalThis.Blob ??= Blob;

setDefaultStrategy(shouldUseGlobalFetchAndWebSocket() ? fetch : makeRequest);

export * from './shared.js';
