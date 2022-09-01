import type { Class } from './index.js';

// @ts-expect-error inheritance type error
export interface Interface extends Class {
	classdesc: string;
	kind: 'interface';
}
