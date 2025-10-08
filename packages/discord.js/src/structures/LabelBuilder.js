'use strict';

const { LabelBuilder: BuildersLabel } = require('@discordjs/builders');
const { isJSONEncodable } = require('@discordjs/util');
const { toSnakeCase } = require('../util/Transformers');

/**
 * Represents a label builder.
 * @extends {BuildersLabel}
 */
class LabelBuilder extends BuildersLabel {
  constructor(data) {
    super(toSnakeCase(data));
  }

  /**
   * Creates a new label builder from JSON data
   * @param {LabelBuilder|LabelComponent|APILabelComponent} other The other data
   * @returns {LabelBuilder}
   */
  static from(other) {
    return new this(isJSONEncodable(other) ? other.toJSON() : other);
  }
}

module.exports = LabelBuilder;

/**
 * @external BuildersLabel
 * @see {@link https://discord.js.org/docs/packages/builders/stable/LabelBuilder:Class}
 */
