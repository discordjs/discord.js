'use strict';

const { ApplicationCommandType, InteractionType, ComponentType } = require('discord-api-types/v9');

class EnumResolvers extends null {
  static unknownKeyStrategy(val) {
    console.log(`Could not resolve enum value for ${val}`);
    return -1;
  }

  static resolveInteractionType(key) {
    switch (key) {
      case 'PING':
        return InteractionType.Ping;
      case 'APPLICATION_COMMAND':
        return InteractionType.ApplicationCommand;
      case 'MESSAGE_COMPONENT':
        return InteractionType.MessageComponent;
      case 'APPLICATION_COMMAND_AUTOCOMPLETE':
        return InteractionType.ApplicationCommandAutocomplete;
      default:
        return EnumResolvers.unknownKeyStrategy(key);
    }
  }

  static resolveApplicationCommandType(key) {
    switch (key) {
      case 'CHAT_INPUT':
        return ApplicationCommandType.ChatInput;
      case 'USER':
        return ApplicationCommandType.User;
      case 'MESSAGE':
        return ApplicationCommandType.Message;
      default:
        return EnumResolvers.unknownKeyStrategy(key);
    }
  }

  static resolveComponentType(key) {
    switch (key) {
      case 'ACTION_ROW':
        return ComponentType.ActionRow;
      case 'BUTTON':
        return ComponentType.Button;
      case 'SELECT_MENU':
        return ComponentType.SelectMenu;
      default:
        return EnumResolvers.unknownKeyStrategy(key);
    }
  }
}

// Precondition logic wrapper
function preconditioner(func) {
  return key => {
    if (typeof key !== 'string' && typeof key !== 'number') {
      throw new Error('Enum value must be string or number');
    }

    if (typeof key === 'number') {
      return key;
    }

    return func(key);
  };
}

// Injects wrapper into class static methods.
function bindPreconditioner(obj) {
  Object.getOwnPropertyNames(obj).forEach(name => {
    console.log(name);
    if (typeof obj[name] !== 'function') {
      return;
    }

    obj[name] = preconditioner(obj[name]);
  });
}

// Bind precondition logic
bindPreconditioner(EnumResolvers);

module.exports = EnumResolvers;
