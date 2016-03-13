"use strict";
const Discord = require("../");
const client = new Discord.Client({
	logging: {
		enabled : true
	}
});
const TAG = "testscript";

async function go() {
	client.login(process.env["ds_email"], process.env["ds_password"])
		.then(token => client.logger.log(TAG, "connected with token " + token))
		.catch(console.log);
}

go();