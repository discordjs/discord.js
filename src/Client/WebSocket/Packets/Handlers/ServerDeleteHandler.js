const GenericHandler = require('./GenericHandler');
const Constants = require('../../../../util/Constants');
const Server = require('../../../../Structures/Server');

module.exports = class ServerDeleteHandler extends GenericHandler{
	constructor(manager) {
		super(manager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.manager.client;

		let server = client.store.get('servers', 'id', data.id);
		if (server) {
			if (data.unavailable) {
				// server has become unavailable
				server.available = false;
				client.emit(Constants.Events.SERVER_UNAVAILABLE, server);
			} else {
				// server was deleted
				client.store.remove('servers', server);
				client.emit(Constants.Events.SERVER_DELETE, server);
			}
		} else {
			// no record of server
			this.manager.log(`server ${data.id} deleted but no record of server in client data stores`);
		}
	}
};
