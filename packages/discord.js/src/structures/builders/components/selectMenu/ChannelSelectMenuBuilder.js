'use strict';

const { ChannelSelectMenuBuilder: BuildersChannelSelectMenu } = require('@discordjs/builders');
const { toSnakeCase } = require('../../../../util/Transformers');

/**
 * Class used to build select menu components to be sent through the API
 * @extends {BuildersChannelSelectMenu}
 */
class ChannelSelectMenuBuilder extends BuildersChannelSelectMenu {
  constructor(data = {}) {
    super(toSnakeCase(data));
  }
}

module.exports = ChannelSelectMenuBuilder;

/**
 * @external BuildersChannelSelectMenu
 * @see {@link https://discord.js.org/docs/packages/builders/stable/ChannelSelectMenuBuilder:Class}
 */
