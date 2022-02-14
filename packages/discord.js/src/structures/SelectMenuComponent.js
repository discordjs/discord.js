'use strict';

const { SelectMenuComponent: BuildersSelectMenuComponent } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

class SelectMenuComponent extends BuildersSelectMenuComponent {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
  }
}

module.exports = SelectMenuComponent;
