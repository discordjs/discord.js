import type { Class } from './index.js';

// @ts-expect-error
export interface Interface extends Class {
	kind: 'interface';
	classdesc: string;
}
