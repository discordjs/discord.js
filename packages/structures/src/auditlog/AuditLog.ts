import type { APIAuditLog } from 'discord-api-types/v10';
import { Structure } from '../Structure';
import type { Partialize } from '../utils/types';

/**
 * Represents an audit log on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks Intentionally does not export `application_commands`, `audit_log_entries`, `auto_moderation_rules`, `guild_scheduled_events`, `integrations`, `threads`, `users`, and `webhooks`,
 * so that extending classes can resolve objects to `ApplicationCommand[]`, `AuditLogEntry[]`, `AutoModerationRule[]`, `GuildScheduledEvent[]`, `GuildIntegration[]`, `ThreadChannel[]`, `User[]`, and `Webhook[]`, respectively.
 */
export class AuditLog<Omitted extends keyof APIAuditLog | '' = ''> extends Structure<APIAuditLog, Omitted> {
	/**
	 * @param data - The raw data received from the API for the audit log.
	 */
	public constructor(data: Partialize<APIAuditLog, Omitted>) {
		super(data);
	}
}
