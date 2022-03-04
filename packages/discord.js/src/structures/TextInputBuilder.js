'use strict';

const { TextInputBuilder: BuildersTextInputComponent } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

class TextInputBuilder extends BuildersTextInputComponent {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
  }
}

module.exports = TextInputBuilder;
