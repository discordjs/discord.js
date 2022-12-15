import type { REST } from '@discordjs/rest';
import {
	Routes,
	type RESTGetAPIApplicationRoleConnectionMetadataResult,
	type RESTPutAPIApplicationRoleConnectionMetadataResult,
	type RESTPutAPIApplicationCommandPermissionsJSONBody,
	type Snowflake,
} from 'discord-api-types/v10';

export class RoleConnectionsAPI {
	public constructor(private readonly rest: REST) {}

	/**
	 * Gets the role connection metadata records for the application
	 *
	 * @see {@link https://discord.com/developers/docs/resources/application-role-connection-metadata#get-application-role-connection-metadata-records}
	 * @param applicationId - The id of the application to get role connection metadata records for
	 */
	public async getMetadataRecords(applicationId: Snowflake) {
		return this.rest.get(
			Routes.applicationRoleConnectionMetadata(applicationId),
		) as Promise<RESTGetAPIApplicationRoleConnectionMetadataResult>;
	}

	/**
	 * Updates the role connection metadata records for the application
	 *
	 * @see {@link https://discord.com/developers/docs/resources/application-role-connection-metadata#update-application-role-connection-metadata-records}
	 * @param applicationId - The id of the application to update role connection metadata records for
	 * @param options - The new role connection metadata records
	 */
	public async updateMetadataRecords(
		applicationId: Snowflake,
		options: RESTPutAPIApplicationCommandPermissionsJSONBody,
	) {
		return this.rest.put(Routes.applicationRoleConnectionMetadata(applicationId), {
			body: options,
		}) as Promise<RESTPutAPIApplicationRoleConnectionMetadataResult>;
	}
}
