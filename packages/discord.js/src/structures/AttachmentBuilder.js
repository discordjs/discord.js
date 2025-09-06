'use strict';

const { basename, flatten } = require('../util/Util.js');

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
     *
     * @type {BufferResolvable|Stream}
     */
    this.attachment = attachment;

    /**
     * The name of this attachment
     *
     * @type {?string}
     */
    this.name = data.name;

    /**
     * The description of the attachment
     *
     * @type {?string}
     */
    this.description = data.description;

    /**
     * The title of the attachment
     *
     * @type {?string}
     */
    this.title = data.title;

    /**
     * The base64 encoded byte array representing a sampled waveform
     * <info>This is only for voice message attachments.</info>
     *
     * @type {?string}
     */
    this.waveform = data.waveform;

    /**
     * The duration of the attachment in seconds
     * <info>This is only for voice message attachments.</info>
     *
     * @type {?number}
     */
    this.duration = data.duration;
  }

  /**
   * Sets the description of this attachment.
   *
   * @param {string} description The description of the file
   * @returns {AttachmentBuilder} This attachment
   */
  setDescription(description) {
    this.description = description;
    return this;
  }

  /**
   * Sets the file of this attachment.
   *
   * @param {BufferResolvable|Stream} attachment The file
   * @returns {AttachmentBuilder} This attachment
   */
  setFile(attachment) {
    this.attachment = attachment;
    return this;
  }

  /**
   * Sets the name of this attachment.
   *
   * @param {string} name The name of the file
   * @returns {AttachmentBuilder} This attachment
   */
  setName(name) {
    this.name = name;
    return this;
  }

  /**
   * Sets the title of this attachment.
   *
   * @param {string} title The title of the file
   * @returns {AttachmentBuilder} This attachment
   */
  setTitle(title) {
    this.title = title;
    return this;
  }

  /**
   * Sets the waveform of this attachment.
   * <info>This is only for voice message attachments.</info>
   *
   * @param {string} waveform The base64 encoded byte array representing a sampled waveform
   * @returns {AttachmentBuilder} This attachment
   */
  setWaveform(waveform) {
    this.waveform = waveform;
    return this;
  }

  /**
   * Sets the duration of this attachment.
   * <info>This is only for voice message attachments.</info>
   *
   * @param {number} duration The duration of the attachment in seconds
   * @returns {AttachmentBuilder} This attachment
   */
  setDuration(duration) {
    this.duration = duration;
    return this;
  }

  /**
   * Sets whether this attachment is a spoiler
   *
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
   *
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
   *
   * @param {AttachmentBuilder|Attachment|AttachmentPayload} other The builder to construct a new instance from
   * @returns {AttachmentBuilder}
   */
  static from(other) {
    return new AttachmentBuilder(other.attachment, {
      name: other.name,
      description: other.description,
    });
  }
}

exports.AttachmentBuilder = AttachmentBuilder;

/**
 * @typedef {Object} AttachmentData
 * @property {string} [name] The name of the attachment
 * @property {string} [description] The description of the attachment
 * @property {string} [title] The title of the attachment
 * @property {string} [waveform] The base64 encoded byte array representing a sampled waveform (for voice message attachments)
 * @property {number} [duration] The duration of the attachment in seconds (for voice message attachments)
 */
