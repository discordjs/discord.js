const GuildChannel = require('./GuildChannel');

/**
 * Represents a guild category channel on Discord.
 * @extends {GuildChannel}
 */
class CategoryChannel extends GuildChannel {
  constructor(guild, data) {
    super(guild, data);
    this.type = 'category';
  }
  /**
   * The channels that are part of this category
   * @type {?Collection<Snowflake, GuildChannel>}
   * @readonly
   */
  get children() {
    return this.guild.channels.filter(c => c.parentID === this.id);
  }
  /**
   * Creates a new channel with this category as its parent.
   * @param {string} name The name of the new channel
   * @param {ChannelData} [options] Options for the new channel
   * @returns {Promise<CategoryChannel|TextChannel|VoiceChannel>}
   * @example
   * // Create a new text channel
   * category.createChannel('new-general')
   *   .then(console.log)
   *   .catch(console.error);
   * @example
   * // Create a new channel with permission overwrites
   * category.createChannel('new-restricted', {
   *   permissionOverwrites: [{
   *     id: guild.id,
   *     deny: ['MANAGE_MESSAGES'],
   *     allow: ['SEND_MESSAGES']
   *   }]
   * })
   *   .then(console.log)
   *   .catch(console.error);
   */
  createChannel(name, options) {
	if (!options) {
	  options = { parent: this.id };
	} else {
	  options.parent = this.id;
	}
    return this.guild.createChannel(name, options);
  }
}

module.exports = CategoryChannel;
