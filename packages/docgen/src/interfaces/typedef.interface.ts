import type { Access, Item, Meta, Param, Return, Scope, Type } from './index.js';

export interface Typedef extends Item {
	kind: 'typedef';
	scope: Scope;
	see?: string[];
	access?: Access;
	deprecated?: boolean | string;
	type: Type;
	properties?: Param[];
	params?: Param[];
	returns?: Return[];
	meta: Meta;
}
