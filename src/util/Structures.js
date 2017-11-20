/**
 * Allows for the extension of built-in Discord.js structures that are instantiated by {@link DataStore DataStores}.
 * When extending a built-in structure, it is important to both get the class you're extending from here,
 * and to set it here afterwards.
 */
class Structures {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * Retrieves a structure class.
   * @param {string} structure Name of the structure to retrieve
   * @returns {Function}
   */
  static get(structure) {
    if (typeof structure === 'string') return structures[structure];
    throw new TypeError(`"structure" argument must be a string (received ${typeof structure})`);
  }

  /**
   * Replaces a structure class with an extended one.
   * @param {string} structure Name of the structure to replace
   * @param {Function} extended Extended structure class/prototype function to replace with
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
  static set(structure, extended) {
    if (!structures[structure]) throw new RangeError(`"${structure}" is not a valid extensible structure.`);
    if (typeof extended !== 'function') {
      throw new TypeError(
        `"extended" argument must be a structure class/prototype function (received ${typeof extended})`
      );
    }
    if (Object.getPrototypeOf(extended) !== structures[structure]) {
      throw new Error('The class/prototype function provided doesn\'t extend the existing structure class/prototype.');
    }
    structures[structure] = extended;
  }
}

const structures = {
  Channel: require('../structures/Channel'),
  Emoji: require('../structures/Emoji'),
  GuildChannel: require('../structures/GuildChannel'),
  GuildMember: require('../structures/GuildMember'),
  Guild: require('../structures/Guild'),
  Message: require('../structures/Message'),
  MessageReaction: require('../structures/MessageReaction'),
  Presence: require('../structures/Presence').Presence,
  Role: require('../structures/Role'),
  User: require('../structures/User'),
};

module.exports = Structures;
