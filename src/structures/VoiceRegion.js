class VoiceRegion {
  constructor(data) {
    this.sampleHostname = data.sample_hostname;
    this.vip = data.vip;
    this.name = data.name;
    this.deprecated = data.deprecated;
    this.optimal = data.optimal;
    this.id = data.id;
    this.custom = data.custom;
  }
}

module.exports = VoiceRegion;
