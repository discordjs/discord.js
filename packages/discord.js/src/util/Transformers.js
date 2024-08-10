'use strict';

const { isJSONEncodable } = require('@discordjs/util');
const snakeCase = require('lodash.snakecase');
const PermissionsBitField = require('./PermissionsBitField');

/**
 * Transforms camel-cased keys into snake cased keys
 * @param {*} obj The object to transform
 * @returns {*}
 */
function toSnakeCase(obj) {
  if (typeof obj !== 'object' || !obj) return obj;
  if (obj instanceof Date) return obj;
  if (isJSONEncodable(obj)) return toSnakeCase(obj.toJSON());
  if (Array.isArray(obj)) return obj.map(toSnakeCase);
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [snakeCase(key), toSnakeCase(value)]));
}

/**
 * Transforms an API auto moderation action object to a camel-cased variant.
 * @param {APIAutoModerationAction} autoModerationAction The action to transform
 * @returns {AutoModerationAction}
 * @ignore
 */
function _transformAPIAutoModerationAction(autoModerationAction) {
  return {
    type: autoModerationAction.type,
    metadata: {
      durationSeconds: autoModerationAction.metadata.duration_seconds ?? null,
      channelId: autoModerationAction.metadata.channel_id ?? null,
      customMessage: autoModerationAction.metadata.custom_message ?? null,
    },
  };
}

/**
 * Transforms an API integration types config map to a camel-cased variant.
 * @param {APIApplicationIntegrationTypesConfigMap} integrationTypesConfiguration The data to transform
 * @returns {IntegrationTypesConfiguration}
 * @ignore
 */
function _transformAPIIntegrationTypesConfiguration(integrationTypesConfiguration) {
  return Object.fromEntries(
    Object.entries(integrationTypesConfiguration).map(([key, context]) => {
      const data = context
        ? {
            oauth2InstallParams: {
              scopes: context.oauth2_install_params?.scopes ?? null,
              permissions: context.oauth2_install_params
                ? new PermissionsBitField(context.oauth2_install_params.permissions).freeze()
                : null,
            },
          }
        : null;
      return [parseInt(key), data];
    }),
  );
}

module.exports = { toSnakeCase, _transformAPIAutoModerationAction, _transformAPIIntegrationTypesConfiguration };
