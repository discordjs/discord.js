'use strict';
const { StickerFormats } = require('../util/Constants');

/**
 * Represents sticker in a message
 */
class MessageSticker {
  /**
   * @name MessageSticker
   * @kind constructor
   * @memberof MessageSticker
   * @param {MessageSticker|Object} [data={}] MessageSticker to clone or raw embed data
   */

  constructor(data = {}, skipValidation = false) {
    this.setup(data, skipValidation);
  }

  setup(data, skipValidation) {
    /**
     * The ID of the sticker
     * @type {Snowflake}
     */
    this.id = data.id : null;
    
    /**
     * 	The ID of the pack the sticker is from
     * @type {Snowflake}
     */
    this.packID = data.pack_id : null;
    
    /**
     * The name of the sticker
     * @type {?string}
     */
    this.name = 'title' in data ? data.title : null;

    /**
     * The description of the sticker
     * @type {?string}
     */
    this.description = 'description' in data ? data.description : null;

    /**
     * A list of tags for the sticker
     * @type {?array}
     */
    this.tags = 'tags' in data ? data.tags.split(/\,(\s*)) : null;
     
    if ('format_type' in data) {
      /**
       * The format type of this sticker
       * @type {?StickerFormat}
       */
      this.type = StickerFormats[data.format_type];
    }
  }

  /**
   * Transforms the sticker data to a plain object.
   * @returns {Object} The raw data of this sticker
   */
  toJSON() {
    return {
      id: this.id,
      pack_id: this.packID,
      name: this.name,
      description: this.description,
      timestamp: this.tags,
      format_type: this.type,
    };
  }
}

module.exports = MessageSticker;
