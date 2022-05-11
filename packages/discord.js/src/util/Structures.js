'use strict';

/**
 * An extendable structure:
 * * **`ApplicationCommand`**
 * * **`AutocompleteInteraction`**
 * * **`ButtonInteraction`**
 * * **`CategoryChannel`**
 * * **`ChatInputCommandInteraction`**
 * * **`DMChannel`**
 * * **`Guild`**
 * * **`GuildAuditLogs`**
 * * **`GuildAuditLogsEntry`**
 * * **`GuildEmoji`**
 * * **`GuildMember`**
 * * **`Message`**
 * * **`MessageContextMenuCommandInteraction`**
 * * **`MessageReaction`**
 * * **`ModalSubmitInteraction`**
 * * **`NewsChannel`**
 * * **`Presence`**
 * * **`ReactionEmoji`**
 * * **`Role`**
 * * **`SelectMenuInteraction`**
 * * **`StageChannel`**
 * * **`StageInstance`**
 * * **`Sticker`**
 * * **`StickerPack`**
 * * **`TextChannel`**
 * * **`ThreadChannel`**
 * * **`ThreadMember`**
 * * **`User`**
 * * **`UserContextMenuCommandInteraction`**
 * * **`VoiceChannel`**
 * * **`VoiceState`**
 * * **`WelcomeChannel`**
 * * **`WelcomeScreen`**
 * @typedef {string} ExtendableStructure
 */

// https://github.com/discordjs/discord.js/blob/51551f544b80d7d27ab0b315da01dfc560b2c115/src/util/Structures.js#L27
/**
 * Allows for the extension of built-in Discord.js structures that are instantiated by {@link BaseManager Managers}.
 */
class Structures extends null {
  /**
   * Retrieves a structure class.
   * @param {ExtendableStructure} structure Name of the structure to retrieve
   * @returns {Function}
   */
  static get(structure) {
    if (typeof structure === 'string') return structures[structure];
    throw new TypeError(`"structure" argument must be a string (received ${typeof structure})`);
  }

  /**
   * Extends a structure.
   * @param {ExtendableStructure} structure Name of the structure class to extend
   * @param {Function} extender Function that takes the base class to extend as its only parameter and returns the
   * extended class/prototype
   * @returns {Function} Extended class/prototype returned from the extender
   */
  static extend(structure, extender) {
    if (!structures[structure]) throw new RangeError(`"${structure}" is not a valid extensible structure.`);
    if (typeof extender !== 'function') {
      const received = `(received ${typeof extender})`;
      throw new TypeError(
        `"extender" argument must be a function that returns the extended structure class/prototype ${received}.`,
      );
    }

    const extended = extender(structures[structure]);
    if (typeof extended !== 'function') {
      const received = `(received ${typeof extended})`;
      throw new TypeError(`The extender function must return the extended structure class/prototype ${received}.`);
    }

    if (!(extended.prototype instanceof structures[structure])) {
      const prototype = Object.getPrototypeOf(extended);
      const received = `${extended.name ?? 'unnamed'}${prototype.name ? ` extends ${prototype.name}` : ''}`;
      throw new Error(
        'The class/prototype returned from the extender function must extend the existing structure class/prototype' +
          ` (received function ${received}; expected extension of ${structures[structure].name}).`,
      );
    }

    structures[structure] = extended;
    return extended;
  }
}

const structures = {
  ApplicationCommand: require('../structures/ApplicationCommand'),
  AutocompleteInteraction: require('../structures/AutocompleteInteraction'),
  ButtonInteraction: require('../structures/ButtonInteraction'),
  CategoryChannel: require('../structures/CategoryChannel'),
  ChatInputCommandInteraction: require('../structures/ChatInputCommandInteraction'),
  DMChannel: require('../structures/DMChannel'),
  Guild: require('../structures/Guild'),
  GuildAuditLogs: require('../structures/GuildAuditLogs'),
  GuildAuditLogsEntry: require('../structures/GuildAuditLogsEntry'),
  GuildEmoji: require('../structures/GuildEmoji'),
  GuildMember: require('../structures/GuildMember'),
  Message: require('../structures/Message'),
  MessageContextMenuCommandInteraction: require('../structures/MessageContextMenuCommandInteraction'),
  MessageReaction: require('../structures/MessageReaction'),
  ModalSubmitInteraction: require('../structures/ModalSubmitInteraction'),
  NewsChannel: require('../structures/NewsChannel'),
  Presence: require('../structures/Presence').Presence,
  ReactionEmoji: require('../structures/ReactionEmoji'),
  Role: require('../structures/Role'),
  SelectMenuInteraction: require('../structures/SelectMenuInteraction'),
  StageChannel: require('../structures/StageChannel'),
  StageInstance: require('../structures/StageInstance'),
  Sticker: require('../structures/Sticker'),
  StickerPack: require('../structures/StickerPack'),
  TextChannel: require('../structures/TextChannel'),
  ThreadChannel: require('../structures/ThreadChannel'),
  ThreadMember: require('../structures/ThreadMember'),
  User: require('../structures/User'),
  UserContextMenuCommandInteraction: require('../structures/UserContextMenuCommandInteraction'),
  VoiceChannel: require('../structures/VoiceChannel'),
  VoiceState: require('../structures/VoiceState'),
  WelcomeChannel: require('../structures/WelcomeChannel'),
  WelcomeScreen: require('../structures/WelcomeScreen'),
};

module.exports = Structures;
