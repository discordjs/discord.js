const GenericHandler = require('./GenericHandler'),
      Constants      = require('../../../../util/Constants'),
      Server         = require('../../../../Structures/Server');

class ServerDeleteHandler extends GenericHandler {
	handle(packet) {
		let data   = packet.d;

		let server = this.client.store.get('servers', 'id', data.id);
		if (server) {
			if (data.unavailable) {
				// server has become unavailable
				server.available = false;
				this.client.emit(Constants.Events.SERVER_UNAVAILABLE, server);
			} else {
				// server was deleted
				this.client.store.remove('servers', server);
				this.client.emit(Constants.Events.SERVER_DELETE, server);
			}
		} else {
			// no record of server
			this.manager.log(`server ${data.id} deleted but no record of server in client data stores`);
		}
	}
}

module.exports = ServerDeleteHandler;
