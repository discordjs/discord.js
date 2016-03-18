'use strict';
const Discord = require('../src'),
      client  = new Discord.Client({ logging: { enabled: true } }),
      TAG     = 'testscript';

function go() {
	let login = process.env.ds_token
		? client.login(process.env.ds_token)
		: client.login(process.env.ds_email, process.env.ds_password);

	login.then(ready)
		.catch(console.log);

	client.on(Discord.Constants.Events.SERVER_CREATE, server => {
		client.logger.log(TAG, 'ServerCreate ' + server.name);
		amount('servers');
	});
	client.on(Discord.Constants.Events.SERVER_DELETE, server => {
		client.logger.log(TAG, 'ServerDelete ' + server.name);
		amount('servers');
	});
	client.on(Discord.Constants.Events.SERVER_UPDATE, (oldserver, server) => {
		client.logger.log(TAG, 'ServerUpdate ' + oldserver.name + ' became ' + server.name);
		amount('servers');
	});
}

function ready(token) {
	client.logger.log(TAG, 'connected with token ' + token);

	let server = client.getServersByName(process.argv[2])[0];

	console.log("Server: ", server);
	console.log("Roles: ", server.roles.map(role => role.name));

	//console.log(client.servers[0].channels[0]);
}

function amount(prop) {
	client.logger.log(TAG, `there are ${client[prop].length} ${prop}`);
}

go();
