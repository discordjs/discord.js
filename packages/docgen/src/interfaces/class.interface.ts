import type { Access, Item, Meta, Scope } from './index.js';

export interface Class extends Item {
	access?: Access;
	augments?: string[];
	deprecated?: boolean | string;
	implements?: string[];
	kind: 'class';
	meta: Meta;
	scope: Scope;
	see?: string[];
	virtual?: boolean;
}
