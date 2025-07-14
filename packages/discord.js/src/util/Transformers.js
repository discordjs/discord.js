'use strict';

const { isJSONEncodable } = require('@discordjs/util');
const snakeCase = require('lodash.snakecase');
const { resolvePartialEmoji } = require('./Util');

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
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      snakeCase(key),
      // TODO: The special handling of 'emoji' is just a temporary fix for v14, will be dropped in v15.
      // See https://github.com/discordjs/discord.js/issues/10909
      key === 'emoji' && typeof value === 'string' ? resolvePartialEmoji(value) : toSnakeCase(value),
    ]),
  );
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

/**
 * Transforms a guild scheduled event recurrence rule object to a snake-cased variant.
 * @param {GuildScheduledEventRecurrenceRuleOptions} recurrenceRule The recurrence rule to transform
 * @returns {APIGuildScheduledEventRecurrenceRule}
 * @ignore
 */
function _transformGuildScheduledEventRecurrenceRule(recurrenceRule) {
  return {
    start: new Date(recurrenceRule.startAt).toISOString(),
    frequency: recurrenceRule.frequency,
    interval: recurrenceRule.interval,
    by_weekday: recurrenceRule.byWeekday,
    by_n_weekday: recurrenceRule.byNWeekday,
    by_month: recurrenceRule.byMonth,
    by_month_day: recurrenceRule.byMonthDay,
  };
}

/**
 * Transforms API incidents data to a camel-cased variant.
 * @param {APIIncidentsData} data The incidents data to transform
 * @returns {IncidentActions}
 * @ignore
 */
function _transformAPIIncidentsData(data) {
  return {
    invitesDisabledUntil: data.invites_disabled_until ? new Date(data.invites_disabled_until) : null,
    dmsDisabledUntil: data.dms_disabled_until ? new Date(data.dms_disabled_until) : null,
    dmSpamDetectedAt: data.dm_spam_detected_at ? new Date(data.dm_spam_detected_at) : null,
    raidDetectedAt: data.raid_detected_at ? new Date(data.raid_detected_at) : null,
  };
}

/**
 * Transforms a collectibles object to a camel-cased variant.
 *
 * @param {APICollectibles} collectibles The collectibles to transform
 * @returns {Collectibles}
 * @ignore
 */
function _transformCollectibles(collectibles) {
  if (!collectibles.nameplate) return { nameplate: null };

  return {
    nameplate: {
      skuId: collectibles.nameplate.sku_id,
      asset: collectibles.nameplate.asset,
      label: collectibles.nameplate.label,
      palette: collectibles.nameplate.palette,
    },
  };
}

module.exports = {
  toSnakeCase,
  _transformAPIAutoModerationAction,
  _transformAPIMessageInteractionMetadata,
  _transformGuildScheduledEventRecurrenceRule,
  _transformAPIIncidentsData,
  _transformCollectibles,
};
