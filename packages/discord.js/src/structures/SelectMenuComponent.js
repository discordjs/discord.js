'use strict';

const Builders = require('@discordjs/builders');
const Components = require('../util/Components');

class SelectMenuComponent extends Builders.SelectMenuComponent {
  constructor(data) {
    super(Components.transformJSON(data));
  }
}

module.exports = SelectMenuComponent;
