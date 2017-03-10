const path = require('path');
const mime = require('./mime');

class FormData {
  constructor() {
    this.boundary = '--Discord.js----';
    this.buffer = new Buffer(0);
  }

  append(name, data, filename) {
    if (typeof data === 'undefined') return;
    let str = `\r\n--${this.boundary}\r\nContent-Disposition: form-data; name="${name}"`;
    let mimetype = null;
    if (filename) {
      str += `; filename="${filename}"`;
      mimetype = 'application/octet-stream';
      const extname = path.extname(filename);
      if (extname) mimetype = mime.lookup(extname);
    }

    if (data instanceof Buffer) {
      mimetype = mime.buffer(data);
    } else if (typeof data === 'object') {
      mimetype = 'application/json';
      data = Buffer.from(JSON.stringify(data));
    } else {
      data = Buffer.from(String(data));
    }

    if (mimetype) str += `\r\nContent-Type: ${mimetype}`;
    this.buffer = Buffer.concat([
      this.buffer,
      Buffer.from(`${str}\r\n\r\n`),
      data,
    ]);
  }

  end() {
    this.buffer = Buffer.concat([
      this.buffer,
      Buffer.from(`\r\n--${this.boundary}--`),
    ]);
    return this.buffer;
  }
}

module.exports = FormData;
