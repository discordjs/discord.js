/**
 * Represents an attachment in a message
 */
class Attachment {
  constructor(file, name) {
    this.file = null;
    this._attach(file, name);
  }

  /**
    * The name of the file
    * @type {?string}
    * @readonly
    */
  get name() {
    return this.file.name;
  }

  /**
    * The file
    * @type {?BufferResolvable|Stream}
    * @readonly
    */
  get attachment() {
    return this.file.attachment;
  }

  /**
    * Set the file of this attachment.
    * @param {BufferResolvable|Stream} file The file
    * @param {string} name The name of the file
    * @returns {Attachment} This attachment
    */
  setAttachment(file, name) {
    this.file = { attachment: file, name };
    return this;
  }

  /**
    * Set the file of this attachment.
    * @param {BufferResolvable|Stream} attachment The file
    * @returns {Attachment} This attachment
    */
  setFile(attachment) {
    this.file.attachment = attachment;
    return this;
  }

  /**
    * Set the name of this attachment.
    * @param {string} name The name of the image
    * @returns {Attachment} This attachment
    */
  setName(name) {
    this.file.name = name;
    return this;
  }

  /**
    * Set the file of this attachment.
    * @param {BufferResolvable|Stream} file The file
    * @param {string} name The name of the file
    * @private
    */
  _attach(file, name) {
    if (file) {
      if (typeof file === 'string') this.file = file;
      else this.setAttachment(file, name);
    }
  }
}

module.exports = Attachment;
