import type { Item, Meta, Param, Scope } from './index.js';

export interface Event extends Item {
	deprecated?: boolean | string;
	kind: 'event';
	memberof: string;
	meta: Meta;
	params?: Param[];
	scope: Scope;
	see?: string[];
}
