'use strict';

const querystring = require('querystring');
const FormData = require('form-data');
const https = require('https');
const { browser, UserAgent } = require('../util/Constants');
const fetch = require('node-fetch');

if (https.Agent) var agent = new https.Agent({ keepAlive: true });

class APIRequest {
  constructor(rest, method, path, options) {
    this.rest = rest;
    this.client = rest.client;
    this.method = method;
    this.route = options.route;
    this.options = options;

    const queryString = (querystring.stringify(options.query).match(/[^=&?]+=[^=&?]+/g) || []).join('&');
    this.path = `${path}${queryString ? `?${queryString}` : ''}`;
  }

  make() {
    const API = this.options.versioned === false ? this.client.options.http.api :
      `${this.client.options.http.api}/v${this.client.options.http.version}`;
    const url = API + this.path;
    let headers = {};

    if (this.options.auth !== false) headers.Authorization = this.rest.getAuth();
    if (this.options.reason) headers['X-Audit-Log-Reason'] = encodeURIComponent(this.options.reason);
    if (!browser) headers['User-Agent'] = UserAgent;
    if (this.options.headers) headers = Object.assign(headers, this.options.headers);

    let body;
    if (this.options.files) {
      body = new FormData();
      for (const file of this.options.files) if (file && file.file) body.append(file.name, file.file, file.name);
      if (typeof this.options.data !== 'undefined') body.append('payload_json', JSON.stringify(this.options.data));
      if (!browser) headers = Object.assign(headers, body.getHeaders());
    } else if (this.options.data != null) { // eslint-disable-line eqeqeq
      body = JSON.stringify(this.options.data);
      headers['Content-Type'] = 'application/json';
    }

    return fetch(url, {
      method: this.method,
      headers,
      agent,
      body,
    });
  }
}

module.exports = APIRequest;
