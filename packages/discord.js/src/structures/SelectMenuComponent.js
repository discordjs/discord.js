'use strict';

const { SelectMenuComponent: BuildersSelectMenuComponent } = require('@discordjs/builders');
const snakecase = require('snakecase-keys');

class SelectMenuComponent extends BuildersSelectMenuComponent {
  constructor(data) {
    super(snakecase(data));
  }
}

module.exports = SelectMenuComponent;
