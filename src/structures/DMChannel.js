'use strict';

const Channel = require('./Channel');
const User = require('./User');

class DMChannel extends Channel{
	constructor(client, data) {
		super(client, data);
	}

	setup(data) {
		this.recipient = this.client.store.add('users', new User(this.client, data.recipient));
		this.lastMessageID = data.last_message_id;
	}
}

module.exports = DMChannel;
