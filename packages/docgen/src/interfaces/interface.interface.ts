import type { Class } from './index.js';

// @ts-expect-error: Inheritance type error
export interface Interface extends Class {
	classdesc: string;
	kind: 'interface';
}
