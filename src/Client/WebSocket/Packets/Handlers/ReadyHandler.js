const GenericHandler = require('./GenericHandler'),
      Server         = require('../../../../Structures/Server'),
      ClientUser     = require('../../../../Structures/ClientUser');

class ReadyHandler extends GenericHandler {
	handle(packet) {
		let data   = packet.d;

		this.manager.log('received READY packet');
		let startTime = Date.now();

		this.client.manager.setupKeepAlive(data.heartbeat_interval);

		this.client.user = this.client.store.add('users', new ClientUser(this.client, data.user));

		for (let server of data.guilds) {
			this.client.store.add('servers', new Server(this.client, server));
		}

		this.client.manager.setStateConnected();
		this.manager.log(`took ${Date.now() - startTime}ms to parse READY`);
		this.manager.log(`connected with ${this.client.users.length} users and ${this.client.servers.length} servers`);
	}
}

module.exports = ReadyHandler;
