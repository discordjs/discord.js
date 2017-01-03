const http = require('http');
const https = require('https');
const url = require('url');
const NodeFormData = require('./FormData');

const PROTOCOLS = {
  http: 80,
  https: 443,
  ftp: 21,
  ftps: 990,
};

class Request {
  constructor(method, uri) {
    const { hostname, path, protocol } = url.parse(uri);
    this.useHttps = protocol.replace(':', '').endsWith('s');
    this.options = {
      port: PROTOCOLS[protocol.replace(':', '')],
      method: method.toUpperCase(),
      hostname,
      path,
      headers: {},
    };
  }

  set(header, value) {
    this.options.headers[header] = value;
    return this;
  }

  send(data) {
    if (typeof data !== 'string' && !(data instanceof Buffer)) {
      this.data = JSON.stringify(data);
      this.set('Content-Type', 'application/json');
    } else {
      this.data = data;
    }
    return;
  }

  _getFormData() {
    if (!this.data) this.data = new NodeFormData();
    return this.data;
  }

  attach(field, file, options) {
    this._getFormData().append(field, file, options || file.name);
    this.set('Content-Type', `multipart/form-data; boundary=${this.data.boundary}`);
    return this;
  }

  field(name, val) {
    if (name === null || name === undefined) throw new Error('.field(name, val) name can not be empty');

    if (name !== null && typeof name === 'object') {
      for (var key in name) this.field(key, name[key]);
      return this;
    }

    if (Array.isArray(val)) {
      for (var i in val) this.field(name, val[i]);
      return this;
    }

    if (val === null || val === undefined) throw new Error('.field(name, val) val can not be empty');
    if (typeof val === 'boolean') val = String(val);
    this._getFormData().append(name, val);
    this.set('Content-Type', `multipart/form-data; boundary=${this.data.boundary}`);
    return this;
  }

  end(callback) {
    new Promise((resolve, reject) => {
      let body = '';
      const handler = (response) => {
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.once('aborted', reject);
        response.once('abort', reject);
        response.once('error', reject);
        response.once('end', () => {
          response.text = body;
          const c = response.headers['content-type'];
          if (c) {
            if (c === 'application/json') {
              try {
                response.body = JSON.parse(body);
              } catch (err) {} // eslint-disable-line no-empty
            } else {
              response.body = Buffer.from(body);
            }
          } else {
            response.body = {};
          }
          response.status = response.statusCode;
          if (response.statusCode >= 400) {
            reject(response);
          } else {
            resolve(response);
          }
        });
      };
      let request;
      if (this.useHttps) {
        request = https.request(this.options, handler);
      } else {
        request = http.request(this.options, handler);
      }
      if (this.data && this.data.end) this.data = this.data.end();
      request.end(this.data);
    }).then(res => {
      callback(null, res);
    }).catch(callback);
  }
}

module.exports = Request;
