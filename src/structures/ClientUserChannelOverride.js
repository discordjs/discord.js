const Constants = require('../util/Constants');

/**
 * A wrapper around the ClientUser's channel overrides.
 */
class ClientUserChannelOverride {
  constructor(data) {
    this.patch(data);
  }

  /**
   * Patch the data contained in this class with new partial data.
   * @param {Object} data Data to patch this with
   * @private
   */
  patch(data) {
    for (const [key, value] of Object.entries(Constants.UserChannelOverrideMap)) {
      if (!data.hasOwnProperty(key)) continue;
      if (typeof value === 'function') {
        this[value.name] = value(data[key]);
      } else {
        this[value] = data[key];
      }
    }
  }
}

module.exports = ClientUserChannelOverride;
