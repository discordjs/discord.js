const { ChannelTypes: CT } = require("../util/Constants.js")

/**
* Represents a channel's type
*/
class ChannelTypes {
  /**
   * @param {Number} number The Discord assigned indentifier for a channel
   */
  constructor(number) {
    this.number = number;
  }
  
  /**
   * If the channel is that of a DM between a user
   * @type {Boolean}
   */
  get dm() {
    return this.number == CT.DM;
  }
  
  /**
   * If the channel is that of a group chat between multiple users
   * @type {Boolean}
   */
  get group() {
    return this.number == CT.GROUP_DM;
  }
  
  /**
   * If the channel is that of a text channel in a guild
   * @type {Boolean}
   */
  get text() {
    return this.number == CT.TEXT;
  }
  
  /**
   * If the channel is that of a voice channel in a guild
   * @type {Boolean}
   */
  get voice() {
    return this.number == CT.VOICE;
  }
  
  /**
   * If the channel is that of a Category in a guild
   * @type {Boolean}
   */
  get category() {
    return this.number == CT.CATEGORY;
  }
  
  /**
   * If the channel is that of a news channel in a guild
   * @type {Boolean}
   */
  get news() {
    return this.number == CT.NEWS
  }
  
  /**
   * If the channel is that of a store channel in a guild
   * @type {Boolean}
   */
  get store() {
    return this.number == CT.STORE
  }
  
  // Categories
  
  /**
   * If the channel is one that can have messages sent to them
   * @type {Boolean}
   */
  get TextChannel() {
    return this.constructor.TEXT_TYPES.includes(this.number);
  }
  
  /**
   * If the channel is one that can be connected to via voice
   * @type {Boolean}
   */
  get VoiceChannel() {
    return this.constructor.VOICE_TYPES.includes(this.number);
  }
  
  /**
   * If the channel is one that are special/vip features
   * @type {Boolean}
   */
  get SpecialChannel() {
      return this.constructor.SPECIAL_TYPES.includes(this.number);
  }
  
  /**
   * If the channel is one that belongs to a guild
   * @type {Boolean}
   */
  get GuildChannel() {
      return this.constructor.GUILD_TYPES.includes(this.number);
  }
  
}

/**
 * Channel types that count towards .TextChannel
 * @type {Array}
 */
ChannelTypes.TEXT_TYPES = [
  CT.DM,
  CT.TEXT,
  CT.GROUP_DM,
  CT.NEWS,
  CT.STORE
];

/**
 * Channel types that count towards .VoiceChannel
 * @type {Array}
 */
ChannelTypes.VOICE_TYPES = [
  CT.VOICE
];

/**
 * Channel types that count towards .SpecialChannel
 * @type {Array}
 */
ChannelTypes.SPECIAL_TYPES = [
  CT.NEWS,
  CT.STORE
];

/**
 * Channel types that count towards .GuildChannel
 * @type {Array}
 */
ChannelTypes.GUILD_TYPES = [
  CT.TEXT,
  CT.CATEGORY,
  CT.VOICE,
  CT.NEWS,
  CT.STORE
];

module.exports = ChannelTypes;
