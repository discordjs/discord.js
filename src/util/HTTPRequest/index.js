const browser = typeof window !== 'undefined';

let fetch;
let FormData;
if (browser) {
  fetch = window.fetch; // eslint-disable-line no-undef
  FormData = window.FormData; // eslint-disable-line no-undef
} else {
  fetch = require('node-fetch');
  FormData = require('./FormData');
}

const convertToBuffer = require('../Util').convertToBuffer;

class HTTPRequest {
  constructor(method, url) {
    this.url = url;
    this.method = method.toUpperCase();
    this.headers = {};
    this.data = null;
  }

  set(name, value) {
    this.headers[name] = value;
    return this;
  }

  attach(name, data, filename) {
    const form = this._getFormData();
    this.set('Content-Type', `multipart/form-data; boundary=${form.boundary}`);
    form.append(name, data, filename);
    this.data = form;
    return this;
  }

  send(data) {
    if (typeof data === 'object') {
      this.set('Content-Type', 'application/json');
      this.data = JSON.stringify(data);
    } else {
      this.data = data;
    }
    return this;
  }

  end(cb) {
    // in a browser, the response is actually immutable, so we make a new one
    let response = {
      headers: {},
      text: '',
      body: {},
    };
    const data = this.data ? this.data.end ? this.data.end() : this.data : null;
    return fetch(this.url, {
      method: this.method,
      headers: this.headers,
      body: data,
    }).then((res) => {
      const ctype = res.headers.get('Content-Type');
      if (ctype === 'application/json') {
        return res.text().then((t) => {
          response.text = t;
          response.body = JSON.parse(t);
          return res;
        });
      } else {
        return (browser ? res.arrayBuffer() : res.buffer())
        .then((b) => {
          if (b instanceof ArrayBuffer) b = convertToBuffer(b);
          response.body = b;
          response.text = b.toString();
          return res;
        });
      }
    })
    .then((res) => {
      const body = response.body;
      const text = response.text;
      Object.assign(response, res);
      response.body = body;
      response.text = text;
      if (res.headers.raw) {
        for (const [name, value] of Object.entries(res.headers.raw())) response.headers[name] = value[0];
      } else {
        for (const [name, value] of res.headers.entries()) response.headers[name] = value;
      }
      cb(null, response);
    })
    .catch((err) => {
      cb(err);
    });
  }

  _getFormData() {
    if (!this._formData) this._formData = new FormData();
    return this._formData;
  }
}

module.exports = HTTPRequest;
