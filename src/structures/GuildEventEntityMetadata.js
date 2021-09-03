'use strict';

class GuildEventEntityMetadata {
  /**
   * @param {APIGuildEventEntityMetadata} data The data for the guild event metadata
   */
  constructor(data) {
    this._patch(data);
  }

  _patch(data) {
    if ('speaker_ids' in data) {
      /**
       * The ids of the users who are speakers in the stage channel
       * @type {Snowflake[]}
       */
      this.speakerIds = data.speaker_ids;
    }

    if ('location' in data) {
      /**
       * The location of the event
       * @type {?string}
       */
      this.location = data.location;
    }
  }
}

module.exports = GuildEventEntityMetadata;
