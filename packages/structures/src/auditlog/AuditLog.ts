import type { APIAuditLog } from 'discord-api-types/v10';
import { Structure } from '../Structure';
import type { Partialize } from '../utils/types';

/**
 * Represents an audit log on Discord.
 *
 * @typeParam Omitted - Specify the properties that will not be stored in the raw data field as a union, implement via `DataTemplate`
 * @remarks Has substructures `ApplicationCommand`, `AuditLogEntry`, `AutoModerationRule`, `GuildScheduledEvent`, `GuildIntegration`, `ThreadChannel`, `User`, and `Webhook`,
 * which need to be instantiated and stored by an extending class using it
 */
export class AuditLog<Omitted extends keyof APIAuditLog | '' = ''> extends Structure<APIAuditLog, Omitted> {
	/**
	 * @param data - The raw data received from the API for the audit log.
	 */
	public constructor(data: Partialize<APIAuditLog, Omitted>) {
		super(data);
	}
}
