/**
 * Allows for the extension of built-in Discord.js structures that are instantiated by {@link DataStore}s.
 * When extending a built-in structure, it is important to both get the class you're extending from here,
 * and to set it here afterwards.
 * @example
 * const { Structures } = require('discord.js');
 *
 * class CoolGuild extends Structures.get('Guild') {
 *   constructor(client, data) {
 *     super(client, data);
 *     this.cool = true;
 *   }
 * }
 *
 * Structures.set('Guild', CoolGuild);
 */
class Structures {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * Retrieves a structure class.
   * @param {string} name Name of the base structure
   * @returns {Function}
   */
  static get(name) {
    return structures[name];
  }

  /**
   * Overrides a structure class.
   * @param {string} name Name of the base structure
   * @param {Function} custom Extended structure class to override with
   */
  static set(name, custom) {
    structures[name] = custom;
  }
}

const structures = {
  Channel: require('../structures/Channel'),
  Emoji: require('../structures/Emoji'),
  GuildChannel: require('../structures/GuildChannel'),
  GuildMember: require('../structures/GuildMember'),
  Guild: require('../structures/Guild'),
  Message: require('../structures/Message'),
  Presence: require('../structures/Presence'),
  Reaction: require('../structures/Reaction'),
  Role: require('../structures/Role'),
  User: require('../structures/User'),
};

module.exports = Structures;
