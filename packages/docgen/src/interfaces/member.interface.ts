import type { Access, Item, Meta, Param, Scope, Type } from './index.js';

export interface Member extends Item {
	access?: Access;
	default?: string;
	deprecated?: boolean | string;
	kind: 'member';
	memberof: string;
	meta: Meta;
	nullable?: boolean;
	properties?: Param[];
	readonly?: boolean;
	scope: Scope;
	see?: string[];
	type: Type;
	virtual?: boolean;
}
