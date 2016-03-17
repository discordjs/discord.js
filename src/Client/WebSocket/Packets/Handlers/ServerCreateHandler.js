const GenericHandler = require('./GenericHandler'),
      Constants      = require('../../../../util/Constants'),
      Server         = require('../../../../Structures/Server');

class ServerCreateHandler extends GenericHandler {
	handle(packet) {
		let data   = packet.d;

		/*	server will only exist if the user has created it or if
		 it was unavailable */
		let server = this.client.store.get('servers', 'id', data.id);
		if (server) {
			if (!server.available && !data.unavailable) {
				// server is now available again
				server.setup(data);
				this.client.emit(Constants.Events.SERVER_AVAILABLE, server);
			}
		} else {
			// new server
			server = this.client.store.add('servers', new Server(client, data));
			this.client.emit(Constants.Events.SERVER_CREATE, server);
		}
	}
}

module.exports = ServerCreateHandler;
