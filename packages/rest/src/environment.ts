import type { RESTOptions } from './index.js';

let defaultStrategy: RESTOptions['makeRequest'];

export function setDefaultStrategy(newStrategy: RESTOptions['makeRequest']) {
	defaultStrategy = newStrategy;
}

export function getDefaultStrategy() {
	return defaultStrategy;
}
