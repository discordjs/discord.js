/* global process */
/*
	this file should be used for travis builds only
	or testing local builds
*/

var Discord = require("../");
var current = 0;

done();

function done() {
	console.log("Finished! Build successful.");
	process.exit(0);
}

function error(e) {
	console.log("FAILED DURING TEST", current);
	console.log(e.stack);
	process.exit(1);
}