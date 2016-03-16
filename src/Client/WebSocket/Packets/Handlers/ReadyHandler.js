const GenericHandler = require('./GenericHandler');
const Server = require('../../../../Structures/Server');
const ClientUser = require('../../../../Structures/ClientUser');

module.exports = class ReadyHandler extends GenericHandler{
	constructor(manager) {
		super(manager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.manager.client;

		this.manager.log('received READY packet');
		let startTime = Date.now();

		client.manager.setupKeepAlive(data.heartbeat_interval);

		client.user = client.store.add('users', new ClientUser(client, data.user));

		for (let server of data.guilds) {
			let srv = client.store.add('servers', new Server(client, server));
		}

		client.manager.setStateConnected();
		this.manager.log(`took ${Date.now() - startTime}ms to parse READY`);
		this.manager.log(`connected with ${client.users.length} users and ${client.servers.length} servers`);
	}
};
