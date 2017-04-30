/**
 * Represents a Discord voice region for guilds.
 */
class VoiceRegion {
  constructor(data) {
    /**
     * The ID of the region
     * @type {string}
     */
    this.id = data.id;

    /**
     * Name of the region
     * @type {string}
     */
    this.name = data.name;

    /**
     * Whether the region is VIP-only
     * @type {boolean}
     */
    this.vip = data.vip;

    /**
     * Whether the region is deprecated
     * @type {boolean}
     */
    this.deprecated = data.deprecated;

    /**
     * Whether the region is optimal
     * @type {boolean}
     */
    this.optimal = data.optimal;

    /**
     * Whether the region is custom
     * @type {boolean}
     */
    this.custom = data.custom;

    /**
     * A sample hostname for what a connection might look like
     * @type {string}
     */
    this.sampleHostname = data.sample_hostname;
  }
}

module.exports = VoiceRegion;
