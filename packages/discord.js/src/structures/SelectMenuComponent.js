'use strict';

const { SelectMenuComponent: BuildersSelectMenuComponent } = require('@discordjs/builders');
const Components = require('../util/Components');

class SelectMenuComponent extends BuildersSelectMenuComponent {
  constructor(data) {
    super(Components.transformJSON(data));
  }
}

module.exports = SelectMenuComponent;
