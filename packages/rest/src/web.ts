import { setDefaultStrategy } from './environment.js';

// This cast is needed because of a mismatch between the version of undici-types provided by @types/node and undici
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
setDefaultStrategy(fetch as typeof import('undici').fetch);

export * from './shared.js';
