import { setDefaultStrategy } from './environment.js';
import type { RESTOptions } from './shared.js';

// Global fetch's bundled dispatcher types may differ from the installed undici types.
setDefaultStrategy(fetch as unknown as RESTOptions['makeRequest']);

export * from './shared.js';
