const http = require('http');
const https = require('https');
const url = require('url');
const NodeFormData = require('./FormData');
const pako = require('pako');
const zlib = require('zlib');

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
    this.set('Accept-Encoding', 'gzip, deflate');
    new Promise((resolve, reject) => {
      let body = '';
      const handler = (response) => {
        response.setEncoding('utf8');
        response.once('aborted', reject);
        response.once('abort', reject);
        response.once('error', reject);
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.once('end', () => {
          if (/^\s*(?:deflate|gzip)\s*$/.test(response.headers['content-encoding'])) {
            try {
              if (typeof document !== 'undefined') body = pako.inflate(body, { to: 'string' });
              else body = zlib.unzipSync(body).toString();
            } catch (err) {
              err.response = response;
              reject(err);
            }
          }

          response.text = body;

          const type = response.headers['content-type'];
          if (type === 'application/json') {
            try {
              body = JSON.parse(body);
            } catch (e) {
              body = {};
            }
          } else {
            body = Buffer.from(body);
          }

          response.body = body;

          response.status = response.statusCode;
          if (response.statusCode >= 400) {
            reject(response);
          } else {
            resolve(response);
          }
        });
      };
      const request = (this.useHttps ? https : http).request(this.options, handler);
      if (this.data && this.data.end) this.data = this.data.end();
      request.end(this.data);
    }).then(res => {
      callback(null, res);
    }).catch(callback);
  }
}

module.exports = Request;
