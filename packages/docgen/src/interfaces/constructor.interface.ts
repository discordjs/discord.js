import type { Access, Item, Param } from './index.js';

export interface Constructor extends Item {
	access?: Access;
	kind: 'constructor';
	memberof: string;
	params?: Param[];
	see?: string[];
}
