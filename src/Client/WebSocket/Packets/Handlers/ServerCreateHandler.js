const GenericHandler = require('./GenericHandler');
const Constants = require('../../../../util/Constants');
const Server = require('../../../../Structures/Server');

module.exports = class ServerCreateHandler extends GenericHandler{
	constructor(manager) {
		super(manager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.manager.client;

		/*	server will only exist if the user has created it or if
			it was unavailable */
		let server = client.store.get('servers', 'id', data.id);
		if (server) {
			if (!server.available && !data.unavailable) {
				// server is now available again
				server.setup(data);
				client.emit(Constants.Events.SERVER_AVAILABLE, server);
			}
		} else {
			// new server
			let server = client.store.add('servers', new Server(client, data));
			client.emit(Constants.Events.SERVER_CREATE, server);
		}
	}
};
