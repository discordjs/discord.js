'use strict';

const Discord = require('../');

const client = new Discord.Client({ fetch_all_members: false, api_request_method: 'sequential' });

const { email, password, token } = require('./auth.json');

let p = client.login(token);
p = p.then(() => client.destroy());
p = p.then(() => client.login(token));
p = p.then(() => client.destroy());
