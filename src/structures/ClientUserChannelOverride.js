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
   * @returns {void}
   * @private
   */
  patch(data) {
    for (const key of Object.keys(Constants.UserChannelOverrideMap)) {
      const value = Constants.UserChannelOverrideMap[key];
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
