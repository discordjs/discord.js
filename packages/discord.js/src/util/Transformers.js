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
      customMessage: autoModerationAction.metadata.custom_message ?? null,
    },
  };
}

/**
 * Transforms an API message interaction metadata object to a camel-cased variant.
 * @param {Client} client The client
 * @param {APIMessageInteractionMetadata} messageInteractionMetadata The metadata to transform
 * @returns {MessageInteractionMetadata}
 * @ignore
 */
function _transformAPIMessageInteractionMetadata(client, messageInteractionMetadata) {
  return {
    id: messageInteractionMetadata.id,
    type: messageInteractionMetadata.type,
    user: client.users._add(messageInteractionMetadata.user),
    authorizingIntegrationOwners: messageInteractionMetadata.authorizing_integration_owners,
    originalResponseMessageId: messageInteractionMetadata.original_response_message_id ?? null,
    interactedMessageId: messageInteractionMetadata.interacted_message_id ?? null,
    triggeringInteractionMetadata: messageInteractionMetadata.triggering_interaction_metadata
      ? _transformAPIMessageInteractionMetadata(client, messageInteractionMetadata.triggering_interaction_metadata)
      : null,
  };
}

module.exports = { toSnakeCase, _transformAPIAutoModerationAction, _transformAPIMessageInteractionMetadata };
