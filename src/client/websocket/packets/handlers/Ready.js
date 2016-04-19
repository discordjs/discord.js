'use strict';

const AbstractHandler = require('./AbstractHandler');
const Structure = name => require(`../../../../structures/${name}`);

const ClientUser = Structure('ClientUser');
const Guild = Structure('Guild');
const DMChannel = Structure('DMChannel');

class ReadyHandler extends AbstractHandler {

	constructor(packetManager) {
		super(packetManager);
	}

	handle(packet) {
		let data = packet.d;
		let client = this.packetManager.client;
		client.manager.setupKeepAlive(data.heartbeat_interval);

		client.store.user = client.store.add('users', new ClientUser(client, data.user));

		for (let guild of data.guilds) {
			client.store.NewGuild(guild);
		}

		for (let privateDM of data.private_channels) {
			client.store.NewChannel(privateDM);
		}

		this.packetManager.ws.store.sessionID = data.session_id;

		this.packetManager.ws.checkIfReady();

	}

};

module.exports = ReadyHandler;
