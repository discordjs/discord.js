import type { RESTOptions } from './index.js';

// eslint-disable-next-line import/no-mutable-exports
let defaultStrategy: RESTOptions['makeRequest'];

export function setDefaultStrategy(newStrategy: RESTOptions['makeRequest']) {
	defaultStrategy = newStrategy;
}

export { defaultStrategy };
