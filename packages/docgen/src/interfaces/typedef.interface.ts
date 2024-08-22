import type { Access, Item, Meta, Param, Return, Scope, Type } from './index.js';

export interface Typedef extends Item {
	access?: Access;
	deprecated?: boolean | string;
	kind: 'typedef';
	meta: Meta;
	params?: Param[];
	properties?: Param[];
	returns?: Return[];
	scope: Scope;
	see?: string[];
	type: Type;
}
