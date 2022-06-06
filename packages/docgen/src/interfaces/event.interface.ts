import type { Item, Meta, Param, Scope } from './index.js';

export interface Event extends Item {
	kind: 'event';
	scope: Scope;
	memberof: string;
	see?: string[];
	deprecated?: boolean | string;
	params?: Param[];
	meta: Meta;
}
