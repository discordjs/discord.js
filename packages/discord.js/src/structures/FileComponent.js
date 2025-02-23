'use strict';

const BaseComponent = require('./BaseComponent');
const UnfurledMediaItem = require('./UnfurledMediaItem');

/**
 * Represents a file component
 * @extends {BaseComponent}
 */
class FileComponent extends BaseComponent {
  constructor({ file, ...data }) {
    super(data);

    /**
     * The media associated with this file
     * @type {UnfurledMediaItem}
     * @readonly
     */
    this.file = new UnfurledMediaItem(file);
  }

  /**
   * Whether this thumbnail is spoilered
   * @type {boolean}
   * @readonly
   */
  get spoiler() {
    return this.data.spoiler ?? false;
  }

  /**
   * Returns the API-compatible JSON for this component
   * @returns {APIFileComponent}
   */
  toJSON() {
    return { ...this.data, file: this.file.toJSON() };
  }
}

module.exports = FileComponent;
