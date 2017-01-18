class VoiceRegion {
  constructor(data) {
    /**
     * A sample hostname for what a connection might look like
     * @type {string}
     */
    this.sampleHostname = data.sample_hostname;

    /**
     * If this voice region is VIP
     * @type {boolean}
     */
    this.vip = data.vip;

    /**
     * The name of this voice region
     * @type {string}
     */
    this.name = data.name;

    /**
     * If this voice region is deprecated
     * @type {boolean}
     */
    this.deprecated = data.deprecated;

    /**
     * If this voice region is optimal
     * @type {boolean}
     */
    this.optimal = data.optimal;

    /**
     * The ID of this voice region
     * @type {string}
     */
    this.id = data.id;

    /**
     * If this is a custom voice region
     * @type {boolean}
     */
    this.custom = data.custom;
  }
}

module.exports = VoiceRegion;
