const https = require('https');
const NodeFormData = require('./FormData');
const Constants = require('../../../util/Constants');

class DiscordRequest {
  constructor(method, path) {
    this.options = {
      port: 443,
      method: method.toUpperCase(),
      hostname: Constants.HOST,
      path,
      headers: {},
    };
    this.headers = {};
  }

  set(header, value) {
    this.options.headers[header] = value;
    return this;
  }

  send(data) {
    if (typeof data === 'object') {
      this.set('Content-Type', 'application/json');
      this.data = JSON.stringify(data);
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
      for (var key in name) {
        this.field(key, name[key]);
      }
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
      const request = https.request(this.options, (response) => {
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          body += chunk;
        });
        response.once('aborted', reject);
        response.once('abort', reject);
        response.once('error', reject);
        response.once('end', () => {
          try {
            body = JSON.parse(body);
          } catch (err) {} // eslint-disable-line no-empty
          response.body = body;
          response.status = response.statusCode;
          if (response.statusCode >= 400) {
            reject(response);
          } else {
            resolve(response);
          }
        });
      });
      if (this.data && this.data.end) this.data = this.data.end();
      request.end(this.data);
    }).then(res => {
      callback(null, res);
    }).catch(callback);
  }
}

module.exports = DiscordRequest;
