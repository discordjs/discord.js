'use strict';

/**
 * Helpers for checking different variants of common types.
 */
class TypeGuards extends null {
  /**
   * Verifies if the given command data is chat input command or not.
   * @param {ApplicationCommandData} commandData The command data to check.
   * @returns {boolean} True if it conforms to chat input command data, false otherwise.
   */
  static isChatInputCommandData(commandData) {
    return commandData.type === 'CHAT_INPUT' || commandData.type === 1;
  }

  /**
   * Verifies if the given command data is a context menu command or not.
   * @param {ApplicationCommandData} commandData The command data to check.
   * @returns {boolean} True if it conforms to chat input command data, false otherwise.
   */
  static isContextMenuCommandData(commandData) {
    return (
      commandData.type === 'MESSAGE' || commandData.type === 'USER' || commandData.type === 2 || commandData.type === 3
    );
  }

  /**
   * Verifies if the given command option data supports choices or not.
   * @param {ApplicationCommandOptionData} commandOptionData The command option data to check.
   * @returns {boolean} True if the option supports choices, false otherwise.
   */
  static optionDataSupportsChoices(commandOptionData) {
    return (
      commandOptionData.type === 'BOOLEAN' ||
      commandOptionData.type === 5 ||
      commandOptionData.type === 'INTEGER' ||
      commandOptionData.type === 4 ||
      commandOptionData.type === 'STRING' ||
      commandOptionData.type === 3 ||
      commandOptionData.type === 'NUMBER' ||
      commandOptionData.type === 10
    );
  }

  /**
   * Verifies if the given command option data supports options or not.
   * @param {ApplicationCommandOptionData} commandOptionData The command option data to check.
   * @returns {boolean} True if the option supports options, false otherwise.
   */
  static optionDataSupportsSubOptions(commandOptionData) {
    return (
      commandOptionData.type === 'SUB_COMMAND' ||
      commandOptionData.type === 'SUB_COMMAND_GROUP' ||
      commandOptionData.type === 1 ||
      commandOptionData.type === 2
    );
  }

  /**
   * Verifies if the given message button options support URL's or not.
   * @param {MessageButtonOptions} messageButtonOptions The message button options to check.
   * @returns {boolean} True if the option supports URL's, false otherwise.
   */
  static isLinkButtonOptions(messageButtonOptions) {
    return messageButtonOptions.style === 'LINK' || messageButtonOptions.style === 5;
  }

  /**
   * Verifies if the given message button options support doesn't support URL's or not.
   * @param {MessageButtonOptions} messageButtonOptions The message button options to check.
   * @returns {boolean} True if the option doesn't support URL's, false otherwise.
   */
  static isInteractionButtonOptions(messageButtonOptions) {
    return !TypeGuards.isLinkButtonOptions(messageButtonOptions);
  }
}

module.exports = TypeGuards;
