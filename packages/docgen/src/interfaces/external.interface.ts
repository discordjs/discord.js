import type { Item, Meta } from './index.js';

export interface External extends Item {
	kind: 'external';
	see?: string[];
	meta: Meta;
}
