/* eslint-disable tsdoc/syntax */
import type { APIAuditLogOptions } from 'discord-api-types/v10';
import { Structure } from '../Structure';
import { kData } from '../utils/symbols';
import type { Partialize } from '../utils/types';

/**
 * Represents the audit log options on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 */
export class AuditLogOptions<Omitted extends keyof APIAuditLogOptions | '' = ''> extends Structure<
	APIAuditLogOptions,
	Omitted
> {
	/**
	 * @param data - The raw data received from the API for the audit log options.
	 */
	public constructor(data: Partialize<APIAuditLogOptions, Omitted>) {
		super(data);
	}

	/**
	 * Name of the auto moderation rule that was triggered.
	 */
	public get autoModerationRuleName() {
		return this[kData].auto_moderation_rule_name;
	}

	/**
	 * Trigger type of the auto moderation rule that was triggered.
	 */
	public get autoModerationRuleTriggerType() {
		return this[kData].auto_moderation_rule_trigger_type;
	}

	/**
	 * The channel in which the entities were targeted.
	 */
	public get channelId() {
		return this[kData].channel_id;
	}

	/**
	 * The number of entities that were targeted.
	 */
	public get count() {
		return this[kData].count;
	}

	/**
	 * Number of days after which inactive members were kicked.
	 */
	public get deleteMemberDays() {
		return this[kData].delete_member_days;
	}

	/**
	 * The id of the overwritten entity.
	 */
	public get id() {
		return this[kData].id;
	}

	/**
	 * The number of members removed by the prune.
	 */
	public get membersRemoved() {
		return this[kData].members_removed;
	}

	/**
	 * The id of the message that was targeted.
	 */
	public get messageId() {
		return this[kData].message_id;
	}

	/**
	 * Name of the role.
	 * #### Only present if the {@link AuditLogOptions.type} is set to `0`
	 */
	public get roleName() {
		return this[kData].role_name;
	}

	/**
	 * The type of overwritten entity - `"0"` for `role` or `"1"` for `member`
	 */
	public get type() {
		return this[kData].type;
	}

	/**
	 * The type of integration which performed the action.
	 */
	public get integrationType() {
		return this[kData].integration_type;
	}
}
