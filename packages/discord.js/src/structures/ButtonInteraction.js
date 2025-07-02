'use strict';

const { MessageComponentInteraction } = require('./MessageComponentInteraction.js');

/**
 * Represents a button interaction.
 *
 * @extends {MessageComponentInteraction}
 */
class ButtonInteraction extends MessageComponentInteraction {}

exports.ButtonInteraction = ButtonInteraction;
