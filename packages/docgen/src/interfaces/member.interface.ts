import type { Access, Item, Meta, Param, Scope, Type } from './index.js';

export interface Member extends Item {
	kind: 'member';
	see?: string[];
	scope: Scope;
	memberof: string;
	type: Type;
	access?: Access;
	readonly?: boolean;
	nullable?: boolean;
	virtual?: boolean;
	deprecated?: boolean | string;
	default?: string;
	properties?: Param[];
	meta: Meta;
}
