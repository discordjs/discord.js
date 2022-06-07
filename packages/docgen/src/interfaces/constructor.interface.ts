import type { Access, Item, Param } from './index.js';

export interface Constructor extends Item {
	kind: 'constructor';
	memberof: string;
	see?: string[];
	access?: Access;
	params?: Param[];
}
