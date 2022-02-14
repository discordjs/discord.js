'use strict';

const { TextInputComponent: BuildersTextInputComponent } = require('@discordjs/builders');
const snakecase = require('snakecase-keys');

class TextInputComponent extends BuildersTextInputComponent {
  constructor(data = {}) {
    super(snakecase(data));
  }
}

module.exports = TextInputComponent;
