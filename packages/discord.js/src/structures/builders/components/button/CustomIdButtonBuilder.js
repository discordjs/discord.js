const {
  CustomIdButtonBuilder: BuildersCustomIdButton,
  PrimaryButtonBuilder: BuildersPrimaryButton,
  SecondaryButtonBuilder: BuildersSecondaryButton,
  SuccessButtonBuilder: BuildersSuccessButton,
  DangerButtonBuilder: BuildersDangerButton,
} = require('@discordjs/builders');
const { Mixin } = require('ts-mixer');
const EmojiOrLabelButtonMixin = require('./mixin/EmojiOrLabelButtonMixin');
const BaseButtonBuilder = require('./ButtonBuilder');

/**
 * Represents a button builder with custom IDs.
 * @extends {BuildersCustomIdButton}
 */
class CustomIdButtonBuilder extends Mixin(BaseButtonBuilder, BuildersCustomIdButton, EmojiOrLabelButtonMixin) {}

class PrimaryButtonBuilder extends Mixin(CustomIdButtonBuilder, BuildersPrimaryButton) {}

class SecondaryButtonBuilder extends Mixin(CustomIdButtonBuilder, BuildersSecondaryButton) {}

class SuccessButtonBuilder extends Mixin(CustomIdButtonBuilder, BuildersSuccessButton) {}

class DangerButtonBuilder extends Mixin(CustomIdButtonBuilder, BuildersDangerButton) {}

module.exports.CustomIdBuilder = CustomIdButtonBuilder;

module.exports.PrimaryButtonBuilder = PrimaryButtonBuilder;

module.exports.SecondaryButtonBuilder = SecondaryButtonBuilder;

module.exports.SuccessButtonBuilder = SuccessButtonBuilder;

module.exports.DangerButtonBuilder = DangerButtonBuilder;
