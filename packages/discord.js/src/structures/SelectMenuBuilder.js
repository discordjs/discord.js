'use strict';

const { SelectMenuBuilder: BuildersSelectMenuComponent } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

class SelectMenuBuilder extends BuildersSelectMenuComponent {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
  }
}

module.exports = SelectMenuBuilder;
