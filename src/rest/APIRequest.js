'use strict';

const FormData = require('form-data');
const https = require('https');
const { browser, UserAgent } = require('../util/Constants');
const fetch = require('node-fetch');
const AbortController = require('abort-controller');

let agent;

if (https.Agent) agent = new https.Agent({ keepAlive: true });

class APIRequest {
  constructor(restManager, httpMethod, path, options) {
    Object.defineProperty(this, 'restManager', { value: restManager });

    this.method = httpMethod;
    this.options = options;

    let queryString = '';
    if (options.query) {
      // Filter out undefined query options
      const query = Object.entries(options.query).filter(([, value]) => value !== null && typeof value !== 'undefined');
      queryString = new URLSearchParams(query).toString();
    }

    this.path = `${path}${queryString && `?${queryString}`}`;
  }

  make() {
    const { client } = this.restManager;
    const API = !this.options.versioned ? client.options.http.api :
      `${client.options.http.api}/v${client.options.http.version}`;
    const finalURL = `${API}${this.path}`;

    let headers = {};

    if (!this.options.auth) headers.Authorization = this.restManager.authToken;
    if (this.options.reason) headers['X-Audit-Log-Reason'] = encodeURIComponent(this.options.reason);
    if (!browser) headers['User-Agent'] = UserAgent;
    if (this.options.headers) headers = Object.assign(headers, this.options.headers);
    headers['X-RateLimit-Precision'] = 'millisecond';

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

    const controller = new AbortController();
    const timeout = client.setTimeout(() => controller.abort(), client.options.restRequestTimeout);
    return fetch(finalURL, {
      method: this.method,
      headers,
      agent,
      body,
      signal: controller.signal,
    }).finally(() => this.client.clearTimeout(timeout));
  }
}

module.exports = APIRequest;
