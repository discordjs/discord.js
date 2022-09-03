import MiniSearch from 'minisearch';

export const miniSearch = new MiniSearch({
	fields: ['name', 'summary'],
	storeFields: ['name', 'summary', 'path'],
});
