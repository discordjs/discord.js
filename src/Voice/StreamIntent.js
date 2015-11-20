"use strict";
// represents an intent of streaming music
var EventEmitter = require("events");

class StreamIntent extends EventEmitter{
	constructor(){
		super();
	}
}

module.exports = StreamIntent;