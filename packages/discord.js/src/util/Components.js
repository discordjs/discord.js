'use strict';

const { ComponentType } = require('discord-api-types/v10');
const { ActionRow } = require('../structures/ActionRow.js');
const { ButtonComponent } = require('../structures/ButtonComponent.js');
const { ChannelSelectMenuComponent } = require('../structures/ChannelSelectMenuComponent.js');
const { Component } = require('../structures/Component.js');
const { MentionableSelectMenuComponent } = require('../structures/MentionableSelectMenuComponent.js');
const { RoleSelectMenuComponent } = require('../structures/RoleSelectMenuComponent.js');
const { StringSelectMenuComponent } = require('../structures/StringSelectMenuComponent.js');
const { TextInputComponent } = require('../structures/TextInputComponent.js');
const { UserSelectMenuComponent } = require('../structures/UserSelectMenuComponent.js');

function createComponent(data) {
  if (data instanceof Component) {
    return data;
  }

  switch (data.type) {
    case ComponentType.ActionRow:
      return new ActionRow(data);
    case ComponentType.Button:
      return new ButtonComponent(data);
    case ComponentType.StringSelect:
      return new StringSelectMenuComponent(data);
    case ComponentType.TextInput:
      return new TextInputComponent(data);
    case ComponentType.UserSelect:
      return new UserSelectMenuComponent(data);
    case ComponentType.RoleSelect:
      return new RoleSelectMenuComponent(data);
    case ComponentType.MentionableSelect:
      return new MentionableSelectMenuComponent(data);
    case ComponentType.ChannelSelect:
      return new ChannelSelectMenuComponent(data);
    default:
      return new Component(data);
  }
}

exports.createComponent = createComponent;
