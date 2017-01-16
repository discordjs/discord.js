class FormData {
  constructor() {
    this.boundary = '--discord.js--';
    this.buffer = new Buffer(0);
  }

  /**
   * Append a field to the form data
   * @param {string} name Name of field
   * @param {*} data Data of field
   * @param {string} filename Filename for data
   */
  append(name, data, filename) {
    if (data === undefined) return;
    let str = `\r\n--${this.boundary}\r\nContent-Disposition: form-data; name="${name}"`;
    if (name) str += `; filename="${filename}"\r\nContent-Type: application/octet-stream`;
    if (!(data instanceof Buffer)) data = new Buffer(typeof data === 'object' ? JSON.stringify(data) : data);
    this.buffer = Buffer.concat([
      this.buffer,
      new Buffer(`${str}\r\n\r\n`),
      data,
    ]);
  }

  /**
   * End the form data
   * @returns {Buffer}
   */
  end() {
    this.buffer = Buffer.concat([
      this.buffer,
      new Buffer(`\r\n--${this.boundary}--`),
    ]);
    return this.buffer;
  }
}

module.exports = FormData;
