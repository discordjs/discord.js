const GenericHandler = require('./GenericHandler');
const Constants = require('../../../../util/Constants');
const CloneObject = require('../../../../util/CloneObject');
const Server = require('../../../../Structures/Server');

module.exports = class ServerUpdateHandler extends GenericHandler{
	constructor(manager) {
		super(manager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.manager.client;

		let server = client.store.get('servers', 'id', data.id);
		if (server) {
			// create de-referenced server for old state
			let oldServer = CloneObject(server);

			server.setup(data);
			client.emit(Constants.Events.SERVER_UPDATE, oldServer, server);
		} else {
			// no record of server
			this.manager.log(`server ${data.id} updated but no record of server in client data stores`);
		}
	}
};
