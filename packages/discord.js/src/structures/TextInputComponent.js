'use strict';

const { TextInputComponent: BuildersTextInputComponent } = require('@discordjs/builders');
const Transformers = require('../util/Transformers');

class TextInputComponent extends BuildersTextInputComponent {
  constructor(data) {
    super(Transformers.toSnakeCase(data));
  }
}

module.exports = TextInputComponent;
