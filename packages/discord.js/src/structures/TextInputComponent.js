'use strict';

const { TextInputComponent: BuildersTextInputComponent } = require('@discordjs/builders');
const Components = require('../util/Components');

class TextInputComponent extends BuildersTextInputComponent {
  constructor(data) {
    super(Components.transformJSON(data));
  }
}

module.exports = TextInputComponent;
