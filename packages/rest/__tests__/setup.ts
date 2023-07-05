import { setDefaultStrategy } from '../src/environment.js';
import { makeRequest } from '../src/strategies/undiciRequest.js';

setDefaultStrategy(makeRequest);
