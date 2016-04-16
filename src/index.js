'use strict';

const entries = require('object.entries');
const values = require('object.values');
const Client = require('./client/Client');

if (!Object.entries) {
	entries.shim();
}

if (!Object.values) {
	values.shim();
}

exports.Client = Client;
