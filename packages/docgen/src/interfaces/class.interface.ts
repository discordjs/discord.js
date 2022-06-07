import type { Access, Item, Meta, Scope } from './index.js';

export interface Class extends Item {
	kind: 'class';
	scope: Scope;
	implements?: string[];
	augments?: string[];
	see?: string[];
	access?: Access;
	virtual?: boolean;
	deprecated?: boolean | string;
	meta: Meta;
}
