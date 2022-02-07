'use strict';

const Builders = require('@discordjs/builders');
const Components = require('../util/Components');

class ButtonComponent extends Builders.ButtonComponent {
  constructor(data) {
    super(Components.transformJSON(data));
  }
}

module.exports = ButtonComponent;
