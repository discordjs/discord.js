const { resolveString } = require('../util/Util');
const { TypeError } = require('../errors');

/**
 * Represents an attachment in a message
 */
class Attachment {
  constructor(file, name) {
    this.files = [];
    this._attach(file, name);
  }

  /**
    * The name of the file
    * @type {?string}
    */
  get name() {
    return this.files[0] ? this.files[0].name : null;
  }

  /**
    * The file
    * @type {?BufferResolvable|Stream}
    */
  get file() {
    return this.files[0] ? this.files[0].attachment : null;
  }

  /**
    * Set the file of this attachment.
    * @param {BufferResolvable|Stream} file The file
	* @param {string} name The name of the file
    * @returns {Attachment} This attachment
    */
  setAttachment(file, name) {
    if (!file) throw new TypeError('ATTACHMENT_NO_FILE');
    this.files = [];
    this._attach(file, name);
    return this;
  }

  /**
    * Set the file of this attachment.
    * @param {BufferResolvable|Stream} attachment The file
    * @returns {Attachment} This attachment
    */
  setFile(attachment) {
    if (!this.files.length) this.files = [{ attachment, name: null }];
    else this.files[0].attachment = attachment;
    return this;
  }

  /**
    * Set the name of this attachment.
    * @param {string} name The name of the image
    * @returns {Attachment} This attachment
    */
  setName(name) {
    if (!this.files.length) this.files = [{ attachment: null, name: resolveString(name) }];
    else this.files[0].name = name;
    return this;
  }

  /**
    * Set the file of this attachment.
    * @param {BufferResolvable|Stream} file The file
    * @param {string} name The name of the file
    */
  _attach(file, name) {
    if (file) {
      if (typeof file === 'string') this.files.push(resolveString(file));
      else this.files.push({ attachment: file, name: name ? resolveString(name) : null });
    }
  }
}

module.exports = Attachment;
