import { setDefaultStrategy } from './environment.js';
import { makeRequest } from './strategies/undiciRequest.js';

setDefaultStrategy(makeRequest);

export * from './index.js';
