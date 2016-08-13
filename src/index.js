const values = require('object.values');
const Client = require('./client/Client');

if (!Object.values) {
  values.shim();
}

exports.Client = Client;
