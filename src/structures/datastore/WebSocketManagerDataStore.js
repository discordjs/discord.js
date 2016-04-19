'use strict';

const AbstractDataStore = require('./AbstractDataStore');

class WebSocketManagerDataStore extends AbstractDataStore{
	constructor() {
		super();
		this.sessionID = null;
		this.sequence = -1;
		this.gateway = null;
	}
}

module.exports = WebSocketManagerDataStore;
