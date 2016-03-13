"use strict";
const Discord = require("../");
const h = new Discord.Client();

async function go(){
	h.login(process.env["ds_email"], process.env["ds_password"]).then(() => setTimeout(next, 5000)).catch(console.log);

	function next() {
		console.log("nexted");
		h.login(process.env["ds_email"], process.env["ds_password"]).then(() => setTimeout(next, 5000)).catch(console.log);
	}
}

go();