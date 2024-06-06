import type { RESTOptions } from './shared.js';

let defaultStrategy: RESTOptions['makeRequest'];

export function setDefaultStrategy(newStrategy: RESTOptions['makeRequest']) {
	defaultStrategy = newStrategy;
}

export function getDefaultStrategy() {
	return defaultStrategy;
}
