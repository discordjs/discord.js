'use strict';

class GuildEventEntityMetadata {
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
  }
}

module.exports = GuildEventEntityMetadata;
