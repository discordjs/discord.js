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
  /**
   * An HTTP Request
   * @param {string} method Method of the request
   * @param {string} uri URI of the request
   */
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

  /**
   * Set a header
   * @param {string} name Name of the header
   * @param {string} value Value of the header
   * @returns {Request}
   */
  set(name, value) {
    this.options.headers[name] = value;
    return this;
  }

  /**
   * Attach a raw body to the request
   * @param {*} data Data to send with the request
   */
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

  /**
   * Attach a form data file to the request
   * @param {string} name Name of the field
   * @param {*} file File to attach
   * @param {string} [filename] Name of file
   * @returns {Request}
   */
  attach(name, file, filename) {
    this._getFormData().append(name, file, filename || file.name);
    this.set('Content-Type', `multipart/form-data; boundary=${this.data.boundary}`);
    return this;
  }

  /**
   * Attach a form data field to the request
   * @param {string} name Name of the field
   * @param {*} val Data to attach
   * @returns {Request}
   */
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

  /**
   * @external HTTPIncomingMessage
   * @see {@link https://nodejs.org/api/http.html#http_class_http_incomingmessage}
   */

   /**
    * The callback of a request
    * @callback Request~callback
    * @param {HTTPIncomingMessage} callback
    */

  /**
   * Run the request
   * @param {Request~callback} callback Callback for the request
   * @returns {Promise<HTTPIncomingMessage>}
   */
  end(callback) {
    this.set('Accept-Encoding', 'gzip, deflate');
    return new Promise((resolve, reject) => {
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
      if (callback) callback(null, res); // eslint-disable-line callback-return
    }).catch(e => {
      if (callback) callback(e); // eslint-disable-line callback-return
    });
  }
}

module.exports = Request;
