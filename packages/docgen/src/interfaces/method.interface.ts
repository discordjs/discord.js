import type { Access, Exception, Item, Meta, Param, Return, Scope } from './index.js';

export interface Method extends Item {
	kind: 'function';
	see?: string[];
	scope: Scope;
	access?: Access;
	inherits?: string;
	inherited?: boolean;
	implements?: string[];
	examples?: string[];
	virtual?: boolean;
	deprecated?: boolean | string;
	memberof?: string;
	params?: Param[];
	async?: boolean;
	generator?: boolean;
	fires?: string[];
	returns?: Return[];
	exceptions?: Exception[];
	meta: Meta;
}
