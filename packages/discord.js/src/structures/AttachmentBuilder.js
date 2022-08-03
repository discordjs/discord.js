'use strict';

const { basename, flatten } = require('../util/Util');

/**
 * Represents an attachment builder
 */
class AttachmentBuilder {
  /**
   * @param {BufferResolvable|Stream} attachment The file
   * @param {AttachmentData} [data] Extra data
   */
  constructor(attachment, data = {}) {
    /**
     * The file associated with this attachment.
     * @type {BufferResolvable|Stream}
     */
    this.attachment = attachment;
    /**
     * The name of this attachment
     * @type {?string}
     */
    this.name = data.name;
    /**
     * The description of the attachment
     * @type {?string}
     */
    this.description = data.description;
  }

  /**
   * Sets the description of this attachment.
   * @param {string} description The description of the file
   * @returns {AttachmentBuilder} This attachment
   */
  setDescription(description) {
    this.description = description;
    return this;
  }

  /**
   * Sets the file of this attachment.
   * @param {BufferResolvable|Stream} attachment The file
   * @returns {AttachmentBuilder} This attachment
   */
  setFile(attachment) {
    this.attachment = attachment;
    return this;
  }

  /**
   * Sets the name of this attachment.
   * @param {string} name The name of the file
   * @returns {AttachmentBuilder} This attachment
   */
  setName(name) {
    this.name = name;
    return this;
  }

  /**
   * Sets whether this attachment is a spoiler
   * @param {boolean} [spoiler=true] Whether the attachment should be marked as a spoiler
   * @returns {AttachmentBuilder} This attachment
   */
  setSpoiler(spoiler = true) {
    if (spoiler === this.spoiler) return this;

    if (!spoiler) {
      while (this.spoiler) {
        this.name = this.name.slice('SPOILER_'.length);
      }
      return this;
    }
    this.name = `SPOILER_${this.name}`;
    return this;
  }

  /**
   * Whether or not this attachment has been marked as a spoiler
   * @type {boolean}
   * @readonly
   */
  get spoiler() {
    return basename(this.name).startsWith('SPOILER_');
  }

  toJSON() {
    return flatten(this);
  }

  /**
   * Makes a new builder instance from a preexisting attachment structure.
   * @param {JSONEncodable<AttachmentPayload>} other The builder to construct a new instance from
   * @returns {AttachmentBuilder}
   */
  static from(other) {
    return new AttachmentBuilder(other.attachment, {
      name: other.name,
      description: other.description,
    });
  }
}

module.exports = AttachmentBuilder;

/**
 * @external APIAttachment
 * @see {@link https://discord.com/developers/docs/resources/channel#attachment-object}
 */
