'use strict';

const AbstractDataStore = require('./AbstractDataStore');

class TextChannelDataStore extends AbstractDataStore{
	constructor() {
		super();
		this.register('messages');
	}
}

module.exports = TextChannelDataStore;
