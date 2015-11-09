/* global process */
/*
	this is the entrypoint file, when node finally catches
	up with all ES6 drafts etc, the entrypoint file will stop
	using the transpiled ES5 and switch straight to the ES6
	code. This allows for easier debugging and potentially
	faster execution!
*/
var v = process.version;
if(v.charAt(0) === "v"){
	v = v.substring(1);
}

v = v.split(".");

var major = parseInt(v[0]),
	minor = parseInt(v[1]),
	patch = parseInt(v[2]);

// at the moment no node version has full ES6 support	
use5();

function use6(){
	module.exports = require("./src/index.js");
}

function use5(){
	module.exports = require("./lib/index.js");
}