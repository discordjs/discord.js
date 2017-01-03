class FormData {
  constructor() {
    this.boundary = '--------------------';
    this.buffer = new Buffer(0);
  }

  append(field, data, name) {
    if (data === undefined) return;
    let str = `\r\n--${this.boundary}--\r\nContent-Disposition: form-data; name="${field}"`;
    if (name) str += `; filename="${name}"\r\nContent-Type: application/octet-stream`;
    if (!(data instanceof Buffer)) data = new Buffer(typeof data === 'object' ? JSON.stringify(data) : data);
    this.buffer = Buffer.concat([
      this.buffer,
      new Buffer(`${str}\r\n\r\n`),
      data,
    ]);
  }

  end() {
    this.buffer = Buffer.concat([
      this.buffer,
      new Buffer(`\r\n--${this.boundary}--`),
    ]);
    console.log(this.buffer.toString());
    return this.buffer;
  }
}

module.exports = FormData;
