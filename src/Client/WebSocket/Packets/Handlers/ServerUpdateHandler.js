const GenericHandler = require('./GenericHandler'),
      Constants      = require('../../../../util/Constants'),
      CloneObject    = require('../../../../util/CloneObject'),
      Server         = require('../../../../Structures/Server');

class ServerUpdateHandler extends GenericHandler {
	handle(packet) {
		let data   = packet.d;

		let server = this.client.store.get('servers', 'id', data.id);
		if (server) {
			// create de-referenced server for old state
			let oldServer = CloneObject(server);

			server.setup(data);
			this.client.emit(Constants.Events.SERVER_UPDATE, oldServer, server);
		} else {
			// no record of server
			this.manager.log(`server ${data.id} updated but no record of server in client data stores`);
		}
	}
}

module.exports = ServerUpdateHandler;
