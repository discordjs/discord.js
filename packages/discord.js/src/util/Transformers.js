'use strict';

const { isJSONEncodable } = require('@discordjs/util');
const snakeCase = require('lodash.snakecase');

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
    },
  };
}

module.exports = { toSnakeCase, _transformAPIAutoModerationAction };
